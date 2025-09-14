// Main type exports for the Komvos bot

export * from './database';

/**
 * Common utility types
 */
export type Maybe<T> = T | null | undefined;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

/**
 * Environment configuration types
 */
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

/**
 * Database environment configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

/**
 * Command parsing types
 */
export interface ParsedCommand {
  success: boolean;
  command?: string;
  arguments?: string[];
  body?: string;
  prefix?: string;
}

/**
 * Command execution context
 */
export interface CommandContext {
  client: any; // Discord.js client
  message: any; // Discord.js message
  parsedCommand: ParsedCommand;
  settings: any; // Guild settings
}

/**
 * Ban reason constants
 */
export const BAN_REASONS = {
  ABUSER: 'Harassment, threatening behaviour or doxxing',
  ADVERTISING: 'Advertising / invite posting',
  BAN_EVASION: 'Ban Evasion, duplicate account or impersonation',
  CHILD_SAFETY: 'Child Safety',
  GRAPHIC_CONTENT: 'Graphic or illegal content',
  RAIDING: 'Raiding',
  SCAM_ILLEGAL_SERVICES: 'Scam, fraud or illegal services / cheating',
  SPAMMING_TROLLING: 'Spamming / trolling',
  MUTUAL_NETWORK: 'Follow up network ban'
} as const;

export type BanReasonType = keyof typeof BAN_REASONS;
export type BanReasonDescription = typeof BAN_REASONS[BanReasonType];

/**
 * Settings constants
 */
export const SETTINGS_KEYS = {
  ALLOW_INVITES: 'allowInvites',
  ALERTS_CHANNEL_ID: 'alertsChannelId',
  CHANNEL_ID: 'channelId',
  PREFIX: 'prefix',
  ROLE_ID: 'reportedRoleId'
} as const;

export type SettingsKey = typeof SETTINGS_KEYS[keyof typeof SETTINGS_KEYS];