const { CommandArgumentError } = require("../commands/base");

module.exports = (client) => async (guilds = [], userId) => {
  if (!guilds.length) return [];
  if (!userId) {
    throw new CommandArgumentError("Invalid argument: `userId` is required.");
  }
  const guildsWithMutuals = [];

  for (const guild of guilds) {
    await guild
      .fetchMembers({ limit: 1, userIDs: [userId] })
      .then((members) => {
        if (members.length) guildsWithMutuals.push(guild);
      });
  }

  return guildsWithMutuals;
};
