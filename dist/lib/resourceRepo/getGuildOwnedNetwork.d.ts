import type { Sql } from 'postgres';
import type { GetGuildOwnedNetworkResult } from '../../types/database';
interface GetGuildOwnedNetworkFunction {
    (guildId: string): Promise<GetGuildOwnedNetworkResult>;
}
export default function getGuildOwnedNetworkRepository(sql: Sql): GetGuildOwnedNetworkFunction;
export {};
//# sourceMappingURL=getGuildOwnedNetwork.d.ts.map