const GuildBroadcastPrompt = require("../lib/GuildBroadcastPrompt");
const {
  GetGuildOwnedNetwork,
  GetNetworkGuildIdForKick,
  RemoveGuildFromNetwork,
} = require("../lib/resourceRepo");
const base = require("./base");

module.exports = base({
  name: "network-kick",

  description: "**⌘** Kick a server from your network",

  guildOnly: true,

  guildCooldown: 5,

  memberPermissions: ["administrator"],

  usage: "`k!network-kick [server_id] [passphrase]`",

  exec: async function () {
    const targetGuildId = this.parsedCommand.reader.getString();
    const passphrase = this.parsedCommand.reader.getString();
    const network = await GetGuildOwnedNetwork(this.message.guild, passphrase);
    const targetGuild = this.client.repo.GetGuild(targetGuildId);

    await GetNetworkGuildIdForKick(this.guild.id, targetGuild.id, passphrase);

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
          `Your about to kick server **${targetGuild.name}** from your network \`${network.uuid}\`. **Are you sure?**` +
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
    targetChannel,
    targetGuild,
  }) {
    return async () => {
      await RemoveGuildFromNetwork(targetGuild.id, network.id);
      await announcementsChannel.createMessage(
        `Server **${targetGuild.name}** is no longer part of your network.` +
          (!targetChannel
            ? ` Server **${targetGuild.name}** was **NOT** notified as there is NO ` +
              `announcements channel setup on that server.`
            : "")
      );

      if (targetChannel)
        await targetChannel.createMessage(
          `You have been **kicked** from **Komvos** network: \`${network.uuid}\`. ` +
            `You will receive no more notifications from this network.`
        );
    };
  },

  handleRejection: function ({ announcementsChannel }) {
    return async () => {
      await announcementsChannel.createMessage("OK, boss.");
    };
  },
});
