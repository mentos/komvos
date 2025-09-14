import fs from "fs";
import path from "path";
import {
  Client,
  Collection,
  GatewayIntentBits,
  PermissionsBitField,
  TextChannel,
  Guild,
  GuildMember,
  User,
  Message,
  Channel
} from "discord.js";

// Define types for client extensions
export interface Command {
  name: string;
  description?: string;
  usage?: string;
  memberPermissions?: string[];
  guildCooldown?: {
    timeout: number;
    limit: number;
  } | number;
  execute: (client: ExtendedClient, message: Message, args: string[]) => Promise<void> | void;
  run: (parsed: any, message: Message, client: ExtendedClient, settings: ClientSettings) => Promise<void> | void;
}

export interface ClientSettings {
  alertsChannelId: string;
  allowInvites: boolean;
  broadcasts: string;
  channelId: string;
  prefix: string;
  reportedRoleId: string;
}

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  guildsCooldowns: Collection<string, Collection<string, number>>;
  guildsSettings: Collection<string, ClientSettings>;
  repo: {
    GetGuild: (guildId: string) => Guild;
    GetGuildChannel: (channelId: string) => TextChannel | null;
    GetGuildClientSettings: (guildId: string) => ClientSettings;
    GetGuildsMutualMembers: (guildIds: string[]) => Promise<any>;
    SetGuildClientSettings: (guildId: string, settings: Partial<ClientSettings>) => Promise<void>;
  };
  utils: {
    isGuildTextChannel: (channel: Channel) => channel is TextChannel;
    getUserTag: (user: User) => string;
    getMemberTag: (member: GuildMember) => string;
    memberHasPermission: (member: GuildMember, permission: keyof typeof PermissionsBitField.Flags) => boolean;
    getGuildFromMessage: (message: Message) => Guild | null;
  };
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.MessageContent,
  ],
}) as ExtendedClient;

// Custom properties for bot functionality
client.commands = new Collection();
client.guildsCooldowns = new Collection();
client.guildsSettings = new Collection();

// Repository pattern for data access
client.repo = {
  GetGuild: require("./clientRepo/getGuild")(client),
  GetGuildChannel: require("./clientRepo/getGuildChannel")(client),
  GetGuildClientSettings: require("./clientRepo/getGuildClientSettings")(client),
  GetGuildsMutualMembers: require("./clientRepo/getGuildsMutualMembers")(client),
  SetGuildClientSettings: require("./clientRepo/setGuildClientSettings")(client),
};

// Load commands
const commandsDir = path.normalize(path.join(__dirname, ".", "commands"));
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  const commandModule = require(`./commands/${file}`);
  const command = commandModule.default || commandModule as Command;

  client.commands.set(command.name, command);

  if (command.guildCooldown) {
    client.guildsCooldowns.set(command.name, new Collection());
  }
}

// Helper functions for Discord.js equivalents to Eris extensions
client.utils = {
  // Check if channel is a guild text channel
  isGuildTextChannel: (channel: Channel): channel is TextChannel => {
    return channel.type === 0; // GUILD_TEXT
  },

  // Get user tag (username#discriminator or username for new format)
  getUserTag: (user: User): string => {
    return user.discriminator === "0" ? user.username : `${user.username}#${user.discriminator}`;
  },

  // Get member tag
  getMemberTag: (member: GuildMember): string => {
    return client.utils.getUserTag(member.user);
  },

  // Check member permissions
  memberHasPermission: (member: GuildMember, permission: keyof typeof PermissionsBitField.Flags): boolean => {
    return member.permissions.has(PermissionsBitField.Flags[permission]);
  },

  // Get guild from message
  getGuildFromMessage: (message: Message): Guild | null => {
    return message.guild;
  }
};

export default client;