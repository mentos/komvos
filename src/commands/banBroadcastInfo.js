const base = require("./base");
const {
  GetGuildActiveNetwork,
  GetNetworkBroadcast,
} = require("../lib/resourceRepo");
const EmbedBuilder = require("../lib/EmbedBuilder");

module.exports = base({
  name: "ban-broadcast-info",

  description: "Get information about a network ban",

  usage: "`k!ban-broadcast-info [user_id]`",

  guildOnly: true,

  memberPermissions: ["banMembers"],

  exec: async function () {
    const bannedUserId = this.parsedCommand.reader.getUserID();

    if (!bannedUserId) {
      throw new base.CommandArgumentError("User id not provided");
    }

    const network = await GetGuildActiveNetwork(this.guild.id);
    const broadcasts = await GetNetworkBroadcast(network.id, bannedUserId);

    if (!broadcasts || !broadcasts.length) {
      const embed = new EmbedBuilder({
        color: 16763904,
        description: "**No network broadcasts were found for this member.**",
      }).sendable;
      await this.channel.createMessage({ embed });
      return;
    }

    const fields = broadcasts.map((b, i) => ({
      name: `${i + 1}. ${b.guild_name}${b.revoked_at && " **[REVOKED]**"}`,
      value: `\n` + b.report_type + `\n📆_${b.created_at.toDateString()}_`,
    }));

    const embed = new EmbedBuilder({
      color: 16763904,
      fields: [
        { name: "Banned User", value: broadcasts[0].banned_tag, inline: true },
        {
          name: "Mention",
          value: `<@${broadcasts[0].banned_id}>`,
          inline: true,
        },
        { name: "User ID", value: broadcasts[0].banned_id, inline: false },
        ...fields,
      ],
      footer: { text: `Network ID: ${network.uuid}` },
      title: "Network Ban Broadcast Info",
    }).sendable;

    await this.channel.createMessage({ embed });
  },
});
