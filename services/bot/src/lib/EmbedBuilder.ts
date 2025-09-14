import { APIEmbed } from "discord.js";

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface EmbedAuthor {
  name: string;
  icon_url?: string;
  url?: string;
}

interface EmbedFooter {
  text: string;
  icon_url?: string;
}

interface EmbedImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

interface EmbedThumbnail {
  url: string;
  height?: number | null;
  width?: number | null;
}

interface EmbedData {
  author?: EmbedAuthor;
  color?: number;
  command?: boolean;
  description?: string;
  fields?: EmbedField[];
  footer?: EmbedFooter;
  image?: EmbedImage;
  provider?: any;
  thumbnail?: EmbedThumbnail;
  timestamp?: Date | string;
  title?: string;
  type?: string;
  url?: string;
  video?: any;
}

interface SuccessEmbedOptions {
  command?: boolean;
  description?: string;
  fields?: Array<[string, string, boolean?]>;
  imageURL?: string;
  title?: string;
  titlePrefix?: string;
}

interface FailureEmbedOptions {
  command?: boolean;
  description?: string;
  fields?: Array<[string, string, boolean?]>;
  imageURL?: string;
  title?: string;
}

class EmbedBuilder {
  private _author?: EmbedAuthor;
  private _color?: number;
  private _command?: boolean;
  private _description?: string;
  private _fields: EmbedField[];
  private _footer?: EmbedFooter;
  private _image?: EmbedImage;
  private _provider?: any;
  private _thumbnail?: EmbedThumbnail;
  private _timestamp?: Date | string;
  private _title?: string;
  private _type: string;
  private _url?: string;
  private _video?: any;

  /**
   * The embed object to create new embeds easily.
   * @constructor
   */
  constructor(data: EmbedData = {}) {
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
      throw new Error("The _title should not be longer than 256 characters.");
    if (this._description && this._description.length > 2048)
      throw new Error(
        "The description should not be longer than 2048 characters.",
      );
    if (this._color && (this._color < 0 || this._color > 0xffffff))
      throw new Error(
        "Color must be a valid HEX-Color for HTML or be an integer within 0 - 16777215",
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
          "A field value may not be longer than 1024 characters.",
        );
    }
  }

  /**
   * Set the _title of the embed.
   * @param {string} title
   * @return {EmbedBuilder}
   */
  title(title: string): EmbedBuilder {
    if (title.length > 256)
      throw new Error("The _title should not be longer than 256 characters.");
    this._title = title;
    return this;
  }

  /**
   * Set the description of the embed.
   * @param {string} description
   * @return {EmbedBuilder}
   */
  description(description: string): EmbedBuilder {
    if (description.length > 2048)
      throw new Error(
        "The description should not be longer than 2048 characters.",
      );
    this._description = description;
    return this;
  }

  /**
   * Set the url of the embed.
   * @param {string} url
   * @return {EmbedBuilder}
   */
  url(url: string): EmbedBuilder {
    this._url = url;
    return this;
  }

  /**
   * Set the color of the embed.
   * @param {string | number} color
   * @return {EmbedBuilder}
   */
  color(color: string | number): EmbedBuilder {
    let base = 10;
    if (typeof color === "string" && color.startsWith("#")) {
      color = color.replace("#", "");
      base = 16;
    }
    const numColor = parseInt(color.toString(), base);
    if (numColor < 0 || numColor > 0xffffff)
      throw new Error(
        "Color must be a valid HEX-Color for HTML or be an integer within 0 - 16777215",
      );
    else if (numColor && isNaN(numColor))
      throw new Error("Could not convert color to number.");
    this._color = numColor;
    return this;
  }

  /**
   * Set the author of the embed.
   * @param {string} name The author name.
   * @param {string} [icon_url] The icon url, only http-urls will work.
   * @param {string} [url] The author-url.
   * @return {EmbedBuilder}
   */
  author(name: string, icon_url?: string, url?: string): EmbedBuilder {
    this._author = { name, icon_url, url };
    return this;
  }

  /**
   * Set the timestamp of the embed.
   * @param {Date} timestamp
   * @return {EmbedBuilder}
   */
  timestamp(timestamp: Date = new Date()): EmbedBuilder {
    this._timestamp = timestamp;
    return this;
  }

  /**
   * Add a field to an embed.
   * @param {string} name
   * @param {string} value
   * @param {boolean} inline
   * @return {EmbedBuilder}
   */
  field(name: string, value: string, inline: boolean = false): EmbedBuilder {
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
   * @param {string} url The image url.
   * @param {object} [options]
   * @param {number} [options.height] The image height.
   * @param {number} [options.width] The image width.
   * @return {EmbedBuilder}
   */
  thumbnail(
    url: string,
    options: { height?: number; width?: number } = {},
  ): EmbedBuilder {
    this._thumbnail = {
      url,
      height: options.height ?? null,
      width: options.width ?? null,
    };
    return this;
  }

  /**
   * Set the embed image.
   * @param {string} url The image url.
   * @param {object} [options]
   * @param {number} [options.height] The image height.
   * @param {number} [options.width] The image width.
   * @return {EmbedBuilder}
   */
  image(
    url: string,
    options: { height?: number; width?: number } = {},
  ): EmbedBuilder {
    this._image = {
      url,
      height: options.height ?? null,
      width: options.width ?? null,
    };
    return this;
  }

  /**
   * Set the embed footer.
   * @param {string} text Text which should be in the footer.
   * @param {string} [icon_url] The icon-url for the footer
   * @return {EmbedBuilder}
   */
  footer(text: string, icon_url?: string): EmbedBuilder {
    if (text.length > 2048)
      throw new Error("A footer may not be longer than 2048 characters");
    this._footer = { text, icon_url: icon_url ?? undefined };
    return this;
  }

  /**
   * Returns the final embed.
   * @return {APIEmbed}
   */
  get sendable(): APIEmbed {
    if (this._command) {
      this.field(
        "Argument annotation",
        [
          "The `[` and `]` around the argument mean it's **required**.",
          "The `(` and `)` around the argument mean it's **optional**.",
        ].join("\n"),
      );
    }

    return {
      author: this._author,
      color: this._color,
      description: this._description,
      fields: this._fields,
      footer: this._footer,
      image: this._image,
      thumbnail: this._thumbnail,
      timestamp: this._timestamp
        ? new Date(this._timestamp).toISOString()
        : undefined,
      title: this._title,
      url: this._url,
    };
  }
}

export const successEmbed = ({
  command = false,
  description = "",
  fields = [],
  imageURL,
  title = "",
  titlePrefix = "**SUCCESS:** ",
}: SuccessEmbedOptions): APIEmbed => {
  const embed = new EmbedBuilder({ color: 7506394, command })
    .title(`${titlePrefix}${title}`)
    .description(description)
    .color("#4dd858")
    .footer("🟢")
    .timestamp();

  if (imageURL) embed.image(imageURL);

  fields.forEach((field) => embed.field(field[0], field[1], field[2] || false));

  return embed.sendable;
};

export const failureEmbed = ({
  command = false,
  description = "",
  fields = [],
  imageURL,
  title = "**ERROR**",
}: FailureEmbedOptions): APIEmbed => {
  const embed = new EmbedBuilder({ color: 7506394, command })
    .title(title)
    .color("#c13030")
    .description(description)
    .footer("🔴")
    .timestamp();

  if (imageURL) embed.image(imageURL);

  fields.forEach((field) => embed.field(field[0], field[1], field[2] || false));

  return embed.sendable;
};

export default EmbedBuilder;
