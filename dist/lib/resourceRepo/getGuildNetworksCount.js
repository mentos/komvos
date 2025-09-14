"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getGuildNetworksCountRepository;
const base_1 = require("../../commands/base");
const { isEmpty } = require('../../utils');
function getGuildNetworksCountRepository(sql) {
    return async function getGuildNetworksCount(guildId) {
        if (isEmpty(guildId)) {
            throw new base_1.CommandArgumentError('Invalid argument: `guildId` is required.');
        }
        const [network] = await sql `
      SELECT
        COUNT(*)
      FROM
        networks_guilds
      WHERE
        guild_id = ${guildId}
        AND deleted_at IS NULL
    `;
        if (!network) {
            throw new Error('Failed to count guild networks');
        }
        return network;
    };
}
//# sourceMappingURL=getGuildNetworksCount.js.map