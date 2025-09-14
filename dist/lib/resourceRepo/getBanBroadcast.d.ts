import type { Sql } from 'postgres';
import type { GetBanBroadcastResult } from '../../types/database';
interface GetBanBroadcastFunction {
    (networkId: number, bannedId: string, guildId?: string | null): Promise<GetBanBroadcastResult>;
}
export default function getBanBroadcastRepository(sql: Sql): GetBanBroadcastFunction;
export {};
//# sourceMappingURL=getBanBroadcast.d.ts.map