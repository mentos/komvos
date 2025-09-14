import type { Sql } from 'postgres';
import type { BanBroadcast, GetBanBroadcastResult } from '../../types/database';

interface GetBanBroadcastFunction {
  (networkId: number, bannedId: string, guildId?: string | null): Promise<GetBanBroadcastResult>;
}

export default function getBanBroadcastRepository(sql: Sql): GetBanBroadcastFunction {
  return async function getBanBroadcast(
    networkId: number,
    bannedId: string,
    guildId: string | null = null
  ): Promise<GetBanBroadcastResult> {
    if (guildId) {
      const [broadcast] = await sql<BanBroadcast[]>`
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

    const [broadcast] = await sql<BanBroadcast[]>`
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