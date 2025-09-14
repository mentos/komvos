import { Guild } from "discord.js";
import { ExtendedClient } from "../client";
import {
  CommandArgumentError,
  CommandTargetError,
} from "../commands/base";
import { isEmpty } from "../utils";

export default (client: ExtendedClient) => (guildId: string): Guild => {
  if (isEmpty(guildId)) {
    throw new CommandArgumentError("Invalid argument: `guildId` is required.");
  }

  const guild = client.guilds.cache.get(guildId);

  if (!guild || isEmpty(guild)) {
    throw new CommandTargetError(
      "**Invalid server.** Ensure server ID is correct " +
        "and that `Komvos` has been invited to that server."
    );
  }

  return guild;
};