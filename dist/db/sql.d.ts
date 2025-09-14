import postgres from 'postgres';
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
declare const sql: postgres.Sql<{}>;
export default sql;
export { sql };
export type { PostgresConfig };
//# sourceMappingURL=sql.d.ts.map