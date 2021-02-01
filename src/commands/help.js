const EmbedBuilder = require("../lib/EmbedBuilder");
const { isEmpty } = require("../utils");
const base = require("./base");

module.exports = base({
  name: "help",

  description: "Show this message",

  usage: "`k!help`",

  guildOnly: true,

  memberPermissions: ["banMembers"],

  exec: async function () {
    const embed = new EmbedBuilder({ command: true })
      .title("Available bot commands:")
      .description(
        this.client.commands
          .filter((c) => !isEmpty(c.usage))
          .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
          .map(
            (c) =>
              `⮩ \`${c.usage}\`\n${
                c.description || ""
              } (_${c.memberPermissions.join(", ")}_).`
          )
          .join("\n\n")
      )
      .timestamp().sendable;

    await this.channel.createMessage({ embed });
  },
});
