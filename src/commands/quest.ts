import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow } from "discord.js";
import Quest from "../Quests";
import store, { DataFactory } from "../services/store";

/** Look up a quest by ID */
export default {
  data: new SlashCommandBuilder()
    .setName("quest")
    .addStringOption((option) =>
      option.setName("id").setDescription("quest id").setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    try {
      const id = interaction.options.getString("id", true);
      const quads = store.getQuads(DataFactory.namedNode(id), null, null, null);
      const quest = new Quest(quads);

      return await interaction.reply({
        embeds: [quest.discordEmbed],
        components: [quest.discordActionComponent],
      });
    } catch (ex) {
      console.error(ex);
      return await interaction.reply({
        ephemeral: true,
        content: "Error",
      });
    }
  },
} as const;
