import { CreateNetwork } from "../lib/repositories";
import { successEmbed } from "../lib/EmbedBuilder";
import { pgErrorCodes } from "../db/index";
import createBaseCommand, { CommandError } from "./base";

export default createBaseCommand({
  name: "network-create",

  description: "Create a new network and configure notifications channel",

  guildOnly: true,

  guildCooldown: 30,

  memberPermissions: ["Administrator"],

  usage: "`k!network-create [channel]`",

  exec: async function () {
    const channel = this.client.repo.GetGuildChannel(
      this.parsedCommand.reader.getChannelID(),
    );

    if (!channel) {
      throw new CommandError("Could not find the specified channel.");
    }

    const settings = this.client.repo.GetGuildClientSettings(this.guild!.id);

    try {
      const { passphrase, uuid } = await CreateNetwork(
        this.guild!,
        this.author,
        {
          ...settings,
          channelId: channel.id,
        },
      );

      await this.channel.send({
        embeds: [
          successEmbed({
            title: "Your network is ready",
            command: true,
            description:
              "Keep these information in a safe place and then delete this message.\n\n" +
              "The `passphrase` is **required** for all `administrator` commands like `network-invite`, " +
              "`network-disband`, `network-kick`, etc.",
            fields: [
              ["Network ID", `\`${uuid}\``, true],
              ["Passphrase", `\`${passphrase}\``, true],
              ["Announcements Channel", `<#${channel.id}>`, false],
              [
                "Invitations",
                `\`k!network-invite [server id] ${passphrase}\``,
                false,
              ],
            ],
          }),
        ],
      });
    } catch (e: any) {
      throw new CommandError(
        e.code === pgErrorCodes.UNIQUE_VIOLATION
          ? "You already are in a network."
          : "An unknown error occurred. Please try again.",
      );
    }
  },
});
