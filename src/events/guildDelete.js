const { DeleteGuildSettings } = require("../lib/resourceRepo");

module.exports = () => async (guild) => {
  await DeleteGuildSettings(guild.id);
};
