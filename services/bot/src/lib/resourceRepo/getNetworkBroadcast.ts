import type { Sql } from "postgres";

interface NetworkBroadcastResult {
  banned_id: string;
  banned_tag: string;
  created_at: Date | string;
  guild_name: string;
  report_type: string;
  reason: string;
  revoked_at: Date | string | null;
}

interface GetNetworkBroadcastFunction {
  (networkId: number, bannedId: string): Promise<NetworkBroadcastResult[]>;
}

export default function getNetworkBroadcastRepository(
  sql: Sql,
): GetNetworkBroadcastFunction {
  return async function getNetworkBroadcast(
    networkId: number,
    bannedId: string,
  ): Promise<NetworkBroadcastResult[]> {
    return await sql<NetworkBroadcastResult[]>`
      SELECT
        banned_id,
        banned_tag,
        created_at,
        guild_name,
        report_type,
        reason,
        revoked_at
      FROM
        ban_broadcasts
      WHERE
        banned_id = ${bannedId} AND
        network_id = ${networkId}
      ORDER BY created_at ASC`;
  };
}
