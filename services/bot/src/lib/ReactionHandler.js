const EventEmitter = require("events").EventEmitter;

/**
 * An extremely simple and pretty straight forward reaction collector for Eris
 */
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
    this.listenerAdd = (msg, emoji, reactor) =>
      this.checkAddPreConditions(msg, emoji, reactor);
    this.listenerRemove = (msg, emoji, userID) =>
      this.checkRemovePreConditions(msg, emoji, userID);

    this.client.on("messageReactionAdd", this.listenerAdd);
    this.client.on("messageReactionRemove", this.listenerRemove);

    if (options.time) {
      setTimeout(() => this.stopListening("time"), options.time);
    }
  }

  /**
   * Verify a reaction for its validity with provided filters
   * @param {object} msg The message object
   * @param {object} emoji The emoji object containing its name and its ID
   * @param {Eris.Member} reactor The member who reacted to this message
   */
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

  /**
   * Verify a reaction for its validity with provided filters
   * @param {object} msg The message object
   * @param {object} emoji The emoji object containing its name and its ID
   * @param {string} reactorId The user ID of the member who subtracted his reaction from this message
   */
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

  /**
   * Stops collecting reactions and removes the listener from the client
   * @param {string} reason The reason for stopping
   */
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
