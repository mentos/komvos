# Komvos

A Discord bot for cross-server moderation.

Default bot prefix: `k!`.

- [Commands](#commands)
  - [`ban-broadcast`](#ban-broadcast)
  - [`ban-revoke`](#ban-revoke)
  - [`help`](#help)
  - [`network-config`](#network-config)
  - [`network-create`](#network-create)
  - [`network-disband`](#network-disband)
  - [`network-invite`](#network-invite)
  - [`network-info`](#network-info)
  - [`network-kick`](#network-kick)
  - [`network-leave`](#network-leave)
- [Resources](#resources)
  - [Ban Reasons](#ban-reasons)
- [Supported Client Events](#supported-client-events)
  - [`guildBanAdd`](#guildbanadd)
  - [`guildBanRemove`](#guildbanremove)
  - [`guildCreate`](#guildcreate)
  - [`guildDelete`](#guilddelete)
  - [`guildMemberAdd`](#guildmemberadd)
- [Development](#development)
  - [Database tables](#database-tables)
    - [`ban_broadcasts` table](#ban_broadcasts-table)
    - [`networks` table](#networks-table)
    - [`networks_servers` table](#networks_servers-table)

## Setup

1. Add bot to your server: `https://discord.com/api/oauth2/authorize?client_id=<DISCORD_APP_CLIENT_ID>&permissions=224452&scope=bot`
2. `k!network-create [channel id]`
2. `k!network-create [channel id]`


## Commands

### `ban-broadcast`

Broadcast a ban to the network.

```
k!ban-broadcast [user ID] (reason)
```

### `ban-revoke`

List recent network bans. Default `limit` is set to `10`.

```
k!ban-revoke [user ID] (reason)
```

### `config`

Configure Komvos for your server.

```
k!config [prefix|channel|invites|permissions] (value)
```

### `help`

Print commands list.

```
k!help
```

### `network-create`

Create a network and set the network announcements channel.

```
k!network-create [channel id]
```

### `network-disband`

Disband the network; only available to network owning servers. All reported bans will be lost and all servers will be kicked (admin-only).

```
k!network-disband [passphrase]
```

### `network-info`

Show network information.

```
k!network-info
```

### `network-invite`

Invite server to network (admin-only).

```
k!network-invite [server id] [passphrase]
```

### `network-kick`

Kick a server from the network; only available to owning servers (admin-only).

```
k!network-kick [server id] [passphrase]
```

### `network-leave`

Leave the network; owning servers must appoint a new owning server upon leaving.

```
k!network-leave
k!network-leave [server id] // for owining servers
```

## Resources

### Ban Reasons

Reasons for broadcasting a ban to a network:

| TYPE | DESCRIPTION |
|-|-|
| ABUSER | Harrasment, threatening behaviour or doxxing |
| ADVERTISING | Advertising or link posting |
| BAN_EVASION | Ban Evasion (eg. secondary accounts) |
| CHILD_SAFETY | Child Safety |
| GRAPHIC_CONTENT | Graphic Content |
| RAIDING | Raiding |
| SCAM_ILLEGAL_SERVICES | Scam, fraud or illegal sales / services |
| SPAMMING_TROLLING | Spamming or trolling |

## Supported Client Events

### `guildBanAdd`

Emitted whenever a member is banned from a guild. Triggers a ban broadcast report.

### `guildBanRemove`

Emitted whenever a member is unbanned from a guild. Sends a ban revoke broadcast (if any).

### `guildCreate`

Emitted whenever the client joins a guild.

### `guildDelete`

Emitted whenever a guild kicks the client or the guild is deleted/left.

### `guildMemberAdd`

Emitted whenever a user joins a guild. Display a warning about malicious users.