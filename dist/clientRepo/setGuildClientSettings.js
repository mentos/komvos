"use strict";
module.exports = (client) => function (guildId, settings) {
    client.guildsSettings.set(guildId, settings);
};
//# sourceMappingURL=setGuildClientSettings.js.map