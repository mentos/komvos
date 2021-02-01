const { CreateNetwork } = require("../lib/resourceRepo");
const { successEmbed } = require("../lib/EmbedBuilder");
const { errorCodes } = require("../db");
const base = require("./base");
const { CommandError } = base;

module.exports = base({
  name: "network-create",

  description: "Create a new network and configure notifications channel",

  guildOnly: true,

  guildCooldown: 30,

  memberPermissions: ["administrator"],

  usage: "`k!network-create [channel]`",

  exec: async function () {
    const channel = this.client.repo.GetGuildChannel(
      this.guild,
      this.parsedCommand.reader.getChannelID()
    );

    const settings = this.client.repo.GetGuildClientSettings(this.guild.id);

    try {
      const { passphrase, uuid } = await CreateNetwork(
        this.guild,
        this.author,
        {
          ...settings,
          channelId: channel.id,
        }
      );

      this.channel.createMessage({
        embed: successEmbed({
          title: "Your network is ready",
          command: true,
          description:
            "Keep these information in a safe place and then delete this message.\n\n" +
            "The `passphrase` is **required** for all `administrator` commands like `network-invite`, " +
            "`network-disband`, `network-kick`, etc.",
          fields: [
            ["Network ID", `\`${uuid}\``, true],
            ["Passphrase", `\`${passphrase}\``, true],
            ["Announcements Channel", channel.mention],
            ["Invitations", `\`k!network-invite [server id] ${passphrase}\``],
          ],
        }),
      });
    } catch (e) {
      throw new CommandError(
        errorCodes[e.code] === "unique_violation"
          ? "You already are in a network."
          : "An unknown error occurred. Please try again."
      );
    }
  },
});
