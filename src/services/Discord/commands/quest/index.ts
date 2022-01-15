import { SlashCommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, CommandInteraction } from "discord.js";
import Quest from "../../../../Quests/index.js";
import { iris } from "../../../../__schema.js";
import { commands, options, interactions } from "../_namespaces.js";
import buttonAddXp from "./buttons/addXp.js";
import createQuest from "./create.js";
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
      return createQuest(interaction);
    } else {
      interaction.reply({ ephemeral: true, content: "Invalid command" });
    }
  },
  buttons: [buttonAddXp],
} as const;
