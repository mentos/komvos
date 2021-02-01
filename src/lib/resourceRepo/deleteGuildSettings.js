module.exports = (sql) =>
  async function (guildId) {
    await sql`
      DELETE FROM
        guilds_settings
      WHERE
        guild_id = ${guildId}
      `;
  };
