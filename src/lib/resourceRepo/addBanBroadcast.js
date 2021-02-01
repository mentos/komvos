module.exports = (sql) => async (values) =>
  await sql`INSERT INTO ban_broadcasts ${sql(values)}`;
