module.exports = (sql) =>
  async function (guildId, settings) {
    await sql`
      INSERT INTO
        guilds_settings (guild_id, settings)
      VALUES
        (${guildId}, ${settings})
      ON CONFLICT (guild_id) DO UPDATE SET settings = ${settings}`;
  };
