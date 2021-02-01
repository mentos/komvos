const GuildBroadcastPrompt = require("../lib/GuildBroadcastPrompt");
const {
  AddGuildToNetwork,
  GetGuildNetworksCount,
  GetGuildOwnedNetwork,
} = require("../lib/resourceRepo");
const base = require("./base");

const { CommandError, CommandTargetError } = base;

module.exports = base({
  name: "network-invite",

  description: "Invite a server to join your network",

  guildOnly: true,

  guildCooldown: 60,

  memberPermissions: ["banMembers"],

  usage: "`k!network-invite [server_id] [passphrase]`",

  exec: async function () {
    const targetGuildId = this.parsedCommand.reader.getString();
    const passphrase = this.parsedCommand.reader.getString();
    const targetGuild = this.client.repo.GetGuild(targetGuildId);
    const network = await GetGuildOwnedNetwork(this.message.guild, passphrase);

    const { channelId } = await this.client.repo.GetGuildClientSettings(
      this.guild.id
    );

    this.client.repo.GetGuildChannel(this.guild, channelId);

    if ((await GetGuildNetworksCount(targetGuild.id)).count > 0) {
      throw new CommandTargetError(
        `Server **${targetGuild.name}** is already a member of a **Komvos** network. ` +
          "Please let the server administrator know and try again when everything is setup."
      );
    }

    const {
      allowInvites,
      channelId: targetChannelId,
    } = await this.client.repo.GetGuildClientSettings(targetGuild.id);

    validateGuildInvitationStatus(targetGuild)(allowInvites);

    const targetChannel = this.client.repo.GetGuildChannel(
      targetGuild,
      targetChannelId
    );

    await new GuildBroadcastPrompt({
      broadcaster: this.member,
      broadcastChannel: this.channel,
      expirationMessage: `Your Komvos network invitation to **${targetGuild.name}** has expired.`,
      onAccept: this.handleAcceptance.bind(
        this,
        targetGuild,
        targetChannel,
        network,
        this.channel
      ),
      onReject: this.handleRejection.bind(this, targetGuild, this.channel),
      promptContent: {
        content:
          `User **${this.author.tag}** of the **${this.guild.name}** server ` +
          `is inviting you to a **Komvos** network ` +
          `**\`${network.uuid}\`**. ` +
          "Please, accept or reject the invitation by reacting.",
      },
      targetChannel,
      targetExpirationMessage: `Your **Komvos** network invitation from **${this.guild.name}** has expired.`,
      time: 60000,
    }).send();
  },

  handleAcceptance: async function (
    targetGuild,
    targetChannel,
    network,
    announcementsChannel
  ) {
    await AddGuildToNetwork(targetGuild.id, network.id);
    await announcementsChannel.createMessage(
      `Folks at server **${targetGuild.name}** accepted your **Komvos** network invitation!`
    );
    await targetChannel.createMessage(
      `Congrats! You are now member of **Komvos** network: \`${network.uuid}\`!`
    );
  },

  handleRejection: async function (targetGuild, announcementsChannel) {
    await announcementsChannel.createMessage(
      `Folks at server **${targetGuild.name}** rejected your **Komvos** network invitation.`
    );
  },
});

const validateGuildInvitationStatus = (guild) => (allowInvites) => {
  if (!allowInvites) {
    throw new CommandError(
      `Server **${guild.name}** has turned off network invitations for **Komvos**. ` +
        "Please let the server administrator know and try again when everything is setup."
    );
  }
};
