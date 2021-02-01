const GuildBroadcastPrompt = require("../lib/GuildBroadcastPrompt");
const {
  GetGuildActiveNetwork,
  RemoveGuildFromNetwork,
} = require("../lib/resourceRepo");
const base = require("./base");

module.exports = base({
  name: "network-leave",

  description: "Leave a network",

  guildOnly: true,

  guildCooldown: 30,

  memberPermissions: ["administrator"],

  usage: "`k!network-leave`",

  exec: async function () {
    const network = await GetGuildActiveNetwork(this.guild.id);

    if (network.owning_guild_id === this.guild.id) {
      throw new base.CommandError(
        "A network admin cannot leave a network, only disband it."
      );
    }

    const targetGuild = await this.client.repo.GetGuild(
      network.owning_guild_id
    );
    let targetChannel;
    try {
      const settings = await this.client.repo.GetGuildClientSettings(
        targetGuild.id
      );
      targetChannel = this.client.repo.GetGuildChannel(
        targetGuild,
        settings.channelId,
        true
      );
    } catch (e) {
      console.trace(e);
    }

    const onAccept = this.handleAcceptance({
      announcementsChannel: this.channel,
      guild: this.guild,
      network,
      targetChannel,
      targetGuild,
    });

    const onReject = this.handleRejection({
      announcementsChannel: this.channel,
    });

    await new GuildBroadcastPrompt({
      broadcaster: this.member,
      broadcastChannel: this.channel,
      expirationMessage: "Command has expired. Please try again.",
      onAccept,
      onReject,
      promptContent: {
        content:
          `Your about to leave network \`${network.uuid}\` owned by server **${targetGuild.name}**. **Are you sure?**` +
          `${
            !targetChannel
              ? ` Server **${targetGuild.name}** **CANNNOT** be notified as ` +
                "there is NO announcements channel setup on that server."
              : ""
          }`,
      },
      targetChannel: this.channel,
      time: 30000,
    }).send();
  },

  handleAcceptance: function ({
    announcementsChannel,
    network,
    guild,
    targetChannel,
    targetGuild,
  }) {
    return async () => {
      await RemoveGuildFromNetwork(guild.id, network.id);
      await announcementsChannel.createMessage(
        `You left network **\`${network.uuid}\`**. You will no longer receive broadcasts from it. ` +
          (!!guild ? `Server **${targetGuild.name}** has been notified.` : "") +
          (!targetChannel
            ? ` Server **${targetGuild.name}** was **NOT** notified as there is NO ` +
              `announcements channel setup on that server.`
            : "")
      );

      if (targetChannel)
        await targetChannel.createMessage(
          `Server **${guild.name}** has left your network. ` +
            `You will receive no more notifications from them.`
        );
    };
  },

  handleRejection: function ({ announcementsChannel }) {
    return async () => {
      await announcementsChannel.createMessage("OK, boss.");
    };
  },
});
