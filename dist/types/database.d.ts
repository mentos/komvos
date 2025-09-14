export interface BaseEntity {
    id: number;
    created_at: Date | string;
    updated_at: Date | string;
    deleted_at?: Date | string | null;
}
export interface Network extends BaseEntity {
    creator_guild_id: string;
    creator_id: string;
    creator_tag: string;
    owning_guild_id: string;
    passphrase: string;
    uuid: string;
}
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
export interface CreateNetworkResult {
    passphrase: string;
    uuid: string;
}
export interface NetworkGuild extends BaseEntity {
    guild_id: string;
    network_id: number;
}
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
export interface CreateBanBroadcastInput {
    banned_id: string;
    banned_tag: string;
    guild_id: string;
    network_id: number;
    reason: string;
}
export interface GuildSettingsRow {
    guild_id: string;
    settings: string;
}
export interface GuildSettings {
    alertsChannelId: string;
    allowInvites: boolean;
    broadcasts: string;
    channelId: string;
    prefix: string;
    reportedRoleId: string;
}
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
export type GetBanBroadcastResult = BanBroadcast | undefined;
export type GetNetworkGuildsResult = NetworkGuildQueryResult[];
export type GetGuildActiveNetworkResult = Network | undefined;
export type GetGuildOwnedNetworkResult = Network | undefined;
export type SqlConnection = any;
export type RepositoryFunction<TParams extends any[] = [], TReturn = any> = (sql: SqlConnection) => (...args: TParams) => Promise<TReturn>;
export interface CommandArgumentError extends Error {
    name: 'CommandArgumentError';
}
export interface DiscordGuild {
    id: string;
    name: string;
}
export interface DiscordUser {
    id: string;
    tag: string;
}
export interface DiscordMember extends DiscordUser {
}
export interface DatabaseOperationResult {
    success: boolean;
    error?: string;
}
export interface BulkOperationResult extends DatabaseOperationResult {
    processed: number;
    failed: number;
}
//# sourceMappingURL=database.d.ts.map