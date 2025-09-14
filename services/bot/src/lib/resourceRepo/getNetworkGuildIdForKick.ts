import type { Sql } from "postgres";
import { CommandArgumentError } from "../../commands/base";
const { isEmpty } = require("../../utils");

interface NetworkGuildKickResult {
  guild_id: string;
}

interface GetNetworkGuildIdForKickFunction {
  (
    owningGuildId: string,
    targetGuildId: string,
    passphrase: string,
  ): Promise<string>;
}

export default function getNetworkGuildIdForKickRepository(
  sql: Sql,
): GetNetworkGuildIdForKickFunction {
  return async function getNetworkGuildIdForKick(
    owningGuildId: string,
    targetGuildId: string,
    passphrase: string,
  ): Promise<string> {
    if (owningGuildId === targetGuildId) {
      throw new CommandArgumentError(
        "You cannot kick yourself from a network.",
      );
    }

    if (isEmpty(owningGuildId)) {
      throw new CommandArgumentError(
        "Invalid argument: `owningGuildId` is required.",
      );
    }

    if (isEmpty(targetGuildId)) {
      throw new CommandArgumentError(
        "Invalid argument: `targetGuildId` is required.",
      );
    }

    if (isEmpty(passphrase)) {
      throw new CommandArgumentError(
        "Invalid argument: `passphrase` is required.",
      );
    }

    const [guild] = await sql<NetworkGuildKickResult[]>`
      SELECT
        networks_guilds.guild_id
      FROM
        networks_guilds
      JOIN
        networks ON networks.id = networks_guilds.network_id
      WHERE
        networks.owning_guild_id != networks_guilds.guild_id AND
        networks.owning_guild_id = ${owningGuildId} AND
        networks.passphrase = MD5(${passphrase}) AND
        networks_guilds.deleted_at IS NULL AND
        networks_guilds.guild_id = ${targetGuildId}
        LIMIT 1
    `;

    if (isEmpty(guild) || !guild) {
      throw new CommandArgumentError(
        `Server ${targetGuildId} is not in your network and therefore you cannot kick them.`,
      );
    }

    return guild.guild_id;
  };
}
