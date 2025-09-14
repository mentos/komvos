import { Message } from "discord.js";
import { ExtendedClient } from "../client";

// Simple command parser to replace discord-command-parser
interface ParsedCommand {
  success: boolean;
  command?: string;
  arguments?: string[];
  body?: string;
  prefix?: string;
}

function parseCommand(message: Message, prefix: string): ParsedCommand {
  if (!message.content.startsWith(prefix)) return { success: false };

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (!command) return { success: false };

  return {
    success: true,
    command,
    arguments: args,
    body: args.join(" "),
    prefix,
  };
}

export default (client: ExtendedClient) => async (message: Message) => {
  // Ignore bots
  if (message.author.bot) return;

  // Only process guild messages
  if (!message.guild) return;

  const settings = await client.repo.GetGuildClientSettings(message.guild.id);

  const parsed = parseCommand(message, settings.prefix);

  if (!parsed.success) return;

  const command = client.commands.get(parsed.command!);

  if (command === undefined) {
    return;
  }

  try {
    await command.run(parsed, message, client, settings);
  } catch (e) {
    console.trace(e);
  }
};
