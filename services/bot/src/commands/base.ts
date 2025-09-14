import {
  Message,
  Guild,
  TextChannel,
  GuildMember,
  User,
  Collection,
  PermissionsBitField,
} from "discord.js";
import { failureEmbed } from "../lib/EmbedBuilder";
import { isEmpty } from "../utils";
import { ExtendedClient, ClientSettings } from "../client";

// Command error classes
export class CommandError extends Error {}
export class CommandArgumentError extends CommandError {}
export class CommandChannelArgumentError extends CommandError {}
export class CommandChannelNotFoundError extends CommandError {}
export class CommandChannelPermissionsError extends CommandError {}
export class CommandMemberPermissionsError extends CommandError {}
export class CommandTargetError extends CommandError {}

// Base command interface
export interface BaseCommand {
  name: string;
  description?: string;
  usage?: string;
  memberPermissions?: (keyof typeof PermissionsBitField.Flags)[];
  guildOnly?: boolean;
  guildCooldown?: number;
  exec(this: ExtendedCommand): Promise<void> | void;
}

// Extended command interface with runtime properties
export interface ExtendedCommand extends BaseCommand {
  client: ExtendedClient;
  message: Message;
  parsedCommand: any;
  settings: ClientSettings;

  // Methods
  run(
    parsedCommand: any,
    message: Message,
    client: ExtendedClient,
    settings: ClientSettings,
  ): Promise<void>;
  preExec(): Promise<void>;
  validateGuildCooldowns(): void;
  validateMemberPermissions(): Promise<void>;
  validateChannelPermissions(): void;
  handleAcceptance?: (...args: any[]) => (...args: any[]) => Promise<void>;
  handleRejection?: (...args: any[]) => (...args: any[]) => Promise<void>;
  replyWithConfig?: (
    key: string,
    value: string,
    title?: string,
  ) => Promise<void>;

  // Helper getters
  readonly inviteValues?: { [key: string]: boolean };
  readonly inviteLabels?: { [key: string]: string };

  // Getters
  readonly author: User;
  readonly member: GuildMember | null;
  readonly channel: TextChannel;
  readonly guild: Guild | null;
}

export default function createBaseCommand(
  command: BaseCommand,
): ExtendedCommand {
  const extendedCommand: any = {
    memberPermissions: ["SendMessages"],

    run: async function (
      parsedCommand: any,
      message: Message,
      client: ExtendedClient,
      settings: ClientSettings,
    ): Promise<void> {
      try {
        extendedCommand.client = client;
        extendedCommand.message = message;
        extendedCommand.parsedCommand = parsedCommand;
        extendedCommand.settings = settings;

        await extendedCommand.preExec();
        await extendedCommand.exec.call(extendedCommand);
      } catch (e: any) {
        await extendedCommand.channel.send({
          embeds: [
            failureEmbed({
              description:
                e instanceof CommandError
                  ? e.message
                  : `Unknown error. See \`help\` for more information.`,
              fields: [["Command usage", `\`${settings.prefix}help\``] as any],
              imageURL: null,
            }),
          ],
        });

        console.trace(e);

        // @TODO - Start: Move this to a utility
        console.info("🟡 DEBUG INFO:");

        let author =
          extendedCommand.client.utils.getUserTag(
            extendedCommand.message?.author,
          ) || "N/A";
        let channel = extendedCommand.message?.channel?.id || "N/A";
        let guild = extendedCommand.message?.guild?.name || "N/A";

        console.info({ author, channel, guild });
        // @TODO - End
      }
    },

    guildCooldown: 1,

    ...command,

    preExec: async function (): Promise<void> {
      extendedCommand.validateGuildCooldowns();
      await extendedCommand.validateChannelPermissions();
      await extendedCommand.validateMemberPermissions();
    },

    validateGuildCooldowns: function (): void {
      if (!extendedCommand.guildCooldown) return;

      const commandCooldowns: Collection<string, number> | undefined =
        extendedCommand.client.guildsCooldowns.get(extendedCommand.name);
      if (!commandCooldowns) return;

      const cooldownAmount = extendedCommand.guildCooldown * 1000;
      const now = Date.now();
      const guildId = extendedCommand.guild?.id;

      if (!guildId) return;

      if (commandCooldowns.has(guildId)) {
        const expiration =
          (commandCooldowns.get(guildId) || 0) + cooldownAmount;

        if (now < expiration) {
          const timeLeft = (expiration - now) / 1000;
          const remaining = timeLeft.toFixed(1);

          throw new CommandMemberPermissionsError(
            `**Command on server cooldown.** Please wait ${remaining} ` +
              `more second(s) before reusing \`${extendedCommand.name}\`.`,
          );
        }
      }

      commandCooldowns.set(guildId, now);

      setTimeout(() => {
        commandCooldowns.delete(guildId);
      }, cooldownAmount);
    },

    validateMemberPermissions: async function (): Promise<void> {
      if (isEmpty(extendedCommand.memberPermissions)) return;

      const member = extendedCommand.member;
      if (!member) return;

      const hasPermission = extendedCommand.memberPermissions?.some(
        (permission: any) =>
          extendedCommand.client.utils.memberHasPermission(member, permission),
      );

      if (!hasPermission) {
        throw new CommandMemberPermissionsError(
          "**Insufficient permissions.** " +
            "Only users with one of the following permissions can use this command: " +
            (extendedCommand.memberPermissions
              ?.map((p: any) => `\`${p}\``)
              .join(", ") || "") +
            ".",
        );
      }
    },

    validateChannelPermissions: function (): void {
      if (
        extendedCommand.guildOnly &&
        !extendedCommand.client.utils.isGuildTextChannel(
          extendedCommand.channel,
        )
      ) {
        throw new CommandChannelPermissionsError(
          "This command is only allowed in server text channels.",
        );
      }
    },

    get author(): User {
      return extendedCommand.message.author;
    },

    get member(): GuildMember | null {
      return extendedCommand.message.member;
    },

    get channel(): TextChannel {
      return extendedCommand.message.channel as TextChannel;
    },

    get guild(): Guild | null {
      return extendedCommand.message.guild;
    },
  };

  return extendedCommand as ExtendedCommand;
}
