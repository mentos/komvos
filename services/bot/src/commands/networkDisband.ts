import { TextChannel } from "discord.js";
import GuildBroadcastPrompt from "../lib/GuildBroadcastPrompt";
import {
  DisbandNetwork,
  GetGuildOwnedNetwork,
  GetNetworkGuilds,
} from "../lib/repositories";
import { isEmpty } from "../utils";
import createBaseCommand from "./base";

interface HandleAcceptanceParams {
  announcementsChannel: TextChannel;
  network: any;
  targetChannels: (TextChannel | null)[];
  unreachableGuilds: string[];
}

interface HandleRejectionParams {
  announcementsChannel: TextChannel;
}

export default createBaseCommand({
  name: "network-disband",

  description: "**⌘** Disband your network",

  guildOnly: true,

  memberPermissions: ["Administrator"],

  usage: "`k!network-disband [passphrase]`",

  exec: async function () {
    const passphrase = this.parsedCommand.reader.getString();
    const network = await GetGuildOwnedNetwork(this.message.guild!, passphrase);
    const guilds = (await GetNetworkGuilds(network.id))
      .filter((ng: any) => ng.guild_id !== this.guild!.id)
      .map((ng: any) => this.client.repo.GetGuild(ng.guild_id))
      .filter((guild: any) => !isEmpty(guild));

    const unreachableGuilds: string[] = [];
    const channels = await Promise.all(
      guilds.map(async (guild: any) => {
        const settings = await this.client.repo.GetGuildClientSettings(
          guild.id
        );
        try {
          return this.client.repo.GetGuildChannel(settings.channelId);
        } catch (e) {
          unreachableGuilds.push(guild.name);
          console.trace(e);
          return null;
        }
      })
    );

    const onAccept = this.handleAcceptance({
      announcementsChannel: this.channel,
      network,
      targetChannels: channels,
      unreachableGuilds,
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
        content: `You are about to **DISBAND** your network \`${network.uuid}\`. **ARE YOU SURE? THIS IS IRREVERSIBLE AND ALL DATA WILL BE LOST!**`,
      },
      targetChannel: this.channel,
      time: 30000,
    }).send();
  },

  handleAcceptance: function ({
    announcementsChannel,
    network,
    targetChannels,
    unreachableGuilds,
  }: HandleAcceptanceParams): () => Promise<void> {
    return async () => {
      await DisbandNetwork(network);
      await announcementsChannel.send({
        content: `Your network is now gone.${
          unreachableGuilds.length
            ? ` Unreachable servers: ${unreachableGuilds.join(", ")}`
            : ""
        }`
      });

      for (const channel of targetChannels) {
        if (channel) {
          await channel.send({
            content: `Your **Komvos** network \`${network.uuid}\` ` +
              `has been **DISBANDED** by ${announcementsChannel.guild!.name}.`
          });
        }
      }
    };
  },

  handleRejection: function ({ announcementsChannel }: HandleRejectionParams): () => Promise<void> {
    return async () => {
      await announcementsChannel.send({ content: "OK, boss." });
    };
  },
});