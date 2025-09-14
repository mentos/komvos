import type { Sql } from 'postgres';
import type { Network } from '../../types/database';
interface DisbandNetworkFunction {
    (network: Network): Promise<boolean>;
}
export default function disbandNetworkRepository(sql: Sql): DisbandNetworkFunction;
export {};
//# sourceMappingURL=disbandNetwork.d.ts.map