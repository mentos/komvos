import type { Sql } from 'postgres';
import type { RevokeBanBroadcastParams } from '../../types/database';
interface RevokeBanBroadcastFunction {
    (params: RevokeBanBroadcastParams): Promise<void>;
}
export default function revokeBanBroadcastRepository(sql: Sql): RevokeBanBroadcastFunction;
export {};
//# sourceMappingURL=revokeBanBroadcast.d.ts.map