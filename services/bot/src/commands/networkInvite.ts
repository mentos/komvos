import { Guild, TextChannel } from "discord.js";
import GuildBroadcastPrompt from "../lib/GuildBroadcastPrompt";
import {
  AddGuildToNetwork,
  GetGuildNetworksCount,
  GetGuildOwnedNetwork,
} from "../lib/repositories";
import createBaseCommand, { CommandError, CommandTargetError } from "./base";

const validateGuildInvitationStatus = (guild: Guild) => (allowInvites: boolean): void => {
  if (!allowInvites) {
    throw new CommandError(
      `Server **${guild.name}** has turned off network invitations for **Komvos**. ` +
        "Please let the server administrator know and try again when everything is setup."
    );
  }
};

export default createBaseCommand({
  name: "network-invite",

  description: "Invite a server to join your network",

  guildOnly: true,

  guildCooldown: 60,

  memberPermissions: ["BanMembers"],

  usage: "`k!network-invite [server_id] [passphrase]`",

  exec: async function () {
    const targetGuildId = this.parsedCommand.reader.getString();
    const passphrase = this.parsedCommand.reader.getString();
    const targetGuild = this.client.repo.GetGuild(targetGuildId);
    const network = await GetGuildOwnedNetwork(this.message.guild!, passphrase);

    const { channelId } = await this.client.repo.GetGuildClientSettings(
      this.guild!.id
    );

    this.client.repo.GetGuildChannel(channelId);

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

    const targetChannel = this.client.repo.GetGuildChannel(targetChannelId);

    if (!targetChannel) {
      throw new CommandError("Target guild does not have a valid announcements channel set up.");
    }

    await new GuildBroadcastPrompt({
      broadcaster: this.member!,
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
          `User **${this.author.tag}** of the **${this.guild!.name}** server ` +
          `is inviting you to a **Komvos** network ` +
          `**\`${network.uuid}\`**. ` +
          "Please, accept or reject the invitation by reacting.",
      },
      targetChannel,
      targetExpirationMessage: `Your **Komvos** network invitation from **${this.guild!.name}** has expired.`,
      time: 60000,
    }).send();
  },

  handleAcceptance: async function (
    targetGuild: Guild,
    targetChannel: TextChannel,
    network: any,
    announcementsChannel: TextChannel
  ): Promise<void> {
    await AddGuildToNetwork(targetGuild.id, network.id);
    await announcementsChannel.send({
      content: `Folks at server **${targetGuild.name}** accepted your **Komvos** network invitation!`
    });
    await targetChannel.send({
      content: `Congrats! You are now member of **Komvos** network: \`${network.uuid}\`!`
    });
  },

  handleRejection: async function (
    targetGuild: Guild,
    announcementsChannel: TextChannel
  ): Promise<void> {
    await announcementsChannel.send({
      content: `Folks at server **${targetGuild.name}** rejected your **Komvos** network invitation.`
    });
  },
});