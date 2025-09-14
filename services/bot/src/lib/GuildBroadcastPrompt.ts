import { TextChannel, Message, APIEmbed } from "discord.js";
import { PROMPT_ACCEPT_EMOJI, PROMPT_REJECT_EMOJI } from "../constants";
import ReactionHandler from "./ReactionHandler";

interface GuildBroadcastPromptOptions {
  broadcastChannel: TextChannel;
  expirationMessage?: string | null;
  onAccept?: (() => Promise<void>) | null;
  onReject?: (() => Promise<void>) | null;
  promptContent: string | { embeds: APIEmbed[] } | any;
  replyToBroadcastChannel?: TextChannel | null;
  targetChannel: TextChannel;
  targetExpirationMessage?: string | null;
  time?: number;
}

class GuildBroadcastPrompt {
  private broadcastChannel: TextChannel;
  private expirationMessage?: string | null;
  private onAccept?: (() => Promise<void>) | null;
  private onReject?: (() => Promise<void>) | null;
  private promptContent: string | { embeds: APIEmbed[] } | any;
  private replyToBroadcastChannel?: TextChannel | null;
  private targetChannel: TextChannel;
  private targetExpirationMessage?: string | null;
  private time: number;
  private promptMessage?: Message;

  constructor({
    broadcastChannel,
    expirationMessage,
    onAccept,
    onReject,
    promptContent,
    replyToBroadcastChannel = null,
    targetChannel,
    targetExpirationMessage,
    time = 60000,
  }: GuildBroadcastPromptOptions) {
    this.broadcastChannel = broadcastChannel;
    this.expirationMessage = expirationMessage ?? null;
    this.onAccept = onAccept ?? null;
    this.onReject = onReject ?? null;
    this.promptContent = promptContent;
    this.replyToBroadcastChannel = replyToBroadcastChannel;
    this.targetChannel = targetChannel;
    this.targetExpirationMessage = targetExpirationMessage ?? null;
    this.time = time;
  }

  get replyToChannel(): TextChannel {
    return this.replyToBroadcastChannel || this.broadcastChannel;
  }

  async send(): Promise<Message> {
    this.promptMessage = await this.targetChannel
      .send(
        typeof this.promptContent === "string"
          ? this.promptContent
          : { ...this.promptContent },
      )
      .then(async (m: Message) => {
        await m.react(PROMPT_ACCEPT_EMOJI);
        await m.react(PROMPT_REJECT_EMOJI);
        return m;
      });

    const reactionListener = new ReactionHandler(
      this.promptMessage,
      (userId: string) => userId !== this.promptMessage!.author.id,
      false,
      { maxMatches: 1, time: this.time },
    );

    reactionListener.on("end", async (collected: any[], reason: string) => {
      if (reason === "time") await this.handleExpiration();
      if (reason === "maxMatches")
        await this.handleReaction(collected[0].emoji.name);
    });

    return this.promptMessage;
  }

  private async handleExpiration(): Promise<void> {
    if (this.expirationMessage)
      await this.replyToChannel.send(this.expirationMessage);
    if (this.targetExpirationMessage)
      await this.targetChannel.send(this.targetExpirationMessage);
  }

  private async handleReaction(emojiName: string): Promise<void> {
    switch (emojiName) {
      case PROMPT_ACCEPT_EMOJI:
        if (this.onAccept) await this.onAccept();
        break;

      case PROMPT_REJECT_EMOJI:
        if (this.onReject) await this.onReject();
        break;
    }
  }
}

export default GuildBroadcastPrompt;
