"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createBanBroadcastRepository;
function createBanBroadcastRepository(sql) {
    return async function createBanBroadcast({ banned_id, banned_tag, guild_id, network_id, reason, }) {
        const now = new Date().toUTCString();
        const timestamps = {
            created_at: now,
            updated_at: now,
        };
        const [broadcast] = await sql `
      INSERT INTO
        ban_broadcasts ${sql({
            banned_id,
            banned_tag,
            guild_id,
            network_id,
            reason,
            ...timestamps,
        })}
      RETURNING *`;
        if (!broadcast) {
            throw new Error('Failed to create ban broadcast');
        }
        return broadcast;
    };
}
//# sourceMappingURL=createBanBroadcast.js.map