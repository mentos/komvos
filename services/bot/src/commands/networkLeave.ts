import { Guild, TextChannel } from "discord.js";
import GuildBroadcastPrompt from "../lib/GuildBroadcastPrompt";
import {
  GetGuildActiveNetwork,
  RemoveGuildFromNetwork,
} from "../lib/repositories";
import createBaseCommand, { CommandError } from "./base";

interface HandleAcceptanceParams {
  announcementsChannel: TextChannel;
  network: any;
  guild: Guild;
  targetChannel: TextChannel | null;
  targetGuild: Guild;
}

interface HandleRejectionParams {
  announcementsChannel: TextChannel;
}

export default createBaseCommand({
  name: "network-leave",

  description: "Leave a network",

  guildOnly: true,

  guildCooldown: 30,

  memberPermissions: ["Administrator"],

  usage: "`k!network-leave`",

  exec: async function () {
    const network = await GetGuildActiveNetwork(this.guild!.id);

    if (network.owning_guild_id === this.guild!.id) {
      throw new CommandError(
        "A network admin cannot leave a network, only disband it."
      );
    }

    const targetGuild = this.client.repo.GetGuild(network.owning_guild_id);
    let targetChannel: TextChannel | null = null;

    try {
      const settings = await this.client.repo.GetGuildClientSettings(
        targetGuild.id
      );
      targetChannel = this.client.repo.GetGuildChannel(settings.channelId);
    } catch (e) {
      console.trace(e);
    }

    const onAccept = this.handleAcceptance({
      announcementsChannel: this.channel,
      guild: this.guild!,
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
          `You're about to leave network \`${network.uuid}\` owned by server **${targetGuild.name}**. **Are you sure?**` +
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
  }: HandleAcceptanceParams): () => Promise<void> {
    return async () => {
      await RemoveGuildFromNetwork(guild.id, network.id);
      await announcementsChannel.send({
        content: `You left network **\`${network.uuid}\`**. You will no longer receive broadcasts from it. ` +
          (guild ? `Server **${targetGuild.name}** has been notified.` : "") +
          (!targetChannel
            ? ` Server **${targetGuild.name}** was **NOT** notified as there is NO ` +
              `announcements channel setup on that server.`
            : "")
      });

      if (targetChannel)
        await targetChannel.send({
          content: `Server **${guild.name}** has left your network. ` +
            `You will receive no more notifications from them.`
        });
    };
  },

  handleRejection: function ({ announcementsChannel }: HandleRejectionParams): () => Promise<void> {
    return async () => {
      await announcementsChannel.send({ content: "OK, boss." });
    };
  },
});