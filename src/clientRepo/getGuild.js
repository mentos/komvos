const {
  CommandArgumentError,
  CommandTargetError,
} = require("../commands/base");
const { isEmpty } = require("../utils");

module.exports = (client) => (guildId) => {
  if (isEmpty(guildId)) {
    throw new CommandArgumentError("Invalid argument: `guildId` is required.");
  }

  /* const shard = client.shards.get(client.guildShardMap[guildId]);

  if (isEmpty(shard)) {
    throw new CommandTargetError(
      "**Invalid server.** Ensure server ID is correct " +
        "and that `Komvos` has been invited to that server."
    );
  }*/

  // const guild = shard.client.guilds.get(guildId);
  const guild = client.guilds.get(guildId);

  if (isEmpty(guild)) {
    throw new CommandTargetError(
      "**Invalid server.** Ensure server ID is correct " +
        "and that `Komvos` has been invited to that server."
    );
  }

  return guild;
};
