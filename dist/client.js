"use strict";
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.MessageContent,
    ],
});
client.commands = new Collection();
client.guildsCooldowns = new Collection();
client.guildsSettings = new Collection();
client.repo = {
    GetGuild: require("./clientRepo/getGuild")(client),
    GetGuildChannel: require("./clientRepo/getGuildChannel")(client),
    GetGuildClientSettings: require("./clientRepo/getGuildClientSettings")(client),
    GetGuildsMutualMembers: require("./clientRepo/getGuildsMutualMembers")(client),
    SetGuildClientSettings: require("./clientRepo/setGuildClientSettings")(client),
};
const commandsDir = path.normalize(path.join(__dirname, ".", "commands"));
const commandFiles = fs.readdirSync(commandsDir);
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    if (command.guildCooldown) {
        client.guildsCooldowns.set(command.name, new Collection());
    }
}
client.utils = {
    isGuildTextChannel: (channel) => {
        return channel.type === 0;
    },
    getUserTag: (user) => {
        return user.discriminator === "0" ? user.username : `${user.username}#${user.discriminator}`;
    },
    getMemberTag: (member) => {
        return client.utils.getUserTag(member.user);
    },
    memberHasPermission: (member, permission) => {
        return member.permissions.has(PermissionsBitField.Flags[permission]);
    },
    getGuildFromMessage: (message) => {
        return message.guild;
    }
};
module.exports = client;
//# sourceMappingURL=client.js.map