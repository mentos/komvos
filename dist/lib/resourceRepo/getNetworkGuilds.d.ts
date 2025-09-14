import type { Sql } from 'postgres';
import type { GetNetworkGuildsResult } from '../../types/database';
interface GetNetworkGuildsFunction {
    (networkId: number): Promise<GetNetworkGuildsResult>;
}
export default function getNetworkGuildsRepository(sql: Sql): GetNetworkGuildsFunction;
export {};
//# sourceMappingURL=getNetworkGuilds.d.ts.map