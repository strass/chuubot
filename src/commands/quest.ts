import { SlashCommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, CommandInteraction } from "discord.js";
import Quest from "../Quests";
import store, { DataFactory } from "../services/store";
import { iris } from "../__schema";

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
  async respond(interaction: ButtonInteraction) {
    const [action, questId] = interaction.customId.split("|");
    if (action === this.data.name) {
      const quads = store.getQuads(DataFactory.namedNode(questId), null, null, null);
      const quest = new Quest(quads);
      const [currentXp] = quest.get(iris.chuubo.xpEarned);
      quest.set(iris.chuubo.xpEarned, Number(currentXp) + 1);
      await store.replaceSubject(Array.from(quest._store));

      return await interaction.reply({
        content: "Quest updated",
      });
    }
  },
} as const;
