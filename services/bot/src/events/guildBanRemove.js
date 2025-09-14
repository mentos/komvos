const BroadcastBanRevokeReport = require("../lib/BroadcastBanRevokeReport");

module.exports = (client) => async (guild, user) => {
  const settings = await client.repo.GetGuildClientSettings(guild.id);
  const channel = client.repo.GetGuildChannel(guild, settings.channelId, true);

  await BroadcastBanRevokeReport({
    bannedUserId: user.id,
    channel,
    client,
    guild,
    reason: "",
  });
};
