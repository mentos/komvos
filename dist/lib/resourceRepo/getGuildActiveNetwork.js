"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGuildActiveNetworkRepository;
function getGuildActiveNetworkRepository(sql) {
    return async function getGuildActiveNetwork(guildId) {
        const [network] = await sql `
      SELECT
        networks.*
      FROM
        networks
      JOIN
        networks_guilds ON networks.id = networks_guilds.network_id
      WHERE
        networks_guilds.guild_id = ${guildId} AND
        networks_guilds.deleted_at IS NULL
      LIMIT 1`;
        return network;
    };
}
//# sourceMappingURL=getGuildActiveNetwork.js.map