"use strict";
const EventEmitter = require("events").EventEmitter;
class ReactionHandler extends EventEmitter {
    constructor(message, filter, permanent = false, options = {}) {
        super();
        this.client = message.guild
            ? message.guild.shard.client
            : message.channel.client;
        this.filter = filter;
        this.message = message;
        this.options = options;
        this.permanent = permanent;
        this.ended = false;
        this.collected = [];
        this.listenerAdd = (msg, emoji, reactor) => this.checkAddPreConditions(msg, emoji, reactor);
        this.listenerRemove = (msg, emoji, userID) => this.checkRemovePreConditions(msg, emoji, userID);
        this.client.on("messageReactionAdd", this.listenerAdd);
        this.client.on("messageReactionRemove", this.listenerRemove);
        if (options.time) {
            setTimeout(() => this.stopListening("time"), options.time);
        }
    }
    checkAddPreConditions(msg, emoji, reactor) {
        if (this.message.id !== msg.id) {
            return false;
        }
        if (this.filter(reactor.id)) {
            this.collected.push({ msg, emoji, userID: reactor.id });
            this.emit("reacted", { msg, emoji, userID: reactor.id });
            if (this.collected.length >= this.options.maxMatches) {
                this.stopListening("maxMatches");
                return true;
            }
        }
        return false;
    }
    checkRemovePreConditions(msg, emoji, reactorId) {
        if (this.message.id !== msg.id) {
            return false;
        }
        if (this.filter(reactorId)) {
            this.collected = this.collected.filter(({ emoji: e, userID }) => {
                return userID !== userID && e.name === emoji.name;
            });
        }
        return false;
    }
    stopListening(reason) {
        if (this.ended) {
            return;
        }
        this.ended = true;
        if (!this.permanent) {
            this.client.removeListener("messageReactionAdd", this.listenerAdd);
            this.client.removeListener("messageReactionRemove", this.listenerRemove);
        }
        this.emit("end", this.collected, reason);
    }
}
module.exports = ReactionHandler;
module.exports.collectReactions = (message, filter, options) => {
    const bulkCollector = new ReactionHandler(message, filter, false, options);
    return new Promise((resolve) => {
        bulkCollector.on("end", resolve);
    });
};
//# sourceMappingURL=ReactionHandler.js.map