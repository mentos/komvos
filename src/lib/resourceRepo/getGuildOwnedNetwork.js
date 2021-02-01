const { CommandError, CommandArgumentError } = require("../../commands/base");
const { isEmpty } = require("../../utils");

module.exports = (sql) =>
  async function (guild, passphrase) {
    if (isEmpty(passphrase)) {
      throw new CommandArgumentError(
        "Invalid argument: `passphrase` is required."
      );
    }

    const [network] = await sql`
      SELECT
        id, uuid
      FROM
        networks
      WHERE
        owning_guild_id = ${guild.id}
        AND passphrase = MD5(${passphrase})
        AND deleted_at IS NULL
      LIMIT 1
    `;

    if (!network || isEmpty(network.uuid)) {
      throw new CommandError(
        "One of the following errors occured:\n\n" +
          ":arrow_right: you are not a Komvos network member \n" +
          ":arrow_right: you are not the administrator of your network \n" +
          ":arrow_right: wrong network passphrase\n"
      );
    }

    return network;
  };
