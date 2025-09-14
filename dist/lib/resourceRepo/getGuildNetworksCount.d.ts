import type { Sql } from 'postgres';
interface NetworkCountResult {
    count: string;
}
interface GetGuildNetworksCountFunction {
    (guildId: string): Promise<NetworkCountResult>;
}
export default function getGuildNetworksCountRepository(sql: Sql): GetGuildNetworksCountFunction;
export {};
//# sourceMappingURL=getGuildNetworksCount.d.ts.map