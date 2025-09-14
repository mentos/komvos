export = GuildBroadcastPrompt;
declare class GuildBroadcastPrompt {
    constructor({ broadcastChannel, expirationMessage, onAccept, onReject, promptContent, replyToBroadcastChannel, targetChannel, targetExpirationMessage, time, }: {
        broadcastChannel: any;
        expirationMessage: any;
        onAccept: any;
        onReject: any;
        promptContent: any;
        replyToBroadcastChannel?: null | undefined;
        targetChannel: any;
        targetExpirationMessage: any;
        time?: number | undefined;
    });
    broadcastChannel: any;
    expirationMessage: any;
    onAccept: any;
    onReject: any;
    promptContent: any;
    replyToBroadcastChannel: any;
    targetChannel: any;
    targetExpirationMessage: any;
    time: number;
    get replyToChannel(): any;
    send(): Promise<any>;
    promptMessage: any;
    handleExpiration(): Promise<void>;
    handleReaction(emojiName: any): Promise<void>;
}
//# sourceMappingURL=GuildBroadcastPrompt.d.ts.map