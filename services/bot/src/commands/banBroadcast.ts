import createBaseCommand, { CommandArgumentError } from "./base";
import BroadcastReport from "../lib/BroadcastBanReport";

export default createBaseCommand({
  name: "ban-broadcast",

  description: "Broadcast a ban to your network",

  usage: "`k!ban-broadcast [user_id] (reason)`",

  guildOnly: true,

  memberPermissions: ["BanMembers"],

  exec: async function () {
    const bannedUserId = this.parsedCommand.reader.getUserID();

    if (!bannedUserId) {
      throw new CommandArgumentError("User id not provided");
    }

    const reason = this.parsedCommand.reader.getRemaining();
    const banInfo = await this.guild!.bans.fetch(bannedUserId);

    await BroadcastReport({
      banReason: reason || banInfo.reason,
      bannedUser: banInfo.user,
      client: this.client,
      fromCommand: true,
      guild: this.guild!,
      guildChannel: this.channel,
    });
  },
});