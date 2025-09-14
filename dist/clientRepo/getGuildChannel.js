"use strict";
const { CommandArgumentError, CommandTargetError, CommandError, } = require("../commands/base");
const { isEmpty } = require("../utils");
module.exports = (client) => (guild, channelId, fallback = false) => {
    if (isEmpty(guild)) {
        throw new CommandArgumentError("Invalid argument: `guild` is required.");
    }
    if (isEmpty(channelId) && fallback && isEmpty(guild.systemChannelId)) {
        throw new CommandError(`Server **${guild.name}** has not setup an announcements channels for **Komvos**. ` +
            "Please let the server administrator know and try again when everything is setup.");
    }
    let channel;
    try {
        channel = client.channels.cache.get(channelId || guild.systemChannelId);
    }
    catch {
    }
    if (!channel) {
        throw new CommandTargetError(`Server **${guild.name}** announcements channel ` +
            `\`${channelId}\` does not exist. ` +
            "Please let the server administrator know and try again when everything is setup.");
    }
    return channel;
};
//# sourceMappingURL=getGuildChannel.js.map