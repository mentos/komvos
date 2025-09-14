import type { Sql } from 'postgres';
import type { AddGuildToNetworkParams } from '../../types/database';
interface AddGuildToNetworkFunction {
    (params: AddGuildToNetworkParams): Promise<void>;
}
export default function addGuildToNetworkRepository(sql: Sql): AddGuildToNetworkFunction;
export {};
//# sourceMappingURL=addGuildToNetwork.d.ts.map