import "dotenv/config";
import { camelize } from "./utils";

interface Config {
  [key: string]: any;
  defaultClientSettings: {
    alertsChannelId: string;
    allowInvites: boolean;
    broadcasts: string;
    channelId: string;
    prefix: string;
    reportedRoleId: string;
  };
}

const config: Config = Object.keys(process.env)
  .filter((key) => /^KOMVOS_/.test(key))
  .reduce((obj, key) => {
    const _k = camelize(key.replace("KOMVOS_", ""));
    return {
      ...obj,
      [_k]: process.env[key],
    };
  }, {} as Config);

config.defaultClientSettings = {
  alertsChannelId: "",
  allowInvites: false,
  broadcasts: "mutual",
  channelId: "",
  prefix: "k!",
  reportedRoleId: "",
};

export default config;