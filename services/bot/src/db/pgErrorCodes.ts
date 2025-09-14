/**
 * PostgreSQL error codes mapping
 * Based on official PostgreSQL documentation
 */

export const POSTGRES_ERROR_CODES = {
  // Class 23 — Integrity Constraint Violation
  UNIQUE_VIOLATION: "23505",
  NOT_NULL_VIOLATION: "23502",
  FOREIGN_KEY_VIOLATION: "23503",
  CHECK_VIOLATION: "23514",

  // Class 08 — Connection Exception
  CONNECTION_EXCEPTION: "08000",
  CONNECTION_DOES_NOT_EXIST: "08003",
  CONNECTION_FAILURE: "08006",

  // Class 25 — Invalid Transaction State
  INVALID_TRANSACTION_STATE: "25000",
  ACTIVE_SQL_TRANSACTION: "25001",

  // Class 42 — Syntax Error or Access Rule Violation
  SYNTAX_ERROR: "42601",
  UNDEFINED_TABLE: "42P01",
  UNDEFINED_COLUMN: "42703",
  UNDEFINED_FUNCTION: "42883",
  DUPLICATE_TABLE: "42P07",
  DUPLICATE_COLUMN: "42701",

  // Class 53 — Insufficient Resources
  INSUFFICIENT_RESOURCES: "53000",
  DISK_FULL: "53100",
  OUT_OF_MEMORY: "53200",
  TOO_MANY_CONNECTIONS: "53300",
} as const;

export type PostgresErrorCode =
  (typeof POSTGRES_ERROR_CODES)[keyof typeof POSTGRES_ERROR_CODES];

/**
 * Check if an error is a specific PostgreSQL error
 */
export function isPostgresError(error: any, code: PostgresErrorCode): boolean {
  return error?.code === code;
}

/**
 * Check if an error is a unique constraint violation
 */
export function isUniqueViolationError(error: any): boolean {
  return isPostgresError(error, POSTGRES_ERROR_CODES.UNIQUE_VIOLATION);
}

/**
 * Check if an error is a foreign key constraint violation
 */
export function isForeignKeyViolationError(error: any): boolean {
  return isPostgresError(error, POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION);
}

/**
 * Check if an error is a connection related error
 */
export function isConnectionError(error: any): boolean {
  return error?.code?.startsWith("08");
}

/**
 * Get human-readable error message for PostgreSQL error codes
 */
export function getErrorMessage(code: string): string {
  switch (code) {
    case POSTGRES_ERROR_CODES.UNIQUE_VIOLATION:
      return "A record with this value already exists";
    case POSTGRES_ERROR_CODES.NOT_NULL_VIOLATION:
      return "Required field cannot be empty";
    case POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION:
      return "Referenced record does not exist";
    case POSTGRES_ERROR_CODES.CONNECTION_EXCEPTION:
    case POSTGRES_ERROR_CODES.CONNECTION_FAILURE:
      return "Database connection failed";
    case POSTGRES_ERROR_CODES.SYNTAX_ERROR:
      return "Invalid SQL syntax";
    case POSTGRES_ERROR_CODES.UNDEFINED_TABLE:
      return "Table does not exist";
    case POSTGRES_ERROR_CODES.UNDEFINED_COLUMN:
      return "Column does not exist";
    case POSTGRES_ERROR_CODES.TOO_MANY_CONNECTIONS:
      return "Too many database connections";
    case POSTGRES_ERROR_CODES.OUT_OF_MEMORY:
      return "Database server out of memory";
    default:
      return "Database error occurred";
  }
}

export default POSTGRES_ERROR_CODES;
