import {
  Guild,
  TextChannel,
  User,
  DiscordAPIError,
} from "discord.js";
import * as Constants from "../constants";
import EmbedBuilder from "./EmbedBuilder";
import ReactionHandler from "./ReactionHandler";
import { CommandError } from "../commands/base";
import { pgErrorCodes } from "../db/index";
import { isEmpty } from "../utils";
import { ExtendedClient } from "../client";
import {
  AddBanBroadcast,
  GetBanBroadcast,
  GetGuildActiveNetwork,
  GetNetworkGuilds,
} from "./repositories";

interface BroadcastBanReportParams {
  banReason?: string;
  bannedUser: User;
  client: ExtendedClient;
  fromCommand?: boolean;
  guild: Guild;
  guildChannel?: TextChannel;
}

interface BanInfo {
  announcer_id: string | null;
  announcer_tag: string | null;
  banned_id: string;
  banned_tag: string;
  guild_id: string;
  guild_name: string;
  network_id: number;
  reason: string | null;
  created_at: string;
  updated_at: string;
  report_type?: string;
}

const REPORT_OPTIONS: Record<string, string> = {
  "1️⃣": Constants.REPORT_ABUSER,
  "2️⃣": Constants.REPORT_ADVERTISING,
  "3️⃣": Constants.REPORT_BAN_EVASION,
  "4️⃣": Constants.REPORT_CHILD_SAFETY,
  "5️⃣": Constants.REPORT_GRAPHIC_CONTENT,
  "6️⃣": Constants.REPORT_RAIDING,
  "7️⃣": Constants.REPORT_SCAM_ILLEGAL_SERVICES,
  "8️⃣": Constants.REPORT_SPAMMING_TROLLING,
  "9️⃣": Constants.REPORT_MUTUAL_NETWORK,
};

const checkBanPresence =
  (tag: string) =>
  (guild: Guild) =>
  (channel: TextChannel) =>
  async (userId: string): Promise<void> => {
    try {
      await guild.bans.fetch(userId);
    } catch (e) {
      if (e instanceof DiscordAPIError && e.code === 10026) {
        const description = `⛔ _Cannot find ban for ${tag}_`;
        const embed = new EmbedBuilder({ description }).sendable;
        await channel.send({ embeds: [embed] });
      }
      throw e;
    }
  };

