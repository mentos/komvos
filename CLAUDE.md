# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Komvos** is a Discord bot for cross-server moderation built with Node.js and Discord.js v14. It allows Discord servers to form networks and share ban information to prevent malicious users from evading bans across multiple servers.

This project is structured as a **pnpm monorepo** with the main Discord bot application located in `services/komvos-bot/`.

## Development Commands

### Core Commands

- **Start development server**: `pnpm app:start:dev` (uses nodemon for auto-reload)
- **TypeScript build**: `pnpm build` (compile TS to JS across all packages), `pnpm build:watch` (watch mode for bot only)
- **Type checking**: `pnpm typecheck` (check types across all packages)
- **Linting**: `pnpm lint` (check JS/TS files across all packages), `pnpm lint:fix` (auto-fix issues)
- **Code formatting**: `pnpm prettify` (formats all .js/.ts files with Prettier across all packages)

### Production Commands (PM2)

- **Start production**: `pnpm app:start`
- **Monitor**: `pnpm app:monitor`
- **Restart**: `pnpm app:restart`
- **Reload**: `pnpm app:reload`
- **Stop**: `pnpm app:stop`

### Environment Setup

- Copy `services/komvos-bot/.env.example` to `services/komvos-bot/.env` and configure:
  - Discord bot credentials (`KOMVOS_BOT_TOKEN`, `KOMVOS_CLIENT_ID`, etc.)
  - PostgreSQL database connection (`DB_HOST`, `DB_DATABASE`, etc.)
- Node.js version: 22.11.0 (specified in `mise.toml`)

## Monorepo Structure

### Root Level

- **`pnpm-workspace.yaml`**: Defines workspace packages (`services/*`, `packages/*`)
- **`package.json`**: Root package with monorepo scripts that delegate to workspace packages
- **`services/`**: Service applications (Discord bot, web dashboard, etc.)
- **`packages/`**: Shared packages and libraries

### Bot Service (`services/komvos-bot/`)

- **Entry point**: `services/komvos-bot/src/index.js` - Sets up event listeners and database cleanup
- **Client setup**: `services/komvos-bot/src/client.js` - Configures Discord.js client with intents and command loading
- **Configuration**: `services/komvos-bot/src/config.js` - Processes environment variables with `KOMVOS_` prefix
- **Constants**: `services/komvos-bot/src/constants.js` - Defines bot emojis, report types, and settings keys

### Key Directories (Bot Service)

- **`services/komvos-bot/src/commands/`**: Discord slash commands (ban-broadcast, network management, etc.)
- **`services/komvos-bot/src/events/`**: Discord event handlers (guild events, message handling)
- **`services/komvos-bot/src/lib/`**: Core business logic and utilities
  - `BroadcastBanReport.js` - Ban broadcast functionality
  - `EmbedBuilder.js` - Discord embed creation
  - `ReactionHandler.js` - User interaction handling
  - `resourceRepo/` - Database operations and queries
- **`services/komvos-bot/src/clientRepo/`**: Client-specific data access patterns
- **`services/komvos-bot/src/db/`**: Database connection and SQL utilities

### Database Integration

- **Database Layer**: Fully migrated to TypeScript for better type safety
- **PostgreSQL**: Uses the `postgres` library with typed queries
- **Repository Pattern**: All database operations in `src/lib/resourceRepo/` (TypeScript)
- **Connection Management**: `src/db/` handles connections with error codes and utilities
- **Type Safety**: Comprehensive database models and query result types

### Bot Features

- **Network Management**: Servers can create/join/leave moderation networks
- **Ban Broadcasting**: Automatic sharing of bans across network servers
- **Cross-server Tracking**: Monitors user joins and warns about network bans
- **Configurable Settings**: Per-server prefix, channels, and moderation preferences

### Discord.js Integration

The bot uses Discord.js v14 with these key features:

- **Gateway Intents**: Guilds, GuildMessages, GuildMembers, GuildBans, MessageContent
- **Helper utilities**: `client.utils` provides convenience methods for Discord.js operations
- **Permission handling**: Uses Discord.js PermissionsBitField for permission checks
- **Message sending**: Uses `.send({ embeds: [...] })` pattern for embedded messages

### Command System

Commands are dynamically loaded from `src/commands/` directory. Each command exports:

- `name` - Command identifier
- `guildCooldown` - Optional cooldown settings
- Command execution logic

**Key Changes in Discord.js Migration:**

- Replaced Eris `.createMessage()` with Discord.js `.send()`
- Updated embed syntax from `{ embed: ... }` to `{ embeds: [...] }`
- Migrated from `discord-command-parser` to custom command parsing
- Updated permission and user property access patterns

**Database TypeScript Migration:**

- **Full TypeScript conversion**: All database operations now use TypeScript
- **Type safety**: Comprehensive type definitions for all database models and operations
- **Repository pattern**: Typed repository functions with proper error handling
- **Build process**: TypeScript compilation to `dist/` directory
- **Dual support**: JavaScript files continue to work alongside TypeScript database layer

Default command prefix: `k!` (configurable per server)
