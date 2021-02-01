const BroadcastReport = require("../lib/BroadcastBanReport");

module.exports = (client) => async (guild, user) => {
  await BroadcastReport({
    bannedUser: user,
    client,
    guild,
  });
};
