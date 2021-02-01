const { CommandArgumentError } = require("../../commands/base");

module.exports = (sql) =>
  async function (networkId) {
    if (!networkId) {
      throw new CommandArgumentError(
        "Invalid argument: `networkId` is required."
      );
    }

    const networkGuilds = await sql`
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
