import type { Sql } from 'postgres';
import type { Network, GetGuildOwnedNetworkResult } from '../../types/database';

interface GetGuildOwnedNetworkFunction {
  (guildId: string): Promise<GetGuildOwnedNetworkResult>;
}

export default function getGuildOwnedNetworkRepository(sql: Sql): GetGuildOwnedNetworkFunction {
  return async function getGuildOwnedNetwork(guildId: string): Promise<GetGuildOwnedNetworkResult> {
    const [network] = await sql<Network[]>`
      SELECT
        *
      FROM
        networks
      WHERE
        owning_guild_id = ${guildId}
      LIMIT 1`;

    return network;
  };
}