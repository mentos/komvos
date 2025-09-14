"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTGRES_ERROR_CODES = void 0;
exports.isPostgresError = isPostgresError;
exports.isUniqueViolationError = isUniqueViolationError;
exports.isForeignKeyViolationError = isForeignKeyViolationError;
exports.isConnectionError = isConnectionError;
exports.getErrorMessage = getErrorMessage;
exports.POSTGRES_ERROR_CODES = {
    UNIQUE_VIOLATION: '23505',
    NOT_NULL_VIOLATION: '23502',
    FOREIGN_KEY_VIOLATION: '23503',
    CHECK_VIOLATION: '23514',
    CONNECTION_EXCEPTION: '08000',
    CONNECTION_DOES_NOT_EXIST: '08003',
    CONNECTION_FAILURE: '08006',
    INVALID_TRANSACTION_STATE: '25000',
    ACTIVE_SQL_TRANSACTION: '25001',
    SYNTAX_ERROR: '42601',
    UNDEFINED_TABLE: '42P01',
    UNDEFINED_COLUMN: '42703',
    UNDEFINED_FUNCTION: '42883',
    DUPLICATE_TABLE: '42P07',
    DUPLICATE_COLUMN: '42701',
    INSUFFICIENT_RESOURCES: '53000',
    DISK_FULL: '53100',
    OUT_OF_MEMORY: '53200',
    TOO_MANY_CONNECTIONS: '53300',
};
function isPostgresError(error, code) {
    return error?.code === code;
}
function isUniqueViolationError(error) {
    return isPostgresError(error, exports.POSTGRES_ERROR_CODES.UNIQUE_VIOLATION);
}
function isForeignKeyViolationError(error) {
    return isPostgresError(error, exports.POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION);
}
function isConnectionError(error) {
    return error?.code?.startsWith('08');
}
function getErrorMessage(code) {
    switch (code) {
        case exports.POSTGRES_ERROR_CODES.UNIQUE_VIOLATION:
            return 'A record with this value already exists';
        case exports.POSTGRES_ERROR_CODES.NOT_NULL_VIOLATION:
            return 'Required field cannot be empty';
        case exports.POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION:
            return 'Referenced record does not exist';
        case exports.POSTGRES_ERROR_CODES.CONNECTION_EXCEPTION:
        case exports.POSTGRES_ERROR_CODES.CONNECTION_FAILURE:
            return 'Database connection failed';
        case exports.POSTGRES_ERROR_CODES.SYNTAX_ERROR:
            return 'Invalid SQL syntax';
        case exports.POSTGRES_ERROR_CODES.UNDEFINED_TABLE:
            return 'Table does not exist';
        case exports.POSTGRES_ERROR_CODES.UNDEFINED_COLUMN:
            return 'Column does not exist';
        case exports.POSTGRES_ERROR_CODES.TOO_MANY_CONNECTIONS:
            return 'Too many database connections';
        case exports.POSTGRES_ERROR_CODES.OUT_OF_MEMORY:
            return 'Database server out of memory';
        default:
            return 'Database error occurred';
    }
}
exports.default = exports.POSTGRES_ERROR_CODES;
//# sourceMappingURL=pgErrorCodes.js.map