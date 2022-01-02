import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import store, { DataFactory } from "../services/store";

export default {
  data: new SlashCommandBuilder()
    .setName("quest")
    .addStringOption((option) =>
      option.setName("id").setDescription("quest id").setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    try {
      const id = interaction.options.getString("id");

      if (!id) throw new Error("No ID Provided");

      const quest = store.getObjects(DataFactory.namedNode(id), null, null);
      console.log(quest);

      return await interaction.reply();
    } catch (ex) {
      console.error(ex);
      return await interaction.reply({
        ephemeral: true,
        content: "Error",
      });
    }
  },
} as const;
