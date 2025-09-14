import type { Sql } from 'postgres';
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
export default function getNetworkBroadcastRepository(sql: Sql): GetNetworkBroadcastFunction;
export {};
//# sourceMappingURL=getNetworkBroadcast.d.ts.map