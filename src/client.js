const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, PermissionsBitField } = require("discord.js");

// const config = require("./config"); // TODO: Remove if not needed

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.MessageContent,
  ],
});

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
const commandFiles = fs.readdirSync(commandsDir);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);

  if (command.guildCooldown) {
    client.guildsCooldowns.set(command.name, new Collection());
  }
}

// Helper functions for Discord.js equivalents to Eris extensions
client.utils = {
  // Check if channel is a guild text channel
  isGuildTextChannel: (channel) => {
    return channel.type === 0; // GUILD_TEXT
  },

  // Get user tag (username#discriminator or username for new format)
  getUserTag: (user) => {
    return user.discriminator === "0" ? user.username : `${user.username}#${user.discriminator}`;
  },

  // Get member tag
  getMemberTag: (member) => {
    return client.utils.getUserTag(member.user);
  },

  // Check member permissions
  memberHasPermission: (member, permission) => {
    return member.permissions.has(PermissionsBitField.Flags[permission]);
  },

  // Get guild from message
  getGuildFromMessage: (message) => {
    return message.guild;
  }
};

module.exports = client;