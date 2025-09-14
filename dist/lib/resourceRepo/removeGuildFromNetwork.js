"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeGuildFromNetworkRepository;
function removeGuildFromNetworkRepository(sql) {
    return async function removeGuildFromNetwork(guildId, networkId) {
        const now = new Date();
        await sql `
      UPDATE
        networks_guilds
      SET
        deleted_at = ${now},
        updated_at = ${now}
      WHERE
        guild_id = ${guildId} AND
        network_id = ${networkId} AND
        deleted_at IS NULL`;
    };
}
//# sourceMappingURL=removeGuildFromNetwork.js.map