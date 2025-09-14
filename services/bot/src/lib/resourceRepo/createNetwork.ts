import type { Sql } from 'postgres';
import type {
  CreateNetworkResult,
  NetworkQueryResult,
  PassphraseQueryResult,
  GuildSettings
} from '../../types/database';
const { generatePassword } = require('../../utils');

interface CreateNetworkFunction {
  (guild: { id: string }, author: { id: string; tag: string }, clientSettings: GuildSettings): Promise<CreateNetworkResult>;
}

export default function createNetworkRepository(sql: Sql): CreateNetworkFunction {
  return async function createNetwork(guild, author, clientSettings): Promise<CreateNetworkResult> {
    const passphrase = generatePassword();

    return await sql.begin(async (sql) => {
      const [result] = await sql<PassphraseQueryResult[]>`
        SELECT
          MD5(${passphrase}) AS passphrase,
          uuid_generate_v1() AS uuid
      `;

      if (!result) {
        throw new Error('Failed to generate network credentials');
      }

      const { passphrase: hashedPassphrase, uuid } = result;

      const now = new Date().toUTCString();
      const timestamps = {
        created_at: now,
        updated_at: now,
      };

      const [networkResult] = await sql<NetworkQueryResult[]>`
        INSERT INTO
          networks ${sql({
            creator_guild_id: guild.id,
            creator_id: author.id,
            creator_tag: author.tag,
            owning_guild_id: guild.id,
            passphrase: hashedPassphrase,
            uuid,
            ...timestamps,
          })}
        RETURNING
          creator_guild_id, id`;

      if (!networkResult) {
        throw new Error('Failed to create network');
      }

      const { creator_guild_id: guild_id, id: network_id } = networkResult;

      await sql`
        INSERT INTO
          networks_guilds ${sql({
            guild_id,
            network_id,
            ...timestamps,
          })}`;

      const settings = {
        guild_id,
        settings: JSON.stringify(clientSettings),
      };

      await sql`
        INSERT INTO
          guilds_settings
          ${sql(settings, 'guild_id', 'settings')}
        ON CONFLICT (guild_id)
        DO UPDATE SET settings = ${settings.settings}`;

      return { passphrase, uuid };
    });
  };
}