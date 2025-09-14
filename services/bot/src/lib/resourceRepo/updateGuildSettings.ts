import type { Sql } from "postgres";
import type { UpdateGuildSettingsParams } from "../../types/database";

interface UpdateGuildSettingsFunction {
  (params: UpdateGuildSettingsParams): Promise<void>;
}

export default function updateGuildSettingsRepository(
  sql: Sql,
): UpdateGuildSettingsFunction {
  return async function updateGuildSettings({
    guild_id,
    settings,
  }: UpdateGuildSettingsParams): Promise<void> {
    const settingsData = {
      guild_id,
      settings: JSON.stringify(settings),
    };

    await sql`
      INSERT INTO
        guilds_settings
        ${sql(settingsData, "guild_id", "settings")}
      ON CONFLICT (guild_id)
      DO UPDATE SET
        settings = ${settingsData.settings},
        updated_at = NOW()`;
  };
}
