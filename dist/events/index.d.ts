export let guildBanAdd: (client: any) => (guild: any, user: any) => Promise<void>;
export let guildBanRemove: (client: any) => (guild: any, user: any) => Promise<void>;
export let guildCreate: () => (guild: any) => Promise<void>;
export let guildDelete: () => (guild: any) => Promise<void>;
export let guildMemberAdd: (client: any) => (guild: any, member: any) => Promise<void>;
export let messageCreate: (client: any) => (message: any) => Promise<void>;
//# sourceMappingURL=index.d.ts.map