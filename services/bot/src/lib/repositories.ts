import { sql } from "../db/index";
import { createRepositories } from "./resourceRepo/index";

// Create the repository functions with the SQL connection
const repositories = createRepositories(sql);

// Export all repository functions for use in commands
export const {
  AddBanBroadcast,
  CreateBanBroadcast,
  GetBanBroadcast,
  RevokeBanBroadcast,
  GetNetworkBroadcast,
  CreateNetwork,
  DisbandNetwork,
  GetGuildActiveNetwork,
  GetGuildOwnedNetwork,
  GetNetworkGuilds,
  GetGuildNetworksCount,
  GetNetworkGuildIdForKick,
  AddGuildToNetwork,
  RemoveGuildFromNetwork,
  UpdateGuildSettings,
  DeleteGuildSettings,
} = repositories;

export default repositories;
