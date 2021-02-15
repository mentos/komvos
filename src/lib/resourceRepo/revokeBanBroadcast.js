module.exports = (sql) => async (id, revokedAt, guild_id = null) =>
  await sql`
    UPDATE
      ban_broadcasts
    SET
      revoked_at = ${revokedAt}
    WHERE
      id = ${id} AND
      guild_id = ${guild_id}
      revoked_at IS NULL
  `;
