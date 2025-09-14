import { Guild } from "discord.js";
import { ExtendedClient } from "../client";
import config from "../config";
import { createRepositories } from "../lib/resourceRepo/index";
import { sql } from "../db/index";

const repo = createRepositories(sql);

export default (_client: ExtendedClient) => async (guild: Guild) => {
  await repo.UpdateGuildSettings({
    guild_id: guild.id,
    settings: config.defaultClientSettings,
  });
};
