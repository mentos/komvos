import type { Sql } from 'postgres';
import { CommandArgumentError } from '../../commands/base';
const { isEmpty } = require('../../utils');

interface NetworkCountResult {
  count: string; // PostgreSQL COUNT returns string
}

interface GetGuildNetworksCountFunction {
  (guildId: string): Promise<NetworkCountResult>;
}

export default function getGuildNetworksCountRepository(sql: Sql): GetGuildNetworksCountFunction {
  return async function getGuildNetworksCount(guildId: string): Promise<NetworkCountResult> {
    if (isEmpty(guildId)) {
      throw new CommandArgumentError('Invalid argument: `guildId` is required.');
    }

    const [network] = await sql<NetworkCountResult[]>`
      SELECT
        COUNT(*)
      FROM
        networks_guilds
      WHERE
        guild_id = ${guildId}
        AND deleted_at IS NULL
    `;

    if (!network) {
      throw new Error('Failed to count guild networks');
    }

    return network;
  };
}