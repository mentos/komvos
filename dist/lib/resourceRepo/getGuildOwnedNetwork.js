"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGuildOwnedNetworkRepository;
function getGuildOwnedNetworkRepository(sql) {
    return async function getGuildOwnedNetwork(guildId) {
        const [network] = await sql `
      SELECT
        *
      FROM
        networks
      WHERE
        owning_guild_id = ${guildId}
      LIMIT 1`;
        return network;
    };
}
//# sourceMappingURL=getGuildOwnedNetwork.js.map