import { successEmbed } from "../lib/EmbedBuilder";
import {
  GetGuildActiveNetwork,
  GetNetworkGuilds,
} from "../lib/repositories";
import createBaseCommand from "./base";

const truncate = (text: string, length: number = 25): string =>
  `${text.slice(0, length)}${text.length > length ? "…" : ""}`.padEnd(
    length + 5,
    " "
  );

export default createBaseCommand({
  name: "network-info",

  description: "Show network information",

  usage: "`k!network-info`",

  guildOnly: true,

  memberPermissions: ["BanMembers"],

  exec: async function () {
    const network = await GetGuildActiveNetwork(this.guild!.id);
    const networksGuilds = await GetNetworkGuilds(network.id);

    let owner: any;
    try {
      owner = this.client.repo.GetGuild(network.owning_guild_id);
    } catch {
      owner = { name: "Owner unreachable" };
    }

    const unreachableGuilds: string[] = [];
    const description = networksGuilds
      .map((g: any) => {
        try {
          const guild = this.client.repo.GetGuild(g.guild_id);
          return `⮩ ${truncate(guild.name)} _(${g.created_at.toDateString()})_`;
        } catch {
          unreachableGuilds.push(g.id);
          return null;
        }
      })
      .filter(Boolean)
      .sort()
      .join("\n");

    await this.channel.send({
      embeds: [successEmbed({
        title: "Network information",
        titlePrefix: "",
        description: `${description}${
          unreachableGuilds.length
            ? `\n\nUnreachable guilds: ${unreachableGuilds.join(", ")}`
            : ""
        }`,
        fields: [
          ["Network ID", network.uuid],
          ["Network Creation Date", network.established_at.toDateString()],
          ["Network Administrator", owner.name],
        ],
      })],
    });
  },
});