export default async function BroadcastBanReport({
  banReason,
  bannedUser,
  client,
  fromCommand = false,
  guild,
  guildChannel,
}: BroadcastBanReportParams): Promise<void> {
  const network = await GetGuildActiveNetwork(guild.id);

  let channel: TextChannel;

  if (fromCommand && guildChannel) {
    channel = guildChannel;
  } else {
    const settings = await client.repo.GetGuildClientSettings(guild.id);
    const foundChannel = client.repo.GetGuildChannel(
      guild.id,
      settings.channelId,
    );
    if (!foundChannel) {
      throw new CommandError("Komvos could not find a notifications channel.");
    }
    channel = foundChannel;
  }

  const banBroadcast = await GetBanBroadcast(
    network.id,
    bannedUser.id,
    guild.id,
  );

  if (!isEmpty(banBroadcast)) {
    const description =
      `🔔 _Broadcast for **${banBroadcast.banned_tag}** ` +
      `already sent to network on **${banBroadcast.created_at}**_`;
    const embed = new EmbedBuilder({ color: 16763904, description }).sendable;
    await channel.send({ embeds: [embed] });
    return;
  }

  if (isEmpty(channel)) {
    throw new CommandError("Komvos could not find a notifications channel.");
  }

  const bannedTag = client.utils.getUserTag(bannedUser);
  const banValidator = checkBanPresence(bannedTag)(guild)(channel);
  await banValidator(bannedUser.id);

  let reason: string | null = null;

  if (fromCommand) {
    reason = banReason || null;
  }

  const now = new Date().toISOString();

  const banInfo: BanInfo = {
    announcer_id: null,
    announcer_tag: null,
    banned_id: bannedUser.id,
    banned_tag: client.utils.getUserTag(bannedUser),
    guild_id: guild.id,
    guild_name: guild.name,
    network_id: network.id,
    reason,
    created_at: now,
    updated_at: now,
  };

  const description = `> ${reason || "No reason provided."}\n\n`;
  let reportType =
    "React to least one of the following reasons and " +
    "then react with ✅ to broadcast to network:\n\n";

  reportType += Object.keys(REPORT_OPTIONS)
    .map((k) => `${k} ${REPORT_OPTIONS[k]}`)
    .join("\n");

  const fields = [
    { name: "Report Type", value: reportType },
    { name: "Banned User", value: banInfo.banned_tag, inline: true },
    { name: "User ID", value: banInfo.banned_id, inline: true },
    { name: "Mention", value: `<@${banInfo.banned_id}>`, inline: true },
    { name: "Broadcast date", value: now },
    { name: "Command", value: `k!ban-broadcast ${bannedUser.id}` },
  ];

  const report = await channel.send({
    embeds: [
      new EmbedBuilder({
        description,
        fields,
        image: { url: bannedUser.displayAvatarURL() },
        title: "Broadcast this ban to network?",
      }).sendable,
    ],
  });

  const reactionListener = new ReactionHandler(
    report,
    (userId) => userId !== report.author.id,
    false,
    { time: 300000 },
  );
  const reactions = [...Object.keys(REPORT_OPTIONS), "✅"];

  for (let i = 0; i < reactions.length; i++) {
    await report.react(reactions[i]);
  }

  reactionListener.on("reacted", async (event: any) => {
    const reactionsLength = reactionListener.collected.filter(
      ({ emoji }) =>
        emoji.name !== "✅" && Object.keys(REPORT_OPTIONS).includes(emoji.name),
    ).length;
    if (event.emoji.name === "✅" && reactionsLength > 0) {
      await banValidator(bannedUser.id);
      await reactionListener.stopListening("accept");
    }
  });

  reactionListener.on("end", async (collected: any[], reason: string) => {
    if (reason !== "accept") return;
    if (collected.length === 1) {
      await channel.send("You must react to at least one option.");
      return;
    }

    const networkGuilds = (await GetNetworkGuilds(network.id))
      .filter(({ guild_id }) => guild_id !== guild.id)
      .map(({ guild_id }) => client.repo.GetGuild(guild_id));

    // Get network guilds' who have not already banned user
    const guildsForBroadcast: Guild[] = [];

    for (const g of networkGuilds) {
      try {
        await g.bans.fetch(bannedUser.id);
      } catch (e) {
        // 10026: unknown ban
        if (e instanceof DiscordAPIError && e.code === 10026) {
          guildsForBroadcast.push(g);
        }
      }
    }

    const channels: TextChannel[] = [];
    const invalidGuildChannels: string[] = [];

    // Get network guilds' channel for broadcast
    for (const networkGuild of guildsForBroadcast) {
      try {
        const settings = await client.repo.GetGuildClientSettings(
          networkGuild.id,
        );
        const guildChannel = client.repo.GetGuildChannel(
          networkGuild.id,
          settings.channelId,
        );
        if (guildChannel) {
          channels.push(guildChannel);
        }
      } catch (e) {
        console.trace(e);
        invalidGuildChannels.push(networkGuild.name);
      }
    }

    const reportType = collected
      .map((c) => c.emoji.name)
      .filter((c) => !["✅"].includes(c))
      .sort()
      .map((c) => `${c} ${REPORT_OPTIONS[c]}`)
      .join("\n");

    const reactorMember = guild.members.cache.get(collected[0].userID);
    if (!reactorMember) {
      throw new Error("Could not find reactor member");
    }

    banInfo.announcer_id = reactorMember.id;
    banInfo.announcer_tag = client.utils.getMemberTag(reactorMember);
    banInfo.report_type = reportType;

    try {
      await AddBanBroadcast(banInfo);
    } catch (e: any) {
      if (e.code === pgErrorCodes.UNIQUE_VIOLATION) {
        const description =
          `🔔 _A broadcast for ${banInfo.banned_tag} ` +
          `already sent to network_`;
        const embed = new EmbedBuilder({ description }).sendable;
        await channel.send({ embeds: [embed] });
      }
      throw e;
    }

    fields[0].value = reportType;
    fields.pop(); // remove command from broadcasted message

    for (const gchannel of channels) {
      try {
        await gchannel.send({
          embeds: [
            new EmbedBuilder({
              author: {
                icon_url: guild.iconURL() || undefined,
                name: guild.name,
              },
              description,
              fields,
              footer: { text: `Network ID: ${network.uuid}` },
              image: {
                url: bannedUser.displayAvatarURL(),
                height: 50,
                width: 50,
              },
              title: "Network Ban Broadcast",
            }).sendable,
          ],
        });
      } catch (e) {
        invalidGuildChannels.push(gchannel.guild.name);
        console.trace(e);
      }
    }

    await channel.send({
      embeds: [
        new EmbedBuilder({
          description:
            `✅ _**Ban for ${banInfo.banned_tag} broadcasted to network**_` +
            (invalidGuildChannels.length
              ? "\n\n **Note:** There was a problem broadcasting to the following servers:\n" +
                invalidGuildChannels
                  .map((g) => `- ${g}`)
                  .sort()
                  .join(", ") +
                "."
              : ""),
        }).sendable,
      ],
    });
  });
}
