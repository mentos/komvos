const Eris = require("eris");
const Constants = require("../constants");
const { UpdateGuildSettings } = require("../lib/resourceRepo");
const { failureEmbed, successEmbed } = require("../lib/EmbedBuilder");
const { isEmpty } = require("../utils");
const base = require("./base");

module.exports = base({
  name: "network-config",

  description: "Configure Kombos network settings for your server",

  guildOnly: true,

  guildCooldown: 5,

  memberPermissions: ["administrator"],

  usage: "`k!network-config [prefix|channel|invites|permissions] (value)`",

  exec: async function () {
    const rawKey = this.parsedCommand.reader.getString();
    let settings;

    if (rawKey === "permissions") {
      settings = await this.client.repo.GetGuildClientSettings(this.guild.id);

      if (!settings.channelId) {
        this.channel.createMessage({
          embed: failureEmbed({
            command: false,
            description: "No channel was found",
          }),
        });
        return;
      }

      const _channel = this.guild.channels.get(settings.channelId);

      if (!_channel) {
        this.channel.createMessage({
          embed: failureEmbed({
            command: false,
            description: "No channel was found",
          }),
        });
        return;
      }

      const permissions = [
        "addReactions",
        "embedLinks",
        "externalEmojis",
        "manageMessages",
        "mentionEveryone",
        "readMessageHistory",
        "readMessages",
        "sendMessages",
      ];

      let _permissions = _channel.permissionsOf(this.client.user.id);
      let json = new Eris.Permission(_permissions.allow).json;

      this.replyWithConfig(
        "Channel Permissions Check",
        permissions
          .map((s) => `\`${s}\`: ${json[s] ? "OK" : "No permissions"}`)
          .join("\n")
      );

      _permissions = this.guild.permissionsOf(this.client.user.id);
      json = new Eris.Permission(_permissions.allow).json;

      this.replyWithConfig(
        "Server Permissions Check",
        Object.keys(json)
          .map((s) => `\`${s}\`: ${json[s] ? "OK" : "No permissions"}`)
          .join("\n")
      );
      return;
    }

    const key = {
      channel: Constants.SETTINGS_CHANNEL_ID,
      invites: Constants.SETTINGS_ALLOW_INVITES,
      prefix: Constants.SETTINGS_PREFIX,
    }[rawKey];

    if (isEmpty(key)) {
      this.channel.createMessage({
        embed: failureEmbed({
          command: true,
          description: `**Proper usage:** \`${this.usage}\`.`,
        }),
      });
      return;
    }

    let value;

    if (key === Constants.SETTINGS_CHANNEL_ID) {
      value = this.parsedCommand.reader.getChannelID();
    } else {
      value = this.parsedCommand.reader.getString();

      if (/<#(\d+)>/.test(value))
        throw new base.CommandArgumentError(
          "Cannot use channel id for this config."
        );
    }

    settings = await this.client.repo.GetGuildClientSettings(this.guild.id);

    const channel =
      key === Constants.SETTINGS_CHANNEL_ID &&
      this.client.repo.GetGuildChannel(
        this.guild,
        isEmpty(value) ? settings.channelId : value
      );

    if (isEmpty(value)) {
      await this.replyWithConfig(
        rawKey,
        channel
          ? channel.mention
          : key === Constants.SETTINGS_ALLOW_INVITES
          ? this.inviteLabels[settings[key]]
          : settings[key]
      );
      return;
    }

    if (
      key === Constants.SETTINGS_ALLOW_INVITES &&
      !["allow", "deny"].includes(value)
    ) {
      throw new base.CommandArgumentError(
        "Can only use `allow` or `deny` for this option."
      );
    }

    const newSettings = {
      ...settings,
      [key]:
        key === Constants.SETTINGS_ALLOW_INVITES
          ? this.inviteValues[value]
          : value,
    };

    await UpdateGuildSettings(this.guild.id, JSON.stringify(newSettings));

    this.client.repo.SetGuildClientSettings(this.guild.id, newSettings);

    await this.replyWithConfig(
      rawKey,
      channel ? channel.mention : value,
      "Komvos Settings Updated"
    );
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

  replyWithConfig: async function (key, value, title = "Komvos Settings") {
    await this.channel.createMessage({
      embed: successEmbed({
        fields: [[key + ":", value]],
        title,
        titlePrefix: "",
      }),
    });
  },
});
