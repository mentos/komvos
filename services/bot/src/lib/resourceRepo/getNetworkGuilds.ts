import type { Sql } from 'postgres';
import type { NetworkGuildQueryResult, GetNetworkGuildsResult } from '../../types/database';
import { CommandArgumentError } from '../../commands/base';

interface GetNetworkGuildsFunction {
  (networkId: number): Promise<GetNetworkGuildsResult>;
}

export default function getNetworkGuildsRepository(sql: Sql): GetNetworkGuildsFunction {
  return async function getNetworkGuilds(networkId: number): Promise<GetNetworkGuildsResult> {
    if (!networkId) {
      throw new CommandArgumentError('Invalid argument: `networkId` is required.');
    }

    const networkGuilds = await sql<NetworkGuildQueryResult[]>`
      SELECT
        networks_guilds.guild_id, networks_guilds.created_at
      FROM
        networks_guilds
      JOIN
        networks ON networks.id = networks_guilds.network_id
      WHERE
        networks_guilds.deleted_at IS NULL AND
        networks_guilds.network_id = ${networkId}
    `;

    return networkGuilds;
  };
}