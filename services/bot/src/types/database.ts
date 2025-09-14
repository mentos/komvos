// Database model types for Komvos Discord bot

/**
 * Base interface for database entities with timestamps
 */
export interface BaseEntity {
  id: number;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
}

/**
 * Network model - represents a cross-server moderation network
 */
export interface Network extends BaseEntity {
  creator_guild_id: string;
  creator_id: string;
  creator_tag: string;
  owning_guild_id: string;
  passphrase: string;
  uuid: string;
}

/**
 * Network creation input
 */
export interface CreateNetworkInput {
  guild: {
    id: string;
  };
  author: {
    id: string;
    tag: string;
  };
  clientSettings: GuildSettings;
}

/**
 * Network creation result
 */
export interface CreateNetworkResult {
  passphrase: string;
  uuid: string;
}

/**
 * Network guild relationship - tracks which guilds are in which networks
 */
export interface NetworkGuild extends BaseEntity {
  guild_id: string;
  network_id: number;
}

/**
 * Ban broadcast model - represents a ban shared across network
 */
export interface BanBroadcast extends BaseEntity {
  banned_id: string;
  banned_tag: string;
  guild_id: string;
  network_id: number;
  reason: string;
  announcer_id?: string | null;
  announcer_tag?: string | null;
  revoked_at?: Date | string | null;
}

/**
 * Ban broadcast creation input
 */
export interface CreateBanBroadcastInput {
  banned_id: string;
  banned_tag: string;
  guild_id: string;
  network_id: number;
  reason: string;
}

/**
 * Guild settings model - per-server bot configuration
 */
export interface GuildSettingsRow {
  guild_id: string;
  settings: string; // JSON stringified GuildSettings
}

/**
 * Guild settings object structure
 */
export interface GuildSettings {
  alertsChannelId: string;
  allowInvites: boolean;
  broadcasts: string;
  channelId: string;
  prefix: string;
  reportedRoleId: string;
}

/**
 * SQL query result types
 */
export interface NetworkQueryResult {
  creator_guild_id: string;
  id: number;
}

export interface NetworkGuildQueryResult {
  guild_id: string;
  created_at: Date | string;
}

export interface PassphraseQueryResult {
  passphrase: string;
  uuid: string;
}

/**
 * Function parameter types for repository methods
 */
export interface AddBanBroadcastParams {
  banned_id: string;
  banned_tag: string;
  guild_id: string;
  network_id: number;
  reason: string;
}

export interface AddGuildToNetworkParams {
  guild_id: string;
  network_id: number;
}

export interface RevokeBanBroadcastParams {
  banned_id: string;
  network_id: number;
  reason?: string;
}

export interface UpdateGuildSettingsParams {
  guild_id: string;
  settings: GuildSettings;
}

/**
 * Repository method return types
 */
export type GetBanBroadcastResult = BanBroadcast | undefined;
export type GetNetworkGuildsResult = NetworkGuildQueryResult[];
export type GetGuildActiveNetworkResult = Network | undefined;
export type GetGuildOwnedNetworkResult = Network | undefined;

/**
 * SQL connection type (from postgres library)
 */
export type SqlConnection = any; // TODO: Import proper type from postgres when available

/**
 * Repository factory function type
 */
export type RepositoryFunction<TParams extends any[] = [], TReturn = any> = (
  sql: SqlConnection
) => (...args: TParams) => Promise<TReturn>;

/**
 * Command error types
 */
export interface CommandArgumentError extends Error {
  name: 'CommandArgumentError';
}

/**
 * Discord.js related types for database operations
 */
export interface DiscordGuild {
  id: string;
  name: string;
}

export interface DiscordUser {
  id: string;
  tag: string;
}

export interface DiscordMember extends DiscordUser {
  // Additional member properties as needed
}

/**
 * Database operation result types
 */
export interface DatabaseOperationResult {
  success: boolean;
  error?: string;
}

export interface BulkOperationResult extends DatabaseOperationResult {
  processed: number;
  failed: number;
}