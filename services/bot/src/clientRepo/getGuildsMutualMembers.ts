import { Guild } from "discord.js";
import { ExtendedClient } from "../client";
import { CommandArgumentError } from "../commands/base";

export default (_client: ExtendedClient) =>
  async (guilds: Guild[] = [], userId: string): Promise<Guild[]> => {
    if (!guilds.length) return [];
    if (!userId) {
      throw new CommandArgumentError("Invalid argument: `userId` is required.");
    }

    const guildsWithMutuals: Guild[] = [];

    for (const guild of guilds) {
      try {
        const member = await guild.members.fetch(userId);
        if (member) {
          guildsWithMutuals.push(guild);
        }
      } catch {
        // User not found in this guild, continue
      }
    }

    return guildsWithMutuals;
  };
