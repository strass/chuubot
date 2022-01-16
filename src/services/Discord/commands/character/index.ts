import { SlashCommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, CommandInteraction } from "discord.js";
import { commands, options } from "../_namespaces.js";
import getCharacter from "./get.js";

export default {
  name: commands.character.$,
  data: new SlashCommandBuilder()
    .setName(commands.character.$)
    .setDescription("Character related commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(commands.character.get)
        .setDescription("Looks up an Chuubos Character.")
        .addStringOption((option) =>
          option
            .setName(options.character.get.subject)
            .setDescription("ID of item to get")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    if (interaction.options.getSubcommand() === commands.character.get) {
      return getCharacter(interaction);
    } else {
      interaction.reply({ ephemeral: true, content: "Invalid command" });
    }
  },
  buttons: [],
} as const;
