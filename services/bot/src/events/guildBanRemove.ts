import { GuildBan } from "discord.js";
import { ExtendedClient } from "../client";
import BroadcastBanRevokeReport from "../lib/BroadcastBanRevokeReport";

export default (client: ExtendedClient) => async (ban: GuildBan) => {
  const settings = await client.repo.GetGuildClientSettings(ban.guild.id);
  const channel = client.repo.GetGuildChannel(settings.channelId);

  if (!channel) return;

  await BroadcastBanRevokeReport({
    bannedUserId: ban.user.id,
    channel,
    client,
    guild: ban.guild,
    reason: "",
  });
};
