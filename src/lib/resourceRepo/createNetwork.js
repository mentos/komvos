const { generatePassword } = require("../../utils");

module.exports = (sql) =>
  async function (guild, author, clientSettings) {
    const passphrase = generatePassword();

    return await sql.begin(async (sql) => {
      const [{ passphrase: hashedPassphrase, uuid }] = await sql`
        SELECT
          MD5(${passphrase}) AS passphrase,
          uuid_generate_v1() AS uuid
      `;

      const now = new Date().toUTCString();
      const timestamps = {
        created_at: now,
        updated_at: now,
      };

      const [{ creator_guild_id: guild_id, id: network_id }] = await sql`
        INSERT INTO
          networks ${sql({
            creator_guild_id: guild.id,
            creator_id: author.id,
            creator_tag: `${author.tag}`,
            owning_guild_id: guild.id,
            passphrase: hashedPassphrase,
            uuid,
            ...timestamps,
          })}
        RETURNING
          creator_guild_id, id`;

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
          ${sql(settings, "guild_id", "settings")}
        ON CONFLICT (guild_id)
        DO UPDATE SET settings = ${settings.settings}`;

      return { passphrase, uuid };
    });
  };
