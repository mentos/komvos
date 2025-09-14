"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = disbandNetworkRepository;
function disbandNetworkRepository(sql) {
    return async function disbandNetwork(network) {
        return await sql.begin(async (sql) => {
            await sql `DELETE FROM networks WHERE id = ${network.id}`;
            await sql `DELETE FROM networks_guilds WHERE network_id = ${network.id}`;
            await sql `DELETE FROM ban_broadcasts WHERE network_id = ${network.id}`;
            return true;
        });
    };
}
//# sourceMappingURL=disbandNetwork.js.map