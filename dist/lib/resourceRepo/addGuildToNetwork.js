"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addGuildToNetworkRepository;
function addGuildToNetworkRepository(sql) {
    return async function addGuildToNetwork({ guild_id, network_id, }) {
        const now = new Date().toUTCString();
        const timestamps = {
            created_at: now,
            updated_at: now,
        };
        await sql `
      INSERT INTO
        networks_guilds ${sql({
            guild_id,
            network_id,
            ...timestamps,
        })}
      ON CONFLICT (guild_id, network_id)
      DO UPDATE SET
        deleted_at = NULL,
        updated_at = ${now}`;
    };
}
//# sourceMappingURL=addGuildToNetwork.js.map