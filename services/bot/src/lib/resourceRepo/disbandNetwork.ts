import type { Sql } from 'postgres';
import type { Network } from '../../types/database';

interface DisbandNetworkFunction {
  (network: Network): Promise<boolean>;
}

export default function disbandNetworkRepository(sql: Sql): DisbandNetworkFunction {
  return async function disbandNetwork(network: Network): Promise<boolean> {
    return await sql.begin(async (sql) => {
      await sql`DELETE FROM networks WHERE id = ${network.id}`;
      await sql`DELETE FROM networks_guilds WHERE network_id = ${network.id}`;
      await sql`DELETE FROM ban_broadcasts WHERE network_id = ${network.id}`;
      return true;
    });
  };
}