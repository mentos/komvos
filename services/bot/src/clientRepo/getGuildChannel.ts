import { TextChannel } from "discord.js";
import { ExtendedClient } from "../client";
import { isEmpty } from "../utils";

export default (client: ExtendedClient) =>
  (channelId: string): TextChannel | null => {
    if (isEmpty(channelId)) {
      return null;
    }

    let channel;

    try {
      channel = client.channels.cache.get(channelId) as TextChannel;
    } catch {
      // Channel not found or invalid
      return null;
    }

    if (!channel || !client.utils.isGuildTextChannel(channel)) {
      return null;
    }

    return channel;
  };
