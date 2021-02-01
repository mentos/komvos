const parser = require("discord-command-parser");

module.exports = (client) => async (message) => {
  const settings = await client.repo.GetGuildClientSettings(message.guildID);

  const parsed = parser.parse(message, settings.prefix, {
    allowBots: false,
    allowSpaceBeforeCommand: false,
    ignorePrefixCase: false,
  });

  if (!parsed.success) return;

  const command = client.commands.get(parsed.command);

  if (command === undefined) {
    // throw new Error(`Unknown command name: ${parsed.command}.`);
  }

  try {
    await command.run(parsed, message, client, settings);
  } catch (e) {
    console.trace(e);
  }
};
