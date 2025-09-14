import type { Sql } from 'postgres';
import type { Network, GetGuildActiveNetworkResult } from '../../types/database';

interface GetGuildActiveNetworkFunction {
  (guildId: string): Promise<GetGuildActiveNetworkResult>;
}

export default function getGuildActiveNetworkRepository(sql: Sql): GetGuildActiveNetworkFunction {
  return async function getGuildActiveNetwork(guildId: string): Promise<GetGuildActiveNetworkResult> {
    const [network] = await sql<Network[]>`
      SELECT
        networks.*
      FROM
        networks
      JOIN
        networks_guilds ON networks.id = networks_guilds.network_id
      WHERE
        networks_guilds.guild_id = ${guildId} AND
        networks_guilds.deleted_at IS NULL
      LIMIT 1`;

    return network;
  };
}