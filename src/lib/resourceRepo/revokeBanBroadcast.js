module.exports = (sql) => async (id, revokedAt) =>
  await sql`
    UPDATE
      ban_broadcasts
    SET
      revoked_at = ${revokedAt}
    WHERE
      id = ${id} AND
      revoked_at IS NULL
  `;
