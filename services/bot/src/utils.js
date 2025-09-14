module.exports = {
  camelize: require("just-camel-case"),

  debug: (e) => console.log(JSON.stringify(e, null, 2)),

  getRolesIdFromMentionRegEx: function (message) {
    const matces = message.match(/<@&?(\d+)>/gi);
    if (matces) {
      return matces.map((s) => s.match(/\d+/)[0]);
    } else {
      return [];
    }
  },

  isEmpty: require("just-is-empty"),

  isNumeric: function (str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  },

  generatePassword: function () {
    return Math.random().toString(36).slice(-10);
  },
};
