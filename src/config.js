require("dotenv").config();

const { camelize } = require("./utils");

const config = Object.keys(process.env)
  .filter((key) => /^KOMVOS_/.test(key))
  .reduce((obj, key) => {
    const _k = camelize(key.replace("KOMVOS_", ""));
    return {
      ...obj,
      [_k]: process.env[key],
    };
  }, {});

config.defaultClientSettings = {
  alertsChannelId: "",
  allowInvites: false,
  broadcasts: "mutual",
  channelId: "",
  prefix: "k!",
  reportedRoleId: "",
};

module.exports = config;
