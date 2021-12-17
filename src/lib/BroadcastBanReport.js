const Constants = require("../constants");
const EmbedBuilder = require("./EmbedBuilder");
const ReactionHandler = require("./ReactionHandler");
const { CommandError } = require("../commands/base");
const { errorCodes } = require("../db");
const { isEmpty } = require("../utils");
const {
  AddBanBroadcast,
  GetBanBroadcast,
  GetGuildActiveNetwork,
  GetNetworkGuilds,
} = require("./resourceRepo");

const REPORT_OPTIONS = {
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

const checkBanPresence = (tag) => (guild) => (channel) => async (userId) => {
  try {
    await guild.getBan(userId);
  } catch (e) {
    if (e.code === 10026) {
      const description = `⛔ _Cannot find ban for ${tag}_`;
      const embed = new EmbedBuilder({ description }).sendable;
      await channel.createMessage({ embed });
    }
    throw e;
  }
};

module.exports = async ({
  banReason,
  bannedUser,
  client,
  fromCommand = false,
  guild,
  guildChannel,
}) => {
  const network = await GetGuildActiveNetwork(guild.id);

  let channel;

  if (fromCommand) {
    channel = guildChannel;
  } else {
    const settings = await client.repo.GetGuildClientSettings(guild.id);
    channel = client.repo.GetGuildChannel(guild, settings.channelId, true);
  }

  const banBroadcast = await GetBanBroadcast(
    network.id,
    bannedUser.id,
    guild.id
  );

  if (!isEmpty(banBroadcast)) {
    const description =
      `🔔 _Broadcast for **${banBroadcast.banned_tag}** ` +
      `already sent to network on **${banBroadcast.created_at}**_`;
    const embed = new EmbedBuilder({ color: 16763904, description }).sendable;
    await channel.createMessage({ embed });
    return;
  }

  if (isEmpty(channel)) {
    throw new CommandError("Komvos could not find a notifications channel.");
  }

  const bannedTag = `${bannedUser.username}#${bannedUser.discriminator}`;
  const banValidator = checkBanPresence(bannedTag)(guild)(channel);
  await banValidator(bannedUser.id);

  let reason = null;

  if (fromCommand) {
    reason = banReason;
  }

  const now = new Date().toISOString();

  const banInfo = {
    announcer_id: null,
    announcer_tag: null,
    banned_id: bannedUser.id,
    banned_tag: `${bannedUser.username}#${bannedUser.discriminator}`,
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

  const report = await channel.createMessage({
    embed: new EmbedBuilder({
      description,
      fields,
      image: { url: bannedUser.avatarURL },
      title: "Broadcast this ban to network?",
      titlePrefix: "",
    }).sendable,
  });

  const reactionListener = new ReactionHandler(
    report,
    (userId) => userId !== report.author.id,
    false,
    { time: 300000 }
  );
  const reactions = [...Object.keys(REPORT_OPTIONS), "✅"];

  for (let i = 0; i < reactions.length; i++) {
    await report.addReaction(reactions[i]);
  }

  reactionListener.on("reacted", async (event) => {
    const reactionsLength = reactionListener.collected.filter(
      ({ emoji }) =>
        emoji.name !== "✅" && Object.keys(REPORT_OPTIONS).includes(emoji.name)
    ).length;
    if (event.emoji.name === "✅" && reactionsLength > 0) {
      await banValidator(bannedUser.id);
      await reactionListener.stopListening("accept");
    }
  });

  reactionListener.on("end", async (collected, reason) => {
    if (reason !== "accept") return;
    if (collected.length === 1) {
      await channel.createMessage("You must react to at least one option.");
      return;
    }

    const networkGuilds = (await GetNetworkGuilds(network.id))
      .filter(({ guild_id }) => guild_id !== guild.id)
      .map(({ guild_id }) => client.repo.GetGuild(guild_id));

    /*const mutualGuilds = await client.repo.GetGuildsMutualMembers(
      networkGuilds,
      bannedUser.id
    );*/

    // Get network guilds' who have not already banned user
    const guildsForBroadcast = [];

    for (const g of networkGuilds) {
      try {
        await g.getBan(bannedUser.id);
      } catch (e) {
        // 10026: unknown ban
        if (e.code === 10026) guildsForBroadcast.push(g);
      }
    }

    const channels = [];
    const invalidGuildChannels = [];

    // Get network guilds' channel for broadcast
    for (const guild of guildsForBroadcast) {
      try {
        const settings = await client.repo.GetGuildClientSettings(guild.id);
        const channel = client.repo.GetGuildChannel(
          guild.id,
          settings.channelId
        );
        channels.push(channel);
      } catch (e) {
        console.trace(e);
        invalidGuildChannels.push(guild.name);
      }
    }

    const reportType = collected
      .map((c) => c.emoji.name)
      .filter((c) => !["✅"].includes(c))
      .sort()
      .map((c) => `${c} ${REPORT_OPTIONS[c]}`)
      .join("\n");

    const reactor = guild.members.get(collected[0].userID);

    banInfo.announcer_id = reactor.id;
    banInfo.announcer_tag = `${reactor.username}#${reactor.discriminator}`;
    banInfo.report_type = reportType;

    try {
      await AddBanBroadcast(banInfo);
    } catch (e) {
      if (errorCodes[e.code] === "unique_violation") {
        const description =
          `🔔 _A broadcast for ${banInfo.banned_tag} ` +
          `already sent to network_`;
        const embed = new EmbedBuilder({ description }).sendable;
        await channel.createMessage({ embed });
      }
      throw e;
    }

    fields[0].value = reportType;
    fields.pop(); // remove command from broadcasted message

    for (const gchannel of channels) {
      try {
        await gchannel.createMessage({
          embed: new EmbedBuilder({
            author: {
              icon_url: guild.iconURL,
              name: guild.name,
            },
            description,
            fields,
            footer: { text: `Network ID: ${network.uuid}` },
            image: { url: bannedUser.avatarURL, height: 50, width: 50 },
            title: "Network Ban Broadcast",
          }).sendable,
        });
      } catch (e) {
        invalidGuildChannels.push(gchannel.guild);
        console.trace(e);
      }
    }

    await channel.createMessage({
      embed: new EmbedBuilder({
        description:
          `✅ _**Ban for ${banInfo.banned_tag} broadcasted to network**_` +
          (invalidGuildChannels.length
            ? "\n\n **Note:** There war a problem broadcasting to the following servers:\n" +
              invalidGuildChannels.map((g) => `- ${g.name}`).sort().join(", ") +
              "."
            : ""),
      }).sendable,
    });
  });
};
