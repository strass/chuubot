import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ButtonInteraction, CommandInteraction
} from "discord.js";
import Quest from "../../../../Quests/index.js";
import { iris } from "../../../../__schema.js";
import { commands, options } from "../_namespaces.js";
import getQuest from "./get.js";

export default {
  name: commands.quest.$,
  data: new SlashCommandBuilder()
    .setName(commands.quest.$)
    .setDescription("Quest related commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(commands.quest.get)
        .setDescription("Looks up an Chuubos Quest.")
        .addStringOption((option) =>
          option
            .setName(options.quest.get.subject)
            .setDescription("ID of item to get")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(commands.quest.create)
        .setDescription("Creates a new Quest.")
        .addStringOption((option) =>
          option
            .setName(options.quest.create.name)
            .setDescription("Name of the Quest.")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    if (interaction.options.getSubcommand() === commands.quest.get) {
      return getQuest(interaction);
    } else if (interaction.options.getSubcommand() === commands.quest.create) {
    } else {
      interaction.reply({ ephemeral: true, content: "Invalid command" });
    }
  },
  async button(interaction: ButtonInteraction) {
    const [, resourceId] = interaction.customId.split("|");
    const quest = Quest.find(resourceId);
    quest.set(
      iris.chuubo.xpEarned,
      Number(quest.get(iris.chuubo.xpEarned)) + 1
    );
    interaction.reply({ ephemeral: true, content: "Added 1 XP to Quest" });
  },
} as const;
