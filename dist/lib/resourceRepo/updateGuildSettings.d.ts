import type { Sql } from 'postgres';
import type { UpdateGuildSettingsParams } from '../../types/database';
interface UpdateGuildSettingsFunction {
    (params: UpdateGuildSettingsParams): Promise<void>;
}
export default function updateGuildSettingsRepository(sql: Sql): UpdateGuildSettingsFunction;
export {};
//# sourceMappingURL=updateGuildSettings.d.ts.map