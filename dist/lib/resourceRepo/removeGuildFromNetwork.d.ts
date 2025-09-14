import type { Sql } from 'postgres';
interface RemoveGuildFromNetworkFunction {
    (guildId: string, networkId: number): Promise<void>;
}
export default function removeGuildFromNetworkRepository(sql: Sql): RemoveGuildFromNetworkFunction;
export {};
//# sourceMappingURL=removeGuildFromNetwork.d.ts.map