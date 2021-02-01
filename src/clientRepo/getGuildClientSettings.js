const config = require("../config");
const { sql } = require("../db");

module.exports = (client) =>
  async function (guildId) {
    let guildSettings = client.guildsSettings.get(guildId);

    if (!guildSettings) {
      const [settings] = await sql`
        SELECT
          settings
        FROM
          guilds_settings
        WHERE
          guild_id = ${guildId}
        LIMIT 1
      `;

      try {
        guildSettings = {
          ...config.defaultClientSettings,
          ...JSON.parse(settings.settings),
        };
      } catch (e) {
        guildSettings = {
          ...config.defaultClientSettings,
        };
      }
    }

    return guildSettings;
  };
