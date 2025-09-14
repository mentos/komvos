# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Komvos** is a Discord bot for cross-server moderation built with Node.js and Discord.js v14. It allows Discord servers to form networks and share ban information to prevent malicious users from evading bans across multiple servers.

## Development Commands

### Core Commands
- **Start development server**: `npm run app:start:dev` (uses nodemon for auto-reload)
- **TypeScript build**: `npm run build` (compile TS to JS), `npm run build:watch` (watch mode)
- **Type checking**: `npm run typecheck` (check types without building)
- **Linting**: `npm run lint` (check JS/TS files), `npm run lint:fix` (auto-fix issues)
- **Code formatting**: `npm run prettify` (formats all .js/.ts files with Prettier)

### Production Commands (PM2)
- **Start production**: `npm run app:start`
- **Monitor**: `npm run app:monitor`
- **Restart**: `npm run app:restart`
- **Reload**: `npm run app:reload`
- **Stop**: `npm run app:stop`

### Environment Setup
- Copy `.env.example` to `.env` and configure:
  - Discord bot credentials (`KOMVOS_BOT_TOKEN`, `KOMVOS_CLIENT_ID`, etc.)
  - PostgreSQL database connection (`DB_HOST`, `DB_DATABASE`, etc.)
- Node.js version: 22.11.0 (specified in `mise.toml` and `.nvmrc`)

## Architecture Overview

### Core Structure
- **Entry point**: `src/index.js` - Sets up event listeners and database cleanup
- **Client setup**: `src/client.js` - Configures Discord.js client with intents and command loading
- **Configuration**: `src/config.js` - Processes environment variables with `KOMVOS_` prefix
- **Constants**: `src/constants.js` - Defines bot emojis, report types, and settings keys

### Key Directories
- **`src/commands/`**: Discord slash commands (ban-broadcast, network management, etc.)
- **`src/events/`**: Discord event handlers (guild events, message handling)
- **`src/lib/`**: Core business logic and utilities
  - `BroadcastBanReport.js` - Ban broadcast functionality
  - `EmbedBuilder.js` - Discord embed creation
  - `ReactionHandler.js` - User interaction handling
  - `resourceRepo/` - Database operations and queries
- **`src/clientRepo/`**: Client-specific data access patterns
- **`src/db/`**: Database connection and SQL utilities

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