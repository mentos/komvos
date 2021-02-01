const Constants = require("../constants");
const ReactionHandler = require("../lib/ReactionHandler");

class GuildBroadcastPrompt {
  constructor({
    broadcastChannel,
    expirationMessage,
    onAccept,
    onReject,
    promptContent,
    replyToBroadcastChannel = null,
    targetChannel,
    targetExpirationMessage,
    time = 6000,
  }) {
    this.broadcastChannel = broadcastChannel;
    this.expirationMessage = expirationMessage;
    this.onAccept = onAccept;
    this.onReject = onReject;
    this.promptContent = promptContent;
    this.replyToBroadcastChannel = replyToBroadcastChannel;
    this.targetChannel = targetChannel;
    this.targetExpirationMessage = targetExpirationMessage;
    this.time = time;

    return this;
  }

  get replyToChannel() {
    return this.replyToBroadcastChannel || this.broadcastChannel;
  }

  async send() {
    this.promptMessage = await this.targetChannel
      .createMessage(
        typeof this.promptContent === "string"
          ? this.promptContent
          : { ...this.promptContent }
      )
      .then(async (m) => {
        await m.addReaction(Constants.PROMPT_ACCEPT_EMOJI);
        await m.addReaction(Constants.PROMPT_REJECT_EMOJI);
        return m;
      });

    const reactionListener = new ReactionHandler(
      this.promptMessage,
      (userId) => userId !== this.promptMessage.author.id,
      false,
      { maxMatches: 1, time: this.time }
    );

    reactionListener.on("end", async (collected, reason) => {
      if (reason === "time") await this.handleExpiration();
      if (reason === "maxMatches")
        await this.handleReaction(collected[0].emoji.name);
    });

    return this.promptMessage;
  }

  async handleExpiration() {
    if (this.expirationMessage)
      await this.replyToChannel.createMessage(this.expirationMessage);
    if (this.targetExpirationMessage)
      await this.targetChannel.createMessage(this.targetExpirationMessage);
  }

  async handleReaction(emojiName) {
    switch (emojiName) {
      case Constants.PROMPT_ACCEPT_EMOJI:
        if (this.onAccept) await this.onAccept();
        break;

      case Constants.PROMPT_REJECT_EMOJI:
        if (this.onReject) await this.onReject();
        break;
    }
  }
}

module.exports = GuildBroadcastPrompt;
