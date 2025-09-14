import type { Sql } from 'postgres';

interface RemoveGuildFromNetworkFunction {
  (guildId: string, networkId: number): Promise<void>;
}

export default function removeGuildFromNetworkRepository(sql: Sql): RemoveGuildFromNetworkFunction {
  return async function removeGuildFromNetwork(guildId: string, networkId: number): Promise<void> {
    const now = new Date();

    await sql`
      UPDATE
        networks_guilds
      SET
        deleted_at = ${now},
        updated_at = ${now}
      WHERE
        guild_id = ${guildId} AND
        network_id = ${networkId} AND
        deleted_at IS NULL`;
  };
}