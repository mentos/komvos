import type { Sql } from 'postgres';
import type { RevokeBanBroadcastParams } from '../../types/database';

interface RevokeBanBroadcastFunction {
  (params: RevokeBanBroadcastParams): Promise<void>;
}

export default function revokeBanBroadcastRepository(sql: Sql): RevokeBanBroadcastFunction {
  return async function revokeBanBroadcast({
    banned_id,
    network_id,
    reason = '',
  }: RevokeBanBroadcastParams): Promise<void> {
    const now = new Date();

    await sql`
      UPDATE
        ban_broadcasts
      SET
        revoked_at = ${now},
        reason = ${reason},
        updated_at = ${now}
      WHERE
        banned_id = ${banned_id} AND
        network_id = ${network_id} AND
        revoked_at IS NULL`;
  };
}