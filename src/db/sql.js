const postgres = require("postgres");

const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,

  debug:
    process.env.NODE_ENV === "dev"
      ? (_, q, p) => {
          console.log(`
      [======|: QUERY - start :|======]
      ${q}
      [======|: QUERY - end :|======]
    `);
        }
      : null,

  connection: {
    application_name: `komvos-bot.${process.env.NODE_ENV}`,
  },
});

module.exports = sql;
