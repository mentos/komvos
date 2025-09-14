"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const postgres_1 = __importDefault(require("postgres"));
const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    debug: process.env.NODE_ENV === 'dev'
        ? (_, q, _p, _pt) => {
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
const sql = (0, postgres_1.default)(config);
exports.sql = sql;
exports.default = sql;
//# sourceMappingURL=sql.js.map