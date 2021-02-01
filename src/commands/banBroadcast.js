const base = require("./base");
const BroadcastReport = require("../lib/BroadcastBanReport");

module.exports = base({
  name: "ban-broadcast",

  description: "Broadcast a ban to your network",

  usage: "`k!ban-broadcast [user_id] (reason)`",

  guildOnly: true,

  memberPermissions: ["banMembers"],

  exec: async function () {
    const bannedUserId = this.parsedCommand.reader.getUserID();

    if (!bannedUserId) {
      throw new base.CommandArgumentError("User id not provided");
    }

    const reason = this.parsedCommand.reader.getRemaining();
    const banInfo = await this.guild.getBan(bannedUserId);

    await BroadcastReport({
      banReason: reason || banInfo.reason,
      bannedUser: banInfo.user,
      client: this.client,
      fromCommand: true,
      guild: this.guild,
      guildChannel: this.channel,
    });
  },
});
