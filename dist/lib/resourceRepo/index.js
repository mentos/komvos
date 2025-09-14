"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGuildSettings = exports.RevokeBanBroadcast = exports.RemoveGuildFromNetwork = exports.GetNetworkGuilds = exports.GetNetworkGuildIdForKick = exports.GetNetworkBroadcast = exports.GetGuildOwnedNetwork = exports.GetGuildNetworksCount = exports.GetGuildActiveNetwork = exports.GetBanBroadcast = exports.DisbandNetwork = exports.DeleteGuildSettings = exports.CreateNetwork = exports.CreateBanBroadcast = exports.AddGuildToNetwork = exports.AddBanBroadcast = void 0;
exports.createRepositories = createRepositories;
const addBanBroadcast_1 = __importDefault(require("./addBanBroadcast"));
exports.AddBanBroadcast = addBanBroadcast_1.default;
const addGuildToNetwork_1 = __importDefault(require("./addGuildToNetwork"));
exports.AddGuildToNetwork = addGuildToNetwork_1.default;
const createBanBroadcast_1 = __importDefault(require("./createBanBroadcast"));
exports.CreateBanBroadcast = createBanBroadcast_1.default;
const createNetwork_1 = __importDefault(require("./createNetwork"));
exports.CreateNetwork = createNetwork_1.default;
const deleteGuildSettings_1 = __importDefault(require("./deleteGuildSettings"));
exports.DeleteGuildSettings = deleteGuildSettings_1.default;
const disbandNetwork_1 = __importDefault(require("./disbandNetwork"));
exports.DisbandNetwork = disbandNetwork_1.default;
const getBanBroadcast_1 = __importDefault(require("./getBanBroadcast"));
exports.GetBanBroadcast = getBanBroadcast_1.default;
const getGuildActiveNetwork_1 = __importDefault(require("./getGuildActiveNetwork"));
exports.GetGuildActiveNetwork = getGuildActiveNetwork_1.default;
const getGuildNetworksCount_1 = __importDefault(require("./getGuildNetworksCount"));
exports.GetGuildNetworksCount = getGuildNetworksCount_1.default;
const getGuildOwnedNetwork_1 = __importDefault(require("./getGuildOwnedNetwork"));
exports.GetGuildOwnedNetwork = getGuildOwnedNetwork_1.default;
const getNetworkBroadcast_1 = __importDefault(require("./getNetworkBroadcast"));
exports.GetNetworkBroadcast = getNetworkBroadcast_1.default;
const getNetworkGuildIdForKick_1 = __importDefault(require("./getNetworkGuildIdForKick"));
exports.GetNetworkGuildIdForKick = getNetworkGuildIdForKick_1.default;
const getNetworkGuilds_1 = __importDefault(require("./getNetworkGuilds"));
exports.GetNetworkGuilds = getNetworkGuilds_1.default;
const removeGuildFromNetwork_1 = __importDefault(require("./removeGuildFromNetwork"));
exports.RemoveGuildFromNetwork = removeGuildFromNetwork_1.default;
const revokeBanBroadcast_1 = __importDefault(require("./revokeBanBroadcast"));
exports.RevokeBanBroadcast = revokeBanBroadcast_1.default;
const updateGuildSettings_1 = __importDefault(require("./updateGuildSettings"));
exports.UpdateGuildSettings = updateGuildSettings_1.default;
function createRepositories(sql) {
    return {
        AddBanBroadcast: (0, addBanBroadcast_1.default)(sql),
        CreateBanBroadcast: (0, createBanBroadcast_1.default)(sql),
        GetBanBroadcast: (0, getBanBroadcast_1.default)(sql),
        RevokeBanBroadcast: (0, revokeBanBroadcast_1.default)(sql),
        GetNetworkBroadcast: (0, getNetworkBroadcast_1.default)(sql),
        CreateNetwork: (0, createNetwork_1.default)(sql),
        DisbandNetwork: (0, disbandNetwork_1.default)(sql),
        GetGuildActiveNetwork: (0, getGuildActiveNetwork_1.default)(sql),
        GetGuildOwnedNetwork: (0, getGuildOwnedNetwork_1.default)(sql),
        GetNetworkGuilds: (0, getNetworkGuilds_1.default)(sql),
        GetGuildNetworksCount: (0, getGuildNetworksCount_1.default)(sql),
        GetNetworkGuildIdForKick: (0, getNetworkGuildIdForKick_1.default)(sql),
        AddGuildToNetwork: (0, addGuildToNetwork_1.default)(sql),
        RemoveGuildFromNetwork: (0, removeGuildFromNetwork_1.default)(sql),
        UpdateGuildSettings: (0, updateGuildSettings_1.default)(sql),
        DeleteGuildSettings: (0, deleteGuildSettings_1.default)(sql),
    };
}
exports.default = createRepositories;
//# sourceMappingURL=index.js.map