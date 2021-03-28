module.exports = (sql) => async (networkId, bannedId) => {
  return await sql`
    SELECT
      banned_id,
      banned_tag,
      created_at,
      guild_name,
      report_type,
      reason,
      revoked_at
    FROM
      ban_broadcasts
    WHERE
      banned_id = ${bannedId} AND
      network_id = ${networkId}
    ORDER BY created_at ASC`;
};
