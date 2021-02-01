module.exports = (sql) =>
  async function (guildId, networkId) {
    const now = new Date().toUTCString();
    const timestamps = {
      created_at: now,
      updated_at: now,
    };

    await sql`
      INSERT INTO
        networks_guilds ${sql({
          guild_id: guildId,
          network_id: networkId,
          ...timestamps,
        })}`;
  };
