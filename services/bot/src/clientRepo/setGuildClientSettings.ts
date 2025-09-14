import { ExtendedClient, ClientSettings } from "../client";

export default (client: ExtendedClient) =>
  function (guildId: string, settings: ClientSettings): void {
    client.guildsSettings.set(guildId, settings);
  };