"use strict";
const { CommandArgumentError, CommandTargetError, } = require("../commands/base");
const { isEmpty } = require("../utils");
module.exports = (client) => (guildId) => {
    if (isEmpty(guildId)) {
        throw new CommandArgumentError("Invalid argument: `guildId` is required.");
    }
    const guild = client.guilds.cache.get(guildId);
    if (isEmpty(guild)) {
        throw new CommandTargetError("**Invalid server.** Ensure server ID is correct " +
            "and that `Komvos` has been invited to that server.");
    }
    return guild;
};
//# sourceMappingURL=getGuild.js.map