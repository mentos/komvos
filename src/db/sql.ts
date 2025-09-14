import postgres from 'postgres';
// Database configuration types handled inline

interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  debug?: boolean | ((connection: number, query: string, parameters: any[], paramTypes: any[]) => void);
  connection: {
    application_name: string;
  };
}

const config: PostgresConfig = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_DATABASE!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,

  debug:
    process.env.NODE_ENV === 'dev'
      ? (_: number, q: string, _p: any[], _pt: any[]) => {
          console.log(`
      [======|: QUERY - start :|======]
      ${q}
      [======|: QUERY - end :|======]
    `);
        }
      : false,

  connection: {
    application_name: `komvos-bot.${process.env.NODE_ENV || 'production'}`,
  },
};

const sql = postgres(config);

export default sql;
export { sql };
export type { PostgresConfig };