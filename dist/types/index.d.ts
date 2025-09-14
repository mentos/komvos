export * from './database';
export type Maybe<T> = T | null | undefined;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export interface KomvosConfig {
    botToken: string;
    clientId: string;
    clientSecret: string;
    oauthUrl: string;
    publicKey: string;
    defaultClientSettings: {
        alertsChannelId: string;
        allowInvites: boolean;
        broadcasts: string;
        channelId: string;
        prefix: string;
        reportedRoleId: string;
    };
}
export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}
export interface ParsedCommand {
    success: boolean;
    command?: string;
    arguments?: string[];
    body?: string;
    prefix?: string;
}
export interface CommandContext {
    client: any;
    message: any;
    parsedCommand: ParsedCommand;
    settings: any;
}
export declare const BAN_REASONS: {
    readonly ABUSER: "Harassment, threatening behaviour or doxxing";
    readonly ADVERTISING: "Advertising / invite posting";
    readonly BAN_EVASION: "Ban Evasion, duplicate account or impersonation";
    readonly CHILD_SAFETY: "Child Safety";
    readonly GRAPHIC_CONTENT: "Graphic or illegal content";
    readonly RAIDING: "Raiding";
    readonly SCAM_ILLEGAL_SERVICES: "Scam, fraud or illegal services / cheating";
    readonly SPAMMING_TROLLING: "Spamming / trolling";
    readonly MUTUAL_NETWORK: "Follow up network ban";
};
export type BanReasonType = keyof typeof BAN_REASONS;
export type BanReasonDescription = typeof BAN_REASONS[BanReasonType];
export declare const SETTINGS_KEYS: {
    readonly ALLOW_INVITES: "allowInvites";
    readonly ALERTS_CHANNEL_ID: "alertsChannelId";
    readonly CHANNEL_ID: "channelId";
    readonly PREFIX: "prefix";
    readonly ROLE_ID: "reportedRoleId";
};
export type SettingsKey = typeof SETTINGS_KEYS[keyof typeof SETTINGS_KEYS];
//# sourceMappingURL=index.d.ts.map