export = EmbedBuilder;
declare class EmbedBuilder {
    constructor(data?: {});
    _author: any;
    _color: any;
    _command: any;
    _description: any;
    _fields: any;
    _footer: any;
    _image: any;
    _provider: any;
    _thumbnail: any;
    _timestamp: any;
    _title: any;
    _type: any;
    _url: any;
    _video: any;
    title(title: string): EmbedBuilder;
    description(description: string): EmbedBuilder;
    url(url: string): EmbedBuilder;
    color(color: any): EmbedBuilder;
    author(name: string, icon_url?: string, url?: string): EmbedBuilder;
    timestamp(timestamp?: Date): EmbedBuilder;
    field(name: string, value: string, inline?: boolean): EmbedBuilder;
    thumbnail(url: string, options?: {
        height?: number | undefined;
        width?: number | undefined;
    }): EmbedBuilder;
    image(url: string, options?: {
        height?: number | undefined;
        width?: number | undefined;
    }): EmbedBuilder;
    footer(text: string, icon_url?: string): EmbedBuilder;
    get sendable(): Embed;
}
declare namespace EmbedBuilder {
    export { successEmbed, failureEmbed };
}
declare function successEmbed({ command, description, fields, imageURL, title, titlePrefix, }: {
    command?: boolean | undefined;
    description?: string | undefined;
    fields?: never[] | undefined;
    imageURL: any;
    title?: string | undefined;
    titlePrefix?: string | undefined;
}): Embed;
declare function failureEmbed({ command, description, fields, imageURL, title, }: {
    command?: boolean | undefined;
    description?: string | undefined;
    fields?: never[] | undefined;
    imageURL: any;
    title?: string | undefined;
}): Embed;
//# sourceMappingURL=EmbedBuilder.d.ts.map