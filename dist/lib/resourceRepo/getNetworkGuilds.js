"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getNetworkGuildsRepository;
const base_1 = require("../../commands/base");
function getNetworkGuildsRepository(sql) {
    return async function getNetworkGuilds(networkId) {
        if (!networkId) {
            throw new base_1.CommandArgumentError('Invalid argument: `networkId` is required.');
        }
        const networkGuilds = await sql `
      SELECT
        networks_guilds.guild_id, networks_guilds.created_at
      FROM
        networks_guilds
      JOIN
        networks ON networks.id = networks_guilds.network_id
      WHERE
        networks_guilds.deleted_at IS NULL AND
        networks_guilds.network_id = ${networkId}
    `;
        return networkGuilds;
    };
}
//# sourceMappingURL=getNetworkGuilds.js.map