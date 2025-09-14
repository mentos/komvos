"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteGuildSettingsRepository;
function deleteGuildSettingsRepository(sql) {
    return async function deleteGuildSettings(guildId) {
        await sql `
      DELETE FROM
        guilds_settings
      WHERE
        guild_id = ${guildId}`;
    };
}
//# sourceMappingURL=deleteGuildSettings.js.map