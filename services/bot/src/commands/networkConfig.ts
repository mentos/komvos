import { PermissionsBitField, TextChannel, Role } from "discord.js";
const Constants = require("../constants");
import { UpdateGuildSettings } from "../lib/repositories";
import { failureEmbed, successEmbed } from "../lib/EmbedBuilder";
import { isEmpty } from "../utils";
import createBaseCommand, { CommandArgumentError } from "./base";

export default createBaseCommand({
  name: "network-config",

  description: "Configure Kombos network settings for your server",

  guildOnly: true,

  guildCooldown: 5,

  memberPermissions: ["Administrator"],

  usage:
    "`k!network-config [alertsChannel|prefix|channel|invites|permissions|role] (value)`",

  exec: async function () {
    const rawKey = this.parsedCommand.reader.getString();
    let settings;

    if (rawKey === "permissions") {
      settings = await this.client.repo.GetGuildClientSettings(this.guild!.id);

      if (!settings.channelId) {
        await this.channel.send({
          embeds: [failureEmbed({
            command: false,
            description: "No channel was found",
            fields: [],
            imageURL: null,
          })],
        });
        return;
      }

      const _channel = this.guild!.channels.cache.get(settings.channelId) as TextChannel;

      if (!_channel) {
        await this.channel.send({
          embeds: [failureEmbed({
            command: false,
            description: "No channel was found",
            fields: [],
            imageURL: null,
          })],
        });
        return;
      }

      const permissions = [
        "AddReactions",
        "EmbedLinks",
        "UseExternalEmojis",
        "ManageMessages",
        "MentionEveryone",
        "ReadMessageHistory",
        "ViewChannel",
        "SendMessages",
      ] as (keyof typeof PermissionsBitField.Flags)[];

      const _permissions = _channel.permissionsFor(this.client.user!.id);
      if (!_permissions) return;

      await this.replyWithConfig!(
        "Channel Permissions Check",
        permissions
          .map((s) => `\`${s}\`: ${_permissions.has(PermissionsBitField.Flags[s]) ? "OK" : "No permissions"}`)
          .join("\n")
      );

      const guildPermissions = this.guild!.members.me?.permissions;
      if (guildPermissions) {
        const allPermissions = Object.keys(PermissionsBitField.Flags) as (keyof typeof PermissionsBitField.Flags)[];
        await this.replyWithConfig!(
          "Server Permissions Check",
          allPermissions
            .map((s) => `\`${s}\`: ${guildPermissions.has(PermissionsBitField.Flags[s]) ? "OK" : "No permissions"}`)
            .join("\n")
        );
      }
      return;
    }

    const key = {
      alertsChannel: Constants.SETTINGS_ALERTS_CHANNEL_ID,
      channel: Constants.SETTINGS_CHANNEL_ID,
      invites: Constants.SETTINGS_ALLOW_INVITES,
      prefix: Constants.SETTINGS_PREFIX,
      role: Constants.SETTINGS_ROLE_ID,
    }[rawKey];

    if (isEmpty(key)) {
      await this.channel.send({
        embeds: [failureEmbed({
          command: true,
          description: `**Proper usage:** \`${this.usage}\`.`,
          fields: [],
          imageURL: null,
        })],
      });
      return;
    }

    let clearValue: boolean = false;
    let value: string | null;

    if (key === Constants.SETTINGS_CHANNEL_ID) {
      value = this.parsedCommand.reader.getChannelID();
    } else if (key === Constants.SETTINGS_ALERTS_CHANNEL_ID) {
      value = this.parsedCommand.reader.getChannelID();
    } else if (key === Constants.SETTINGS_ROLE_ID) {
      value = this.parsedCommand.reader.getString() || "";
      if (value === "clear") {
        clearValue = true;
        value = null;
      } else {
        const match = value.match(/^<@&?(\d{17,19})>$/);
        value = match && match[1] ? match[1] : null;
      }
    } else {
      value = this.parsedCommand.reader.getString();

      if (/<#(\d+)>/.test(value || ""))
        throw new CommandArgumentError(
          "Cannot use channel id for this config."
        );
    }

    settings = await this.client.repo.GetGuildClientSettings(this.guild!.id);

    const channel =
      key === Constants.SETTINGS_CHANNEL_ID &&
      this.client.repo.GetGuildChannel(
        isEmpty(value) ? settings.channelId : value!
      );

    const alertsChannel =
      key === Constants.SETTINGS_ALERTS_CHANNEL_ID &&
      this.client.repo.GetGuildChannel(
        isEmpty(value) ? settings.alertsChannelId : value!
      );

    const role: Role | null =
      key === Constants.SETTINGS_ROLE_ID
        ? this.guild!.roles.cache.get(
            !clearValue && isEmpty(value)
              ? settings.reportedRoleId
              : clearValue
              ? ""
              : value!
          ) || null
        : null;

    let configReply = "";

    if (channel) {
      configReply = `<#${channel.id}>`;
    } else if (alertsChannel) {
      configReply = `<#${alertsChannel.id}>`;
    } else if (key === Constants.SETTINGS_ROLE_ID) {
      configReply = role ? `<@&${role.id}>` : "none";
    } else if (key === Constants.SETTINGS_ALLOW_INVITES) {
      configReply = this.inviteLabels[settings[key] as keyof typeof this.inviteLabels];
    } else {
      configReply = (settings as any)[key] || "none";
    }

    if (isEmpty(value)) {
      await this.replyWithConfig(rawKey, configReply);
      return;
    }

    if (
      key === Constants.SETTINGS_ALLOW_INVITES &&
      !["allow", "deny"].includes(value!)
    ) {
      throw new CommandArgumentError(
        "Can only use `allow` or `deny` for this option."
      );
    }

    const newSettings = {
      ...settings,
      [key]:
        key === Constants.SETTINGS_ALLOW_INVITES
          ? this.inviteValues[value! as keyof typeof this.inviteValues]
          : value,
    };

    await UpdateGuildSettings(this.guild!.id, JSON.stringify(newSettings));

    await this.client.repo.SetGuildClientSettings(this.guild!.id, newSettings);

    await this.replyWithConfig(rawKey, configReply);
  },

  get inviteValues() {
    return {
      allow: true,
      deny: false,
    };
  },

  get inviteLabels() {
    return {
      true: "allow",
      false: "deny",
    };
  },

  replyWithConfig: async function (key: string, value: string, title: string = "Komvos Settings"): Promise<void> {
    await this.channel.send({
      embeds: [successEmbed({
        fields: [[key + ":", value]],
        title,
        titlePrefix: "",
      })],
    });
  },
});