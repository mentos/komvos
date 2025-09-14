import type { Sql } from 'postgres';
interface DeleteGuildSettingsFunction {
    (guildId: string): Promise<void>;
}
export default function deleteGuildSettingsRepository(sql: Sql): DeleteGuildSettingsFunction;
export {};
//# sourceMappingURL=deleteGuildSettings.d.ts.map