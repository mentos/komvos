import type { Sql } from 'postgres';
import type { AddBanBroadcastParams, BanBroadcast } from '../../types/database';
interface AddBanBroadcastFunction {
    (params: AddBanBroadcastParams): Promise<BanBroadcast>;
}
export default function addBanBroadcastRepository(sql: Sql): AddBanBroadcastFunction;
export {};
//# sourceMappingURL=addBanBroadcast.d.ts.map