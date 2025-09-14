import { Guild } from "discord.js";
import { ExtendedClient } from "../client";

export default (_client: ExtendedClient) => async (guild: Guild) => {
  // @TODO: do nothing for now; revert it in the future
  // await DeleteGuildSettings(guild.id);
  console.log(`Left guild: ${guild.name}`);
};