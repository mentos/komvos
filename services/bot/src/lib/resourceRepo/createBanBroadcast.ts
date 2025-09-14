import type { Sql } from 'postgres';
import type { CreateBanBroadcastInput, BanBroadcast } from '../../types/database';

interface CreateBanBroadcastFunction {
  (params: CreateBanBroadcastInput): Promise<BanBroadcast>;
}

export default function createBanBroadcastRepository(sql: Sql): CreateBanBroadcastFunction {
  return async function createBanBroadcast({
    banned_id,
    banned_tag,
    guild_id,
    network_id,
    reason,
  }: CreateBanBroadcastInput): Promise<BanBroadcast> {
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