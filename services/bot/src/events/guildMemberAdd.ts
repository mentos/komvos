import { GuildMember } from "discord.js";
import { ExtendedClient } from "../client";
import EmbedBuilder from "../lib/EmbedBuilder";
import { createRepositories } from "../lib/resourceRepo/index";
import { sql } from "../db/index";

const repo = createRepositories(sql);

export default (client: ExtendedClient) => async (member: GuildMember) => {
  const guild = member.guild;
  const network = await repo.GetGuildActiveNetwork(guild.id);

  if (!network) return;

  const settings = await client.repo.GetGuildClientSettings(guild.id);

  const channelId = settings.alertsChannelId || settings.channelId;
  const channel = client.repo.GetGuildChannel(channelId);

  if (!channel) return;

  const banBroadcast = await repo.GetBanBroadcast(network.id, member.id);

  if (!banBroadcast) return;

  const role = guild.roles.cache.get(settings.reportedRoleId);

  if (role) {
    await member.roles.add(role.id, "Added by Komvos");
  }

  const description = `> ${banBroadcast.reason || "No reason provided."}\n\n`;
  const fields = [
    { name: "Report Type", value: "Network Ban" }, // banBroadcast doesn't have report_type in the type
    { name: "Banned User", value: banBroadcast.banned_tag, inline: true },
    { name: "User ID", value: banBroadcast.banned_id, inline: true },
    { name: "Broadcast date", value: banBroadcast.created_at.toString() },
  ];
  const embed = new EmbedBuilder({
    color: 16763904,
    description,
    fields,
    footer: { text: `Network ID: ${network.uuid}` },
    image: { url: member.displayAvatarURL(), height: 50, width: 50 },
    title: "Reported Network User",
  }).sendable;

  await channel.send({ embeds: [embed] });
};