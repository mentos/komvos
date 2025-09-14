// const { DeleteGuildSettings } = require("../lib/resourceRepo");

module.exports = () => async (guild) => {
  // @TODO: do nothing for now; revert it in the future
  // await DeleteGuildSettings(guild.id);
  console.log(`Left guild: ${guild.name}`);
};
