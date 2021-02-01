const { successEmbed } = require("../lib/EmbedBuilder");
const {
  GetGuildActiveNetwork,
  GetNetworkGuilds,
} = require("../lib/resourceRepo");
const base = require("./base");

module.exports = base({
  name: "network-info",

  description: "Show network information",

  usage: "`k!network-info`",

  guildOnly: true,

  memberPermissions: ["banMembers"],

  exec: async function () {
    const network = await GetGuildActiveNetwork(this.guild.id);
    const networksGuilds = await GetNetworkGuilds(network.id);

    let owner;
    try {
      owner = this.client.repo.GetGuild(network.owning_guild_id);
    } catch (e) {
      owner = "Owner unreachable";
    }

    const unreachableGuilds = [];
    const description = networksGuilds
      .map((g) => {
        try {
          const guild = this.client.repo.GetGuild(g.guild_id);
          return `⮩ ${truncate(guild.name)} _(${g.created_at.toDateString()})_`;
        } catch (e) {
          return unreachableGuilds.push(g.id);
        }
      })
      .sort()
      .join("\n");

    this.channel.createMessage({
      embed: successEmbed({
        title: "Network information",
        titlePrefix: "",
        description: `${description} ${
          unreachableGuilds.length
            ? `\n\nUnreachable guilds: ${unreachableGuilds.join(", ")}`
            : ""
        }`,
        fields: [
          ["Network ID", network.uuid],
          ["Network Creation Date", network.established_at.toDateString()],
          ["Network Administrator", owner.name],
        ],
      }),
    });
  },
});

const truncate = (text, length = 25) =>
  `${text.slice(0, length)}${text.length > length ? "…" : ""}`.padEnd(
    length + 5,
    " "
  );
