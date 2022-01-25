import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { commands, options } from "../_namespaces.js";

export default {
  name: commands.xp.$,
  data: new SlashCommandBuilder()
    .setName(commands.xp.$)
    .setDescription("Character related commands"),
  async execute(interaction: CommandInteraction) {
    interaction.reply({ ephemeral: true, content: "Invalid command" });
  },
  buttons: [],
} as const;
