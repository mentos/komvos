import { EventEmitter } from "events";
import { Message, User, Client, GuildEmoji, ReactionEmoji, MessageReaction, PartialMessageReaction, PartialUser, MessageReactionEventDetails, PartialMessage } from "discord.js";

interface CollectedReaction {
  msg: Message | PartialMessage;
  emoji: GuildEmoji | ReactionEmoji;
  userID: string;
}

interface ReactionHandlerOptions {
  time?: number;
  maxMatches?: number;
}

/**
 * An extremely simple and pretty straight forward reaction collector for Discord.js
 */
class ReactionHandler extends EventEmitter {
  private client: Client;
  private filter: (userId: string) => boolean;
  private message: Message;
  private options: ReactionHandlerOptions;
  private permanent: boolean;
  private ended: boolean;
  public collected: CollectedReaction[];
  private listenerAdd: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, details: MessageReactionEventDetails) => void;
  private listenerRemove: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, details: MessageReactionEventDetails) => void;

  constructor(message: Message, filter: (userId: string) => boolean, permanent: boolean = false, options: ReactionHandlerOptions = {}) {
    super();

    this.client = message.client;
    this.filter = filter;
    this.message = message;
    this.options = options;
    this.permanent = permanent;
    this.ended = false;
    this.collected = [];

    this.listenerAdd = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) =>
      this.checkAddPreConditions(reaction.message, reaction.emoji, user);
    this.listenerRemove = (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) =>
      this.checkRemovePreConditions(reaction.message, reaction.emoji, user.id);

    this.client.on("messageReactionAdd", this.listenerAdd);
    this.client.on("messageReactionRemove", this.listenerRemove);

    if (options.time) {
      setTimeout(() => this.stopListening("time"), options.time);
    }
  }

  /**
   * Verify a reaction for its validity with provided filters
   * @param {Message | PartialMessage} msg The message object
   * @param {GuildEmoji | ReactionEmoji} emoji The emoji object containing its name and its ID
   * @param {User | PartialUser} reactor The user who reacted to this message
   */
  private checkAddPreConditions(msg: Message | PartialMessage, emoji: GuildEmoji | ReactionEmoji, reactor: User | PartialUser): boolean {
    if (this.message.id !== msg.id) {
      return false;
    }

    if (this.filter(reactor.id)) {
      this.collected.push({ msg, emoji, userID: reactor.id });
      this.emit("reacted", { msg, emoji, userID: reactor.id });

      if (this.options.maxMatches && this.collected.length >= this.options.maxMatches) {
        this.stopListening("maxMatches");
        return true;
      }
    }

    return false;
  }

  /**
   * Verify a reaction for its validity with provided filters
   * @param {Message | PartialMessage} msg The message object
   * @param {GuildEmoji | ReactionEmoji} emoji The emoji object containing its name and its ID
   * @param {string} reactorId The user ID of the member who subtracted his reaction from this message
   */
  private checkRemovePreConditions(msg: Message | PartialMessage, emoji: GuildEmoji | ReactionEmoji, reactorId: string): boolean {
    if (this.message.id !== msg.id) {
      return false;
    }

    if (this.filter(reactorId)) {
      this.collected = this.collected.filter(({ emoji: e, userID }) => {
        return userID !== reactorId && e.name === emoji.name;
      });
    }

    return false;
  }

  /**
   * Stops collecting reactions and removes the listener from the client
   * @param {string} reason The reason for stopping
   */
  public stopListening(reason: string): void {
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

export const collectReactions = (message: Message, filter: (userId: string) => boolean, options: ReactionHandlerOptions): Promise<CollectedReaction[]> => {
  const bulkCollector = new ReactionHandler(message, filter, false, options);
  return new Promise((resolve) => {
    bulkCollector.on("end", (collected: CollectedReaction[]) => resolve(collected));
  });
};

export default ReactionHandler;