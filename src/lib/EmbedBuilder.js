class EmbedBuilder {
  /**
   * The embed object to create new embeds easily.
   * @constructor
   */
  constructor(data = {}) {
    this._author = data.author;
    this._color = data.color;
    this._command = data.command;
    this._description = data.description;
    this._fields = data.fields || [];
    this._footer = data.footer;
    this._image = data.image;
    this._provider = data.provider;
    this._thumbnail = data.thumbnail;
    this._timestamp = data.timestamp;
    this._title = data.title;
    this._type = data.type || "rich";
    this._url = data.url;
    this._video = data.video;

    if (this._title && this._title.length > 256)
      throw new Error("The _title should not be longer than 265 characters.");
    if (this._description && this._description.length > 2048)
      throw new Error(
        "The description should not be longer than 265 characters."
      );
    if (this._color && (this._color < 0 || this._color > 0xffffff))
      throw new Error(
        "Color must be a valid HEX-Color for HTML or be an integer within 0 - 16777215"
      );
    if (this._color && isNaN(this._color))
      throw new Error("Could not convert color to number.");
    if (this._footer && this._footer.text.length > 2048)
      throw new Error("A footer may not be longer than 2048 characters");
    if (this._fields.length >= 25)
      throw new Error("You cannot add more than 25 fields.");
    for (let f of this._fields) {
      if (f.name.length > 256)
        throw new Error("A field name may not be longer than 256 characters.");
      if (f.value.length > 1024)
        throw new Error(
          "A field value may not be longer than 1024 characters."
        );
    }
  }

  /**
   * Set the _title of the embed.
   * @param {String} title
   * @return {EmbedBuilder}
   */
  title(title) {
    if (title.length > 256)
      throw new Error("The _title should not be longer than 265 characters.");
    this._title = title;
    return this;
  }

  /**
   * Set the description of the embed.
   * @param {String} description
   * @return {EmbedBuilder}
   */
  description(description) {
    if (description.length > 2048)
      throw new Error(
        "The description should not be longer than 265 characters."
      );
    this._description = description;
    return this;
  }

  /**
   * Set the url of the embed.
   * @param {String} url
   * @return {EmbedBuilder}
   */
  url(url) {
    this._url = url;
    return this;
  }

  /**
   * Set the color of the embed.
   * @param {String/Number} color
   * @return {EmbedBuilder}
   */
  color(color) {
    let base = 10;
    if (typeof color === "string" && color.startsWith("#")) {
      color = color.replace("#", "");
      base = 16;
    }
    color = parseInt(color, base);
    if (color < 0 || color > 0xffffff)
      throw new Error(
        "Color must be a valid HEX-Color for HTML or be an integer within 0 - 16777215"
      );
    else if (color && isNaN(color))
      throw new Error("Could not convert color to number.");
    this._color = color;
    return this;
  }

  /**
   * Set the author of the embed.
   * @param {String} name The author name.
   * @param {String} [icon_url] The icon url, only http-urls will work.
   * @param {String} [url] The author-url.
   * @return {EmbedBuilder}
   */
  author(name, icon_url, url) {
    this._author = { name, icon_url, url };
    return this;
  }

  /**
   * Set the timestamp of the embed.
   * @param {Date} timestamp
   * @return {EmbedBuilder}
   */
  timestamp(timestamp = new Date()) {
    this._timestamp = timestamp;
    return this;
  }

  /**
   * Add a field to an embed.
   * @param {String} name
   * @param {String} value
   * @param {Boolean} inline
   * @return {EmbedBuilder}
   */
  field(name, value, inline = false) {
    if (this._fields.length >= 25)
      throw new Error("You cannot add more than 25 fields.");
    if (name.length > 256)
      throw new Error("A field name may not be longer than 256 characters.");
    if (value.length > 1024)
      throw new Error("A field value may not be longer than 1024 characters.");
    this._fields.push({ name, value, inline });
    return this;
  }

  /**
   * Set the embed thumbnail.
   * @param {String} url The image url.
   * @param {Object} [options]
   * @param {Number} [options.height] The image height.
   * @param {Number} [options.width] The image width.
   * @return {EmbedBuilder}
   */
  thumbnail(url, options = {}) {
    this._thumbnail = { url, height: options.height, width: options.width };
    return this;
  }

  /**
   * Set the embed image.
   * @param {String} url The image url.
   * @param {Object} [options]
   * @param {Number} [options.height] The image height.
   * @param {Number} [options.width] The image width.
   * @return {EmbedBuilder}
   */
  image(url, options = {}) {
    this._image = { url, height: options.height, width: options.width };
    return this;
  }

  /**
   * Set the embed footer.
   * @param {String} text Text which should be in the footer.
   * @param {String} [icon_url] The icon-url for the footer
   * @return {EmbedBuilder}
   */
  footer(text, icon_url) {
    if (text.length > 2048)
      throw new Error("A footer may not be longer than 2048 characters");
    this._footer = { text, icon_url };
    return this;
  }

  /**
   * Returns the final embed.
   * @return {Embed}
   */
  get sendable() {
    if (this._command) {
      this.field(
        "Argument annotation",
        [
          "The `[` and `]` around the argument mean it’s **required**.",
          "The `(` and `)` around the argument mean it’s **optional**.",
        ].join("\n")
      );
    }

    return {
      author: this._author,
      color: this._color,
      description: this._description,
      fields: this._fields,
      footer: this._footer,
      image: this._image,
      provider: this._provider,
      thumbnail: this._thumbnail,
      timestamp: this._timestamp,
      title: this._title,
      type: this._type,
      url: this._url,
      video: this._video,
    };
  }
}

module.exports = EmbedBuilder;

module.exports.successEmbed = ({
  command = false,
  description = "",
  fields = [],
  imageURL,
  title = "",
  titlePrefix = "**SUCCESS:** ",
}) => {
  const embed = new EmbedBuilder({ color: 7506394, command })
    .title(`${titlePrefix}${title}`)
    .description(description)
    .color("#4dd858")
    .footer("🟢")
    .timestamp();

  if (imageURL) embed.image(imageURL);

  fields.forEach((field) => embed.field(...field));

  return embed.sendable;
};

module.exports.failureEmbed = ({
  command = false,
  description = "",
  fields = [],
  imageURL,
  title = "**ERROR**",
}) => {
  const embed = new EmbedBuilder({ color: 7506394, command })
    .title(title)
    .color("#c13030")
    .description(description)
    .footer("🔴")
    .timestamp();

  if (imageURL) embed.image(imageURL);

  fields.forEach((field) => embed.field(...field));

  return embed.sendable;
};
