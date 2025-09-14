import type { Sql } from 'postgres';
import type { GetGuildActiveNetworkResult } from '../../types/database';
interface GetGuildActiveNetworkFunction {
    (guildId: string): Promise<GetGuildActiveNetworkResult>;
}
export default function getGuildActiveNetworkRepository(sql: Sql): GetGuildActiveNetworkFunction;
export {};
//# sourceMappingURL=getGuildActiveNetwork.d.ts.map