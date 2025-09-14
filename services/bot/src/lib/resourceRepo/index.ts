import type { Sql } from 'postgres';

// Import all repository functions
import addBanBroadcastRepository from './addBanBroadcast';
import addGuildToNetworkRepository from './addGuildToNetwork';
import createBanBroadcastRepository from './createBanBroadcast';
import createNetworkRepository from './createNetwork';
import deleteGuildSettingsRepository from './deleteGuildSettings';
import disbandNetworkRepository from './disbandNetwork';
import getBanBroadcastRepository from './getBanBroadcast';
import getGuildActiveNetworkRepository from './getGuildActiveNetwork';
import getGuildNetworksCountRepository from './getGuildNetworksCount';
import getGuildOwnedNetworkRepository from './getGuildOwnedNetwork';
import getNetworkBroadcastRepository from './getNetworkBroadcast';
import getNetworkGuildIdForKickRepository from './getNetworkGuildIdForKick';
import getNetworkGuildsRepository from './getNetworkGuilds';
import removeGuildFromNetworkRepository from './removeGuildFromNetwork';
import revokeBanBroadcastRepository from './revokeBanBroadcast';
import updateGuildSettingsRepository from './updateGuildSettings';

/**
 * Creates all repository functions with a given SQL connection
 */
export function createRepositories(sql: Sql): any {
  return {
    // Ban broadcast operations
    AddBanBroadcast: addBanBroadcastRepository(sql),
    CreateBanBroadcast: createBanBroadcastRepository(sql),
    GetBanBroadcast: getBanBroadcastRepository(sql),
    RevokeBanBroadcast: revokeBanBroadcastRepository(sql),
    GetNetworkBroadcast: getNetworkBroadcastRepository(sql),

    // Network operations
    CreateNetwork: createNetworkRepository(sql),
    DisbandNetwork: disbandNetworkRepository(sql),
    GetGuildActiveNetwork: getGuildActiveNetworkRepository(sql),
    GetGuildOwnedNetwork: getGuildOwnedNetworkRepository(sql),
    GetNetworkGuilds: getNetworkGuildsRepository(sql),
    GetGuildNetworksCount: getGuildNetworksCountRepository(sql),
    GetNetworkGuildIdForKick: getNetworkGuildIdForKickRepository(sql),

    // Guild network membership
    AddGuildToNetwork: addGuildToNetworkRepository(sql),
    RemoveGuildFromNetwork: removeGuildFromNetworkRepository(sql),

    // Guild settings
    UpdateGuildSettings: updateGuildSettingsRepository(sql),
    DeleteGuildSettings: deleteGuildSettingsRepository(sql),
  };
}

// Export individual repository functions for direct use
export {
  addBanBroadcastRepository as AddBanBroadcast,
  addGuildToNetworkRepository as AddGuildToNetwork,
  createBanBroadcastRepository as CreateBanBroadcast,
  createNetworkRepository as CreateNetwork,
  deleteGuildSettingsRepository as DeleteGuildSettings,
  disbandNetworkRepository as DisbandNetwork,
  getBanBroadcastRepository as GetBanBroadcast,
  getGuildActiveNetworkRepository as GetGuildActiveNetwork,
  getGuildNetworksCountRepository as GetGuildNetworksCount,
  getGuildOwnedNetworkRepository as GetGuildOwnedNetwork,
  getNetworkBroadcastRepository as GetNetworkBroadcast,
  getNetworkGuildIdForKickRepository as GetNetworkGuildIdForKick,
  getNetworkGuildsRepository as GetNetworkGuilds,
  removeGuildFromNetworkRepository as RemoveGuildFromNetwork,
  revokeBanBroadcastRepository as RevokeBanBroadcast,
  updateGuildSettingsRepository as UpdateGuildSettings,
};

// Default export for backward compatibility
export default createRepositories;