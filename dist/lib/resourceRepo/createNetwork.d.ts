import type { Sql } from 'postgres';
import type { CreateNetworkResult, GuildSettings } from '../../types/database';
interface CreateNetworkFunction {
    (guild: {
        id: string;
    }, author: {
        id: string;
        tag: string;
    }, clientSettings: GuildSettings): Promise<CreateNetworkResult>;
}
export default function createNetworkRepository(sql: Sql): CreateNetworkFunction;
export {};
//# sourceMappingURL=createNetwork.d.ts.map