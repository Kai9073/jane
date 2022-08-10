import {
    APIActionRowComponent,
    APIMessageActionRowComponent,
} from "discord-api-types/v10";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageActionRowComponent,
} from "discord.js";
import { JaneClient } from "../../core/client";
import { CommandBuilder } from "../../core/commandBuilder";
import { initLogger } from "../../core/logger";
import { JaneEmbedBuilder } from "../../utils/embedBuilder";

const Logger = initLogger(__filename);

const commandOptions: CommandOptions = {
    name: "校歷表",
    command: "calendar",
    aliases: ["cal"],
    category: "校歷表",
    description: "查看校歷表",
    usage: "cal",
};

async function commandCallback(
    client: JaneClient,
    initiator: CommandInitiator,
    arg1: string
) {
    try {
        const calEmbed = new JaneEmbedBuilder(
            "reply",
            "2022/23年度上學期校歷表",
            "\u2800",
            {},
            initiator
        );
        const linkButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            [
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("下載 (PDF)")
                    .setURL("https://jane.ml/files/calendar.pdf"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("下載 (PNG)")
                    .setURL("https://jane.ml/academic/cal"),
            ]
        );
        initiator
            .strictReply({
                embeds: [calEmbed],
                components: [linkButtons],
            })
            .catch((e) => {
                Logger.error(e.stack);
            });
    } catch (e) {
        if (e instanceof Error) {
            Logger.error(e.message);
        }
    }
}

export const command = class TestCommand extends CommandBuilder {
    constructor() {
        super(commandOptions, commandCallback);
    }
};
