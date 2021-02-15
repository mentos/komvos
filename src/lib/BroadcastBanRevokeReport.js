const EmbedBuilder = require("../lib/EmbedBuilder");
const { isEmpty } = require("../utils");
const {
  GetBanBroadcast,
  GetGuildActiveNetwork,
  GetNetworkGuilds,
  RevokeBanBroadcast,
} = require("../lib/resourceRepo");

async function BroadcastBanRevokeReport({
  bannedUserId,
  channel,
  client,
  guild,
  reason,
}) {
  const network = await GetGuildActiveNetwork(guild.id);
  const banBroadcast = await GetBanBroadcast(
    network.id,
    bannedUserId,
    guild.id
  );

  if (isEmpty(banBroadcast)) {
    const description =
      "🔔 _Revoke broadcasts can be performed by original broadcasters or network administrator._";
    const embed = new EmbedBuilder({ color: 16763904, description }).sendable;
    await channel.createMessage({ embed });
    return;
  }

  if (
    banBroadcast.guild_id !== guild.id &&
    banBroadcast.guild_id !== network.owning_guild_id
  ) {
    const description =
      `🔔 _Cannot find a ban broadcast for user ID **${bannedUserId}**._ ` +
      `No need to take further action.`;
    const embed = new EmbedBuilder({ color: 16763904, description }).sendable;
    await channel.createMessage({ embed });
    return;
  }

  const tag = banBroadcast.banned_tag;
  const networkGuilds = (await GetNetworkGuilds(network.id))
    .filter(({ guild_id }) => guild_id !== guild.id)
    .map(({ guild_id }) => client.repo.GetGuild(guild_id));

  const channels = [];
  const invalidGuildChannels = [];

  for (const guild of networkGuilds) {
    try {
      const settings = await client.repo.GetGuildClientSettings(guild.id);
      const channel = client.repo.GetGuildChannel(guild.id, settings.channelId);
      channels.push(channel);
    } catch (e) {
      console.trace(e);
      invalidGuildChannels.push(guild.name);
    }
  }

  await RevokeBanBroadcast(banBroadcast.id, new Date().toISOString());

  for (const gchannel of channels) {
    await gchannel.createMessage({
      embed: new EmbedBuilder({
        author: {
          icon_url: guild.iconURL,
          name: guild.name,
        },
        description:
          `**User:** ${tag}\n**ID:** ${banBroadcast.banned_id}` +
          (reason ? `\n\n:small_blue_diamond: **Reason:** ${reason}.` : ""),
        footer: { text: `Network ID: ${network.uuid}` },
        title: "🔔 Ban Revoke",
      }).sendable,
    });
  }

  await channel.createMessage({
    embed: new EmbedBuilder({
      description:
        `✅ _**Ban revoke for ${banBroadcast.banned_tag} was broadcasted to network**_` +
        (invalidGuildChannels.length
          ? "\n\n :small_blue_diamond: **Note:** was not able to broadcast to servers: " +
            invalidGuildChannels.map((g) => `${g}`).join(", ") +
            "."
          : ""),
    }).sendable,
  });
}

module.exports = BroadcastBanRevokeReport;
