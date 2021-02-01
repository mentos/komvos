const prexit = require("prexit");
const client = require("./client");
const events = require("./events");
const { sql } = require("./db");

client.on("guildBanAdd", events.guildBanAdd(client));
client.on("guildBanRemove", events.guildBanRemove(client));
client.on("guildCreate", events.guildCreate(client));
client.on("guildDelete", events.guildDelete(client));
client.on("guildMemberAdd", events.guildMemberAdd(client));
client.on("messageCreate", events.messageCreate(client));
client.on("ready", () => console.log("Ready!"));

client.connect();

prexit(async () => await sql.end({ timeout: 5 }));
