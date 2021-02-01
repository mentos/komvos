const {
  CommandArgumentError,
  CommandTargetError,
  CommandError,
} = require("../commands/base");
const { isEmpty } = require("../utils");

module.exports = (client) => (guild, channelId, fallback = false) => {
  if (isEmpty(guild)) {
    throw new CommandArgumentError("Invalid argument: `guild` is required.");
  }

  if (isEmpty(channelId) && fallback && isEmpty(guild.systemChannelID)) {
    throw new CommandError(
      `Server **${guild.name}** has not setup an announcements channels for **Komvos**. ` +
        "Please let the server administrator know and try again when everything is setup."
    );
  }

  // const shardId = client.guildShardMap[guild.id] || 0;
  // const shard = client.shards.get(shardId);

  // if (shard === undefined || shard === null) {
  //     throw new CommandError("Invalid client shard.");
  // }

  let channel;

  try {
    channel = client.getChannel(channelId || guild.systemChannelID);
  } catch (e) {}

  if (!channel) {
    throw new CommandTargetError(
      `Server **${guild.name}** announcements channel ` +
        `\`${channelId}\` does not exist. ` +
        "Please let the server administrator know and try again when everything is setup."
    );
  }

  return channel;
};
