import type { Sql } from "postgres";
import type { AddGuildToNetworkParams } from "../../types/database";

interface AddGuildToNetworkFunction {
  (params: AddGuildToNetworkParams): Promise<void>;
}

export default function addGuildToNetworkRepository(
  sql: Sql,
): AddGuildToNetworkFunction {
  return async function addGuildToNetwork({
    guild_id,
    network_id,
  }: AddGuildToNetworkParams): Promise<void> {
    const now = new Date().toUTCString();
    const timestamps = {
      created_at: now,
      updated_at: now,
    };

    await sql`
      INSERT INTO
        networks_guilds ${sql({
          guild_id,
          network_id,
          ...timestamps,
        })}
      ON CONFLICT (guild_id, network_id)
      DO UPDATE SET
        deleted_at = NULL,
        updated_at = ${now}`;
  };
}
