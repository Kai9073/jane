import { ChannelType, Message } from "discord.js";
import EventBuilder from "../core/eventBuilder";
import { JaneClient } from "../core/client";

const logger = <typeof Logger>require("../core/logger")(__filename);

async function eventCallback(client: JaneClient, message: Message) {
    logger.info(message.content)
    if (message.channel.type === ChannelType.DM) {
        return;
        // return Util.handleDM(message, this.client);
    }
    if (message.author.bot || !message.guild) return;

    // Check whether Bot Client User is JaneInfdev
    if (
        client.user?.id === "801354940265922608" &&
        !message.content.startsWith("-")
    ) {
        return;
    }
    if (
        client.user?.id === "801354940265922608" &&
        message.content.startsWith("--")
    ) {
        return;
    }
    if (
        client.user?.id === "831163022318895209" &&
        !message.content.startsWith("--")
    ) {
        return;
    }

    const args = message.content
        .slice(client.prefix.length)
        .trim()
        .split(/ +/g);
    const cmd = args.shift()?.toLowerCase();

    const command =
        client.commands.get(cmd ?? "") ??
        client.commands.find(
            (command) =>
                !!command.options.aliases &&
                command.options.aliases.includes(cmd || "")
        );

    if (!command) return;

    if (command.options.authorPermission) {
        const neededPerms = [];

        for (const perm of command.options.authorPermission) {
            if (!message.member?.permissions.has(perm)) {
                neededPerms.push(perm);
            }
        }

        if (neededPerms.length) {
            message.reply(
                `❌ | 你需要 \`${neededPerms.join("`, `")}\` 的權限來執行此指令`
            );
            return;
        }
    } else if (command.options.clientPermission) {
        const neededPerms = [];

        for (const perm of command.options.clientPermission) {
            if (!message.member?.permissions.has(perm)) {
                neededPerms.push(perm);
            }
        }

        if (neededPerms.length) {
            message.reply(
                `❌ | 我需要 \`${neededPerms.join(
                    "`, `"
                )}\` 的權限才能執行此指令`
            );
            return;
        }
    }

    if (command.options.devOnly) {
        if (
            !["561866357218607114", "690822196972486656"].includes(
                message.author.id
            )
        ) {
            return;
        }
    }

    if (
        (command.options.minArgs !== undefined &&
            command.options.minArgs > args.length) ||
        (command.options.maxArgs !== undefined &&
            command.options.maxArgs !== -1 &&
            command.options.maxArgs < args.length)
    ) {
        message.reply(
            `❌ | 錯誤指令用法 - 請使用或嘗試: \`${client.prefix}${
                command.options.usage || ""
            }\`.`
        );
        return;
    }

    // logger.info(
    //     `${Util.logColor("cyan.fg")}${message.author.tag}${Util.logColor(
    //         "reset"
    //     )} runned command ${Util.logColor("cyan.fg")}${
    //         command.name
    //     }${Util.logColor("reset")}`
    // );
    // logger.info(`${Util.logColor("reset")}\tCmd: ${message.content}`);
    // logger.info(
    //     `${Util.logColor("reset")}Running command ${Util.logColor("cyan.fg")}${
    //         command.name
    //     }`
    // );

    try {
        command.callback(client, message, ...args);
    } catch (err) {
        message.reply("❌ | 執行指令期間發生了一個錯誤");
    }
}

export default class CommandsLoader extends EventBuilder {
    constructor() {
        super("messageCreate", eventCallback);
    }
}
