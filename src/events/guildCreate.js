const config = require("../config");
const { UpdateGuildSettings } = require("../lib/resourceRepo/index");

module.exports = () => async (guild) => {
  await UpdateGuildSettings(
    guild.id,
    JSON.stringify(config.defaultClientSettings)
  );
};
