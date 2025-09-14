import type { Sql } from 'postgres';
import type { CreateBanBroadcastInput, BanBroadcast } from '../../types/database';
interface CreateBanBroadcastFunction {
    (params: CreateBanBroadcastInput): Promise<BanBroadcast>;
}
export default function createBanBroadcastRepository(sql: Sql): CreateBanBroadcastFunction;
export {};
//# sourceMappingURL=createBanBroadcast.d.ts.map