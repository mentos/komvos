"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateGuildSettingsRepository;
function updateGuildSettingsRepository(sql) {
    return async function updateGuildSettings({ guild_id, settings, }) {
        const settingsData = {
            guild_id,
            settings: JSON.stringify(settings),
        };
        await sql `
      INSERT INTO
        guilds_settings
        ${sql(settingsData, 'guild_id', 'settings')}
      ON CONFLICT (guild_id)
      DO UPDATE SET
        settings = ${settingsData.settings},
        updated_at = NOW()`;
    };
}
//# sourceMappingURL=updateGuildSettings.js.map