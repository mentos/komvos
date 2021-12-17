const fs = require("fs");
const path = require("path");
const Eris = require("eris");

Object.defineProperty(Eris.Channel.prototype, "isGuildTextChannel", {
  get: function () {
    return this.type === 0;
  },
});

Object.defineProperty(Eris.Member.prototype, "tag", {
  get: function () {
    return `${this.username}#${this.discriminator}`;
  },
});

Eris.Member.prototype.hasPermission = function (perm) {
  return this.permissions.has(perm);
};

Object.defineProperty(Eris.Message.prototype, "guild", {
  get: function () {
    return this.channel.guild;
  },
});

Object.defineProperty(Eris.User.prototype, "tag", {
  get: function () {
    return `${this.username}#${this.discriminator}`;
  },
});

const config = require("./config");

const client = new Eris(config.botToken);

client.commands = new Eris.Collection();
client.guildsCooldowns = new Eris.Collection();
client.guildsSettings = new Eris.Collection();
client.repo = {
  GetGuild: require("./clientRepo/getGuild")(client),
  GetGuildChannel: require("./clientRepo/getGuildChannel")(client),
  GetGuildClientSettings: require("./clientRepo/getGuildClientSettings")(
    client
  ),
  GetGuildsMutualMembers: require("./clientRepo/getGuildsMutualMembers")(
    client
  ),
  SetGuildClientSettings: require("./clientRepo/setGuildClientSettings")(
    client
  ),
};

const commandsDir = path.normalize(path.join(__dirname, ".", "commands"));
const commandFiles = fs.readdirSync(commandsDir);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);

  if (command.guildCooldown) {
    client.guildsCooldowns.set(command.name, new Eris.Collection());
  }
}

module.exports = client;
