module.exports = (sql) =>
  async function (guildId, networkId) {
    const [guildNetwork] = await sql`
      UPDATE
        networks_guilds
      SET
        deleted_at = ${new Date().toUTCString()}
      WHERE
        deleted_at IS NULL AND
        guild_id = ${guildId} AND
        network_id = ${networkId}
      RETURNING *`;

    return guildNetwork;
  };
