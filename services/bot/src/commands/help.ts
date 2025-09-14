import EmbedBuilder from "../lib/EmbedBuilder";
import { isEmpty } from "../utils";
import createBaseCommand from "./base";

export default createBaseCommand({
  name: "help",

  description: "Show this message",

  usage: "`k!help`",

  guildOnly: true,

  memberPermissions: ["BanMembers"],

  exec: async function () {
    const embed = new EmbedBuilder({ command: true })
      .title("Available bot commands:")
      .description(
        this.client.commands
          .filter((c) => !isEmpty(c.usage))
          .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
          .map(
            (c) =>
              `⮩ \`${c.usage || ""}\`\n${
                c.description || ""
              } (_${c.memberPermissions?.join(", ") || ""}_).`,
          )
          .join("\n\n"),
      )
      .timestamp().sendable;

    await this.channel.send({ embeds: [embed] });
  },
});
