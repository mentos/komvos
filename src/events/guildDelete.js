const { DeleteGuildSettings } = require("../lib/resourceRepo");

module.exports = () => async (guild) => {
  // @TODO: do nothing for now; revert it in the future
  return;

  await DeleteGuildSettings(guild.id);
};
