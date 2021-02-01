module.exports = (sql) => async (networkId, bannedId) => {
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
