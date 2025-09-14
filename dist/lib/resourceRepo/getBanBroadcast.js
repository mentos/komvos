"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getBanBroadcastRepository;
function getBanBroadcastRepository(sql) {
    return async function getBanBroadcast(networkId, bannedId, guildId = null) {
        if (guildId) {
            const [broadcast] = await sql `
        SELECT
          *
        FROM
          ban_broadcasts
        WHERE
          banned_id = ${bannedId} AND
          network_id = ${networkId} AND
          guild_id = ${guildId} AND
          revoked_at IS NULL
        LIMIT 1`;
            return broadcast;
        }
        const [broadcast] = await sql `
      SELECT
        *
      FROM
        ban_broadcasts
      WHERE
        banned_id = ${bannedId} AND
        network_id = ${networkId} AND
        revoked_at IS NULL
      LIMIT 1`;
        return broadcast;
    };
}
//# sourceMappingURL=getBanBroadcast.js.map