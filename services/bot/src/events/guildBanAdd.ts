import { GuildBan } from "discord.js";
import { ExtendedClient } from "../client";
import BroadcastReport from "../lib/BroadcastBanReport";

export default (client: ExtendedClient) => async (ban: GuildBan) => {
  await BroadcastReport({
    banReason: ban.reason,
    bannedUser: ban.user,
    client,
    guild: ban.guild,
    guildChannel: undefined,
  });
};