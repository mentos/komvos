module.exports = (sql) =>
  async function ({
    announcer_id,
    announcer_message,
    announcer_tag,
    banned_id,
    banned_tag,
    executor_id,
    executor_message,
    executor_tag,
    guild_id,
    message_url,
    network_id,
    reason,
  }) {
    const now = new Date().toUTCString();
    const banBroadcasts = {
      announcer_id,
      announcer_message,
      announcer_tag,
      banned_id,
      banned_tag,
      executor_id,
      executor_message,
      executor_tag,
      guild_id,
      message_url,
      network_id,
      reason,
      created_at: now,
      updated_at: now,
    };

    await sql`INSERT INTO ban_broadcasts ${sql(banBroadcasts)}`;
  };
