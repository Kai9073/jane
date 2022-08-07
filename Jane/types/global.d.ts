import {
    Attachment,
    ActionRow,
    APIInteractionGuildMember,
    Client,
    Collection,
    ChatInputCommandInteraction,
    Embed,
    Guild,
    GuildMember,
    Message,
    MessageActionRowComponent,
    MessageInteraction,
    MessageType,
    ReactionManager,
    Snowflake,
    Sticker,
    TextBasedChannel,
    User,
    CacheType,
    MessagePayload,
    InteractionReplyOptions,
    ReplyMessageOptions,
    RESTPostAPIApplicationCommandsJSONBody,
    ColorResolvable,
} from "discord.js";
import {
    SchoolDay,
    SpecialSchoolDay,
    UnspecifiedTimetableDay,
} from "../core/classes/dayTypes";

declare global {
    /* util types */
    type AnyCase<T extends string> = string extends T
        ? string
        : T extends `${infer F1}${infer F2}${infer R}`
        ? `${Uppercase<F1> | Lowercase<F1>}${
              | Uppercase<F2>
              | Lowercase<F2>}${AnyCase<R>}`
        : T extends `${infer F}${infer R}`
        ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}`
        : "";
    type valueOf<T> = T[keyof T];
    type Common<A, B> = Pick<A | B, keyof A & keyof B>;

    class JaneLogger {
        label: string;
        constructor(filename: string);
        info(...message: string[]): void;
        warn(...message: string[]): void;
        error(...message: string[]): void;
        fatal(...message: string[]): void;
        static print(level: Level, label: string, ...message: string[]): void;
    }

    class JaneClient extends Client {
        commands: Collection<string, CommandBuilder>;
        prefix: "-" | "--";

        constructor();
        registerCommands(): Promise<Collection<string, CommandBuilder>>;
        registerEvents(): Promise<void>;
        logIn(startInDev: boolean = false): Promise<JaneClient>;
        static getClient(forceReturn?: false): JaneClient | null;
        static getClient(forceReturn?: true): JaneClient;
        static getClient(forceReturn: boolean = false);
    }

    interface CommandInitiator {
        readonly client: Client;
        readonly createdAt: Date;
        readonly createdTimestamp: number;
        readonly guild?: Guild | null;
        readonly member?: GuildMember | APIInteractionGuildMember | null;
        readonly token?: string | null;
        readonly url?: string | null;
        readonly initiatorType: "CommandInteraction" | "Message";
        readonly initiator: ChatInputCommandInteraction | Message;
        attachments: Collection<Snowflake, Attachment>;
        user?: User;
        channel: TextBasedChannel | null;
        channelId: Snowflake;
        components: Array<ActionRow<MessageActionRowComponent>>;
        content?: string;
        deferred: boolean;
        ephemeral?: boolean | null;
        embeds: Array<Embed>;
        guildId?: Snowflake;
        id: Snowflake;
        replyInteraction?: MessageInteraction;
        pinned?: boolean;
        reactions?: ReactionManager;
        replied: boolean;
        stickers: Collection<Snowflake, Sticker>;
        type?: MessageType;

        fetchReply(): Promise<Message | undefined>;
        reply(
            options:
                | string
                | MessagePayload
                | Common<ReplyMessageOptions, InteractionReplyOptions>
        ): Promise<Message>;
        followUp(
            options:
                | string
                | MessagePayload
                | Common<ReplyMessageOptions, InteractionReplyOptions>
        ): Promise<Message>;
        strictReply(
            options:
                | string
                | MessagePayload
                | Common<ReplyMessageOptions, InteractionReplyOptions>
        ): Promise<Message>;
    }

    class CommandBuilder {
        options: CommandOptions;
        callback: CommandCallback;

        constructor(ops: CommandOptions, callback: CommandCallback);

        get client(): JaneClient;

        get slashCommandData(): RESTPostAPIApplicationCommandsJSONBody;
    }

    class EventBuilder {
        eventName: string;
        callback: EventCallback;
        constructor(eventName: string, callback: EventCallback);

        get client(): JaneClient;
    }

    class CommandExport extends CommandBuilder {
        constructor();
    }

    class EventExport extends EventBuilder {
        constructor();
    }

    declare interface CommandOptions {
        name?: string;
        command: string;
        aliases?: string[];
        category?: string;
        description?: string;
        usage?: string;
        cooldown?: number;
        minArgs?: number;
        maxArgs?: number;
        devOnly?: boolean;
        authorPermission?: PermissionResolvable[];
        clientPermission?: PermissionResolvable[];
        messageOnly?: boolean;
        slashOnly?: boolean;
        args?: CommandArgument[];
    }

    declare interface CommandArgument {
        name: string;
        type:
            | "boolean"
            | "channel"
            | "integer"
            | "mentionable"
            | "number"
            | "role"
            | "string"
            | "user";
        description: string;
        required: boolean;
    }

    type CommandCallback = (
        client: JaneClient,
        initiator: CommandInitiator,
        ...args: string[]
    ) => Promise<string | void>;
    type EventCallback = (client: JaneClient, ...args: any[]) => Promise<void>;

    declare interface JaneErrorOptions {
        message: string;
        code?: string;
        id?: number;
    }

    interface JaneEmbedBuilderOptions {
        color?: ColorResolvable;
        titlePrefix?: string;
        titleSuffix?: string;
        contentPrefix?: string;
        contentSuffix?: string;
        showAuthor?: boolean;
        showTimestamp?: boolean;
        showBotFooter?: boolean;
    }

    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            DEVTOKEN: string;
            MONGO_URI: string;
            ID: string;
            DEVID: string;
        }
    }

    interface newsSearchResult {
        mediaName: string;
        priority: number;
        title: string;
        link: string;
        description: string;
        time: number;
    }

    interface DatabaseUserData {
        _id: any;
        snowflake: string;
        tag: string;
        avatarURL: string;
        sClass: number;
        sCNum: string;
        sID: string;
        sName: string;
        hgd: number;
        shards: number;
        highLvLocked: boolean;

        afternoonTeaCount: number;
        gardeningCount: number;
        filesCount: number;
        morningCount: number;
        nightCount: number;
        patCount: number;
        roseCount: number;
        roseTeaCount: number;
        teeTeeCount: number;

        lastAfternoonTea: number;
        lastFiles: number;
        lastGardening: number;
        lastMorning: number;
        lastNight: number;
        lastPat: number;
        lastRose: number;
        lastRoseTea: number;
        lastTeeTee: number;
    }

    type HgdAction =
        | "afternoonTea"
        | "gardening"
        | "files"
        | "morning"
        | "night"
        | "pat"
        | "rose"
        | "roseTea"
        | "teeTee";

    interface HgdActionCounts {
        [action: string]: number;
    }

    interface HgdActionRecords {
        [action: string]: number;
    }

    type ClassId = "3A" | "3B" | "3C" | "3D";

    interface TimetableDay {
        readonly type: SchoolDayType;
    }
    [];

    type SchoolDayTypes = SchoolDay | SpecialSchoolDay;
    type HolidayTypes = Holiday | UnspecifiedTimetableDay;

    type months =
        | "JAN"
        | "FEB"
        | "MAR"
        | "APR"
        | "MAY"
        | "JUN"
        | "JUL"
        | "AUG"
        | "SEP"
        | "OCT"
        | "NOV"
        | "DEC";
    type TimetableDateResolvable =
        | `${string}mr`
        | `${number}${"/" | "-" | "_" | "\\"}${number}`
        | `${number}${"/" | "-" | "_" | ""}${string}`
        | `${number}${string}`
        | `${number}d`
        | `${"MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"}${string}`;
}
