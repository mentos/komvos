import { sql } from './sql';
import pgErrorCodes, * as errorUtils from './pgErrorCodes';
export { sql, pgErrorCodes, errorUtils };
declare const _default: {
    errorCodes: {
        readonly UNIQUE_VIOLATION: "23505";
        readonly NOT_NULL_VIOLATION: "23502";
        readonly FOREIGN_KEY_VIOLATION: "23503";
        readonly CHECK_VIOLATION: "23514";
        readonly CONNECTION_EXCEPTION: "08000";
        readonly CONNECTION_DOES_NOT_EXIST: "08003";
        readonly CONNECTION_FAILURE: "08006";
        readonly INVALID_TRANSACTION_STATE: "25000";
        readonly ACTIVE_SQL_TRANSACTION: "25001";
        readonly SYNTAX_ERROR: "42601";
        readonly UNDEFINED_TABLE: "42P01";
        readonly UNDEFINED_COLUMN: "42703";
        readonly UNDEFINED_FUNCTION: "42883";
        readonly DUPLICATE_TABLE: "42P07";
        readonly DUPLICATE_COLUMN: "42701";
        readonly INSUFFICIENT_RESOURCES: "53000";
        readonly DISK_FULL: "53100";
        readonly OUT_OF_MEMORY: "53200";
        readonly TOO_MANY_CONNECTIONS: "53300";
    };
    sql: import("postgres").Sql<{}>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map