// Simple command parser to replace discord-command-parser
function parseCommand(message, prefix) {
  if (!message.content.startsWith(prefix)) return { success: false };

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  return {
    success: true,
    command,
    arguments: args,
    body: args.join(" "),
    prefix
  };
}

module.exports = (client) => async (message) => {
  // Ignore bots
  if (message.author.bot) return;

  // Only process guild messages
  if (!message.guild) return;

  const settings = await client.repo.GetGuildClientSettings(message.guild.id);

  const parsed = parseCommand(message, settings.prefix);

  if (!parsed.success) return;

  const command = client.commands.get(parsed.command);

  if (command === undefined) {
    // throw new Error(`Unknown command name: ${parsed.command}.`);
    return;
  }

  try {
    await command.run(parsed, message, client, settings);
  } catch (e) {
    console.trace(e);
  }
};
