const GuildBroadcastPrompt = require("../lib/GuildBroadcastPrompt");
const {
  DisbandNetwork,
  GetGuildOwnedNetwork,
  GetNetworkGuilds,
} = require("../lib/resourceRepo");
const { isEmpty } = require("../utils");
const base = require("./base");

module.exports = base({
  name: "network-disband",

  description: "**⌘** Disband your network",

  guildOnly: true,

  memberPermissions: ["administrator"],

  usage: "`k!network-disband [passphrase]`",

  exec: async function () {
    const passphrase = this.parsedCommand.reader.getString();
    const network = await GetGuildOwnedNetwork(this.message.guild, passphrase);
    const guilds = (await GetNetworkGuilds(network.id))
      .filter((ng) => ng.guild_id !== this.guild.id)
      .map((ng) => this.client.repo.GetGuild(ng.guild_id))
      .filter(isEmpty);

    const unreachableGuilds = [];
    const channels = await Promise.all(
      guilds.map(async (guild) => {
        const settings = await this.client.repo.GetGuildClientSettings(
          guild.id
        );
        try {
          return this.client.repo.GetGuildChannel(
            guild,
            settings.channelId,
            true
          );
        } catch (e) {
          unreachableGuilds.push(guild.name);
          console.trace(e);
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
      broadcaster: this.member,
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
  }) {
    return async () => {
      await DisbandNetwork(network);
      await announcementsChannel.createMessage(
        `Your network is now gone. ${
          unreachableGuilds.length
            ? `Unreachable servers: ${unreachableGuilds.join(", ")}`
            : ""
        }`
      );
      for (const channel of targetChannels) {
        await channel.createMessage(
          `Your **Komvos** network \`${network.uuid}\` ` +
            `has been **DISBANDED** by ${announcementsChannel.guild.namd}.`
        );
      }
    };
  },

  handleRejection: function ({ announcementsChannel }) {
    return async () => {
      await announcementsChannel.createMessage("OK, boss.");
    };
  },
});
