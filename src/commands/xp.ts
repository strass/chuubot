import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow } from "discord.js";
import Quest from "../Quests";
import store, { DataFactory } from "../services/store";
import { iris } from "../__schema";

/** Look up a quest by ID */
export default {
  data: new SlashCommandBuilder()
    .setName("xp")
    .addStringOption((option) => option.setName("quest id").setRequired(true))
    .addIntegerOption((option) => option.setName("xp change")),
  async execute(interaction: CommandInteraction) {
    try {
      const id = interaction.options.getString("quest id", true);
      const xp = interaction.options.getInteger("xp change", false) ?? 1;
      const quads = store.getQuads(DataFactory.namedNode(id), null, null, null);
      const quest = new Quest(quads);
      const [currentXp] = quest.get(iris.chuubo.xpEarned);
      quest.set(iris.chuubo.xpEarned, currentXp + xp);

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
