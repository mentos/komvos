import createBaseCommand, { CommandArgumentError } from "./base";
import BroadcastBanRevokeReport from "../lib/BroadcastBanRevokeReport";

export default createBaseCommand({
  name: "ban-revoke",

  description: "Broadcast a ban revoke to your network",

  usage: "`k!ban-revoke [user_id] (reason)`",

  guildOnly: true,

  memberPermissions: ["BanMembers"],

  exec: async function () {
    const bannedUserId = this.parsedCommand.reader.getUserID();

    if (!bannedUserId) {
      throw new CommandArgumentError("User id not provided");
    }

    const reason = this.parsedCommand.reader.getRemaining();

    await BroadcastBanRevokeReport({
      bannedUserId,
      channel: this.channel,
      client: this.client,
      guild: this.guild!,
      reason,
    });
  },
});
