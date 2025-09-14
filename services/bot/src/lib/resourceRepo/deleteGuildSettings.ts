import type { Sql } from "postgres";

interface DeleteGuildSettingsFunction {
  (guildId: string): Promise<void>;
}

export default function deleteGuildSettingsRepository(
  sql: Sql,
): DeleteGuildSettingsFunction {
  return async function deleteGuildSettings(guildId: string): Promise<void> {
    await sql`
      DELETE FROM
        guilds_settings
      WHERE
        guild_id = ${guildId}`;
  };
}
