import { ExtendedClient, ClientSettings } from "../client";
import config from "../config";
import { sql } from "../db/index";

export default (client: ExtendedClient) =>
  async function (guildId: string): Promise<ClientSettings> {
    let guildSettings = client.guildsSettings.get(guildId);

    if (!guildSettings) {
      const result = await sql`
        SELECT
          settings
        FROM
          guilds_settings
        WHERE
          guild_id = ${guildId}
        LIMIT 1
      `;

      const settings = result[0];

      try {
        guildSettings = {
          ...config.defaultClientSettings,
          ...JSON.parse(settings?.settings || "{}"),
        } as ClientSettings;
      } catch {
        guildSettings = {
          ...config.defaultClientSettings,
        } as ClientSettings;
      }

      client.guildsSettings.set(guildId, guildSettings);
    }

    return guildSettings;
  };
