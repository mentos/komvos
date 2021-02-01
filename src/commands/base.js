const { failureEmbed } = require("../lib/EmbedBuilder");
const { isEmpty } = require("../utils");

class CommandError extends Error {}
class CommandArgumentError extends CommandError {}
class CommandChannelArgumentError extends CommandError {}
class CommandChannelNotFoundError extends CommandError {}
class CommandChannelPermissionsError extends CommandError {}
class CommandMemberPermissionsError extends CommandError {}
class CommandTargetError extends CommandError {}

module.exports = function (command) {
  return {
    memberPermissions: ["sendMessages"],

    run: async function (parsedCommand, message, client, settings) {
      try {
        this.client = client;
        this.message = message;
        this.parsedCommand = parsedCommand;
        this.settings = settings;

        await this.preExec();
        await this.exec();
      } catch (e) {
        await this.channel.createMessage({
          embed: failureEmbed({
            description:
              e instanceof CommandError
                ? e.message
                : `Unknown error. See \`help\` for more information.`,
            fields: [["Command usage", `\`${settings.prefix}help\``]],
          }),
        });

        console.trace(e);
      }
    },

    guildCooldown: 1,

    ...command,

    preExec: async function () {
      this.validateGuildCooldowns();
      await this.validateChannelPermissions();
      await this.validateMemberPermissions();
    },

    validateGuildCooldowns: function () {
      if (!this.guildCooldown) return true;

      const commandCooldowns = this.client.guildsCooldowns.get(this.name);
      const cooldownAmount = this.guildCooldown * 1000;
      const now = Date.now();

      if (commandCooldowns.has(this.guild.id)) {
        const expiration = commandCooldowns.get(this.guild.id) + cooldownAmount;

        if (now < expiration) {
          const timeLeft = (expiration - now) / 1000;
          const remaining = timeLeft.toFixed(1);

          throw new CommandMemberPermissionsError(
            `**Command on server cooldown.** Please wait ${remaining} ` +
              `more second(s) before reusing \`${this.name}\`.`
          );
        }
      }

      commandCooldowns.set(this.guild.id, now);

      setTimeout(() => {
        commandCooldowns.delete(this.guild.id);
      }, cooldownAmount);
    },

    validateMemberPermissions: async function () {
      if (isEmpty(this.memberPermissions)) return true;
      if (!this.memberPermissions.some((p) => this.member.hasPermission(p))) {
        throw new CommandMemberPermissionsError(
          "**Insufficient permissions.** " +
            "Only users with one of the following permissions can use this command: " +
            this.memberPermissions.map((p) => `\`${p}\``).join(", ") +
            "."
        );
      }
    },

    validateChannelPermissions: function () {
      if (this.guildOnly && !this.channel.isGuildTextChannel) {
        throw new CommandChannelPermissionsError(
          "This command is only allowed in server text channels."
        );
      }
    },

    get author() {
      return this.message.author;
    },

    get member() {
      return this.message.member;
    },

    get channel() {
      return this.message.channel;
    },

    get guild() {
      return this.message.guild;
    },
  };
};

module.exports.CommandArgumentError = CommandArgumentError;
module.exports.CommandChannelArgumentError = CommandChannelArgumentError;
module.exports.CommandChannelNotFoundError = CommandChannelNotFoundError;
module.exports.CommandError = CommandError;
module.exports.CommandTargetError = CommandTargetError;
