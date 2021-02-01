const { CommandError, CommandArgumentError } = require("../../commands/base");
const { isEmpty } = require("../../utils");

module.exports = (sql) =>
  async function (guildId) {
    if (isEmpty(guildId)) {
      throw new CommandArgumentError(
        "Invalid argument: `guildId` is required."
      );
    }

    const [network] = await sql`
      SELECT
        networks.id,
        networks.owning_guild_id,
        networks.created_at AS established_at,
        networks.uuid,
        networks_guilds.guild_id,
        networks_guilds.created_at AS joined_at
      FROM
        networks_guilds
      JOIN
        networks ON networks.id = networks_guilds.network_id
      WHERE
        networks_guilds.deleted_at IS NULL AND
        networks_guilds.guild_id = ${guildId}
      LIMIT 1
    `;

    if (!network) {
      throw new CommandError("You are not part of a network");
    }

    return network;
  };
