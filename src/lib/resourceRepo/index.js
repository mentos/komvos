const { sql } = require("../../db");

const resourceRepo = {
  AddBanBroadcast: require("./addBanBroadcast")(sql),
  AddGuildToNetwork: require("./addGuildToNetwork")(sql),
  CreateNetwork: require("./createNetwork")(sql),
  DeleteGuildSettings: require("./deleteGuildSettings")(sql),
  DisbandNetwork: require("./disbandNetwork")(sql),
  GetBanBroadcast: require("./getBanBroadcast")(sql),
  GetGuildActiveNetwork: require("./getGuildActiveNetwork")(sql),
  GetGuildNetworksCount: require("./getGuildNetworksCount")(sql),
  GetGuildOwnedNetwork: require("./getGuildOwnedNetwork")(sql),
  GetNetworkBroadcast: require("./getNetworkBroadcast")(sql),
  GetNetworkGuildIdForKick: require("./getNetworkGuildIdForKick")(sql),
  GetNetworkGuilds: require("./getNetworkGuilds")(sql),
  RemoveGuildFromNetwork: require("./removeGuildFromNetwork")(sql),
  RevokeBanBroadcast: require("./revokeBanBroadcast")(sql),
  UpdateGuildSettings: require("./updateGuildSettings")(sql),
};

module.exports = resourceRepo;
