import type { Sql } from 'postgres';
import type { AddBanBroadcastParams, BanBroadcast } from '../../types/database';

interface AddBanBroadcastFunction {
  (params: AddBanBroadcastParams): Promise<BanBroadcast>;
}

export default function addBanBroadcastRepository(sql: Sql): AddBanBroadcastFunction {
  return async function addBanBroadcast({
    banned_id,
    banned_tag,
    guild_id,
    network_id,
    reason,
  }: AddBanBroadcastParams): Promise<BanBroadcast> {
    const now = new Date().toUTCString();
    const timestamps = {
      created_at: now,
      updated_at: now,
    };

    const [broadcast] = await sql<BanBroadcast[]>`
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