import type { Sql } from 'postgres';
interface GetNetworkGuildIdForKickFunction {
    (owningGuildId: string, targetGuildId: string, passphrase: string): Promise<string>;
}
export default function getNetworkGuildIdForKickRepository(sql: Sql): GetNetworkGuildIdForKickFunction;
export {};
//# sourceMappingURL=getNetworkGuildIdForKick.d.ts.map