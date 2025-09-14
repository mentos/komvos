import { Guild, TextChannel } from "discord.js";
import GuildBroadcastPrompt from "../lib/GuildBroadcastPrompt";
import {
  GetGuildOwnedNetwork,
  GetNetworkGuildIdForKick,
  RemoveGuildFromNetwork,
} from "../lib/repositories";
import createBaseCommand from "./base";

interface HandleAcceptanceParams {
  announcementsChannel: TextChannel;
  network: any;
  targetChannel: TextChannel | null;
  targetGuild: Guild;
}

interface HandleRejectionParams {
  announcementsChannel: TextChannel;
}

export default createBaseCommand({
  name: "network-kick",

  description: "**⌘** Kick a server from your network",

  guildOnly: true,

  guildCooldown: 5,

  memberPermissions: ["Administrator"],

  usage: "`k!network-kick [server_id] [passphrase]`",

  exec: async function () {
    const targetGuildId = this.parsedCommand.reader.getString();
    const passphrase = this.parsedCommand.reader.getString();
    const network = await GetGuildOwnedNetwork(this.message.guild!, passphrase);
    const targetGuild = this.client.repo.GetGuild(targetGuildId);

    await GetNetworkGuildIdForKick(this.guild!.id, targetGuild.id, passphrase);

    let targetChannel: TextChannel | null = null;
    try {
      const settings = await this.client.repo.GetGuildClientSettings(
        targetGuild.id,
      );
      targetChannel = this.client.repo.GetGuildChannel(settings.channelId);
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
      broadcaster: this.member!,
      broadcastChannel: this.channel,
      expirationMessage: "Command has expired. Please try again.",
      onAccept,
      onReject,
      promptContent: {
        content:
          `You're about to kick server **${targetGuild.name}** from your network \`${network.uuid}\`. **Are you sure?**` +
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
  }: HandleAcceptanceParams): () => Promise<void> {
    return async () => {
      await RemoveGuildFromNetwork(targetGuild.id, network.id);
      await announcementsChannel.send({
        content:
          `Server **${targetGuild.name}** is no longer part of your network.` +
          (!targetChannel
            ? ` Server **${targetGuild.name}** was **NOT** notified as there is NO ` +
              `announcements channel setup on that server.`
            : ""),
      });

      if (targetChannel)
        await targetChannel.send({
          content:
            `You have been **kicked** from **Komvos** network: \`${network.uuid}\`. ` +
            `You will receive no more notifications from this network.`,
        });
    };
  },

  handleRejection: function ({
    announcementsChannel,
  }: HandleRejectionParams): () => Promise<void> {
    return async () => {
      await announcementsChannel.send({ content: "OK, boss." });
    };
  },
});
