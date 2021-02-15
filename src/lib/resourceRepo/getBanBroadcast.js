module.exports = (sql) => async (networkId, bannedId, guild_id = null) => {
  if (guild_id) {
    const [broadcast] = await sql`
      SELECT
        *
      FROM
        ban_broadcasts
      WHERE
        banned_id = ${bannedId} AND
        network_id = ${networkId} AND
        guild_id = ${guild_id} AND
        revoked_at IS NULL
      LIMIT 1`;

    return broadcast;
  }

  const [broadcast] = await sql`
      SELECT
        *
      FROM
        ban_broadcasts
      WHERE
        banned_id = ${bannedId} AND
        network_id = ${networkId} AND
        revoked_at IS NULL
      LIMIT 1`;

  return broadcast;
};
