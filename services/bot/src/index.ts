import prexit from "prexit";
import client from "./client";
import * as events from "./events";
import { sql } from "./db/index";
import config from "./config";

client.on("guildBanAdd", events.guildBanAdd(client));
client.on("guildBanRemove", events.guildBanRemove(client));
client.on("guildCreate", events.guildCreate(client));
client.on("guildDelete", events.guildDelete(client));
client.on("guildMemberAdd", events.guildMemberAdd(client));
client.on("messageCreate", events.messageCreate(client));
client.on("ready", () => console.log("Ready!"));

client.login(config.botToken);

prexit(async () => await sql.end({ timeout: 5 }));
