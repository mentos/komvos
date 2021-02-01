const { CommandArgumentError } = require("../../commands/base");
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
        COUNT(*)
      FROM
        networks_guilds
      WHERE
        guild_id = ${guildId}
        AND deleted_at IS NULL
    `;

    return network;
  };
