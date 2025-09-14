"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getNetworkGuildIdForKickRepository;
const base_1 = require("../../commands/base");
const { isEmpty } = require('../../utils');
function getNetworkGuildIdForKickRepository(sql) {
    return async function getNetworkGuildIdForKick(owningGuildId, targetGuildId, passphrase) {
        if (owningGuildId === targetGuildId) {
            throw new base_1.CommandArgumentError('You cannot kick yourself from a network.');
        }
        if (isEmpty(owningGuildId)) {
            throw new base_1.CommandArgumentError('Invalid argument: `owningGuildId` is required.');
        }
        if (isEmpty(targetGuildId)) {
            throw new base_1.CommandArgumentError('Invalid argument: `targetGuildId` is required.');
        }
        if (isEmpty(passphrase)) {
            throw new base_1.CommandArgumentError('Invalid argument: `passphrase` is required.');
        }
        const [guild] = await sql `
      SELECT
        networks_guilds.guild_id
      FROM
        networks_guilds
      JOIN
        networks ON networks.id = networks_guilds.network_id
      WHERE
        networks.owning_guild_id != networks_guilds.guild_id AND
        networks.owning_guild_id = ${owningGuildId} AND
        networks.passphrase = MD5(${passphrase}) AND
        networks_guilds.deleted_at IS NULL AND
        networks_guilds.guild_id = ${targetGuildId}
        LIMIT 1
    `;
        if (isEmpty(guild) || !guild) {
            throw new base_1.CommandArgumentError(`Server ${targetGuildId} is not in your network and therefore you cannot kick them.`);
        }
        return guild.guild_id;
    };
}
//# sourceMappingURL=getNetworkGuildIdForKick.js.map