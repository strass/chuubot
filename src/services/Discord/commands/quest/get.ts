import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  CommandInteraction,
} from "discord.js";
import Quest from "../../../../Quests/index.js";
import { iris } from "../../../../__schema.js";
import { interactions, options } from "../_namespaces.js";

export default async function getQuest(interaction: CommandInteraction) {
  try {
    const resourceId = interaction.options.getString(
      options.quest.get.subject,
      true
    );
    const quest = Quest.find(resourceId);
    const majorGoals = quest.get(iris.chuubo.majorGoals);
    const questFlavor = quest.get(iris.chuubo.questFlavor);
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(
            `${quest.get(iris.rdfs.label)[0]} (${quest.get(
              iris.chuubo.xpEarned
            )}/${quest.get(iris.chuubo.xpRequired)})`
          )
          .setDescription(
            `${quest.get(iris.dc.description)[0]}

${
  majorGoals.length
    ? `**Major Goals**
${majorGoals.map((goal) => `- ${goal}`).join("\n")}`
    : ""
}

${
  questFlavor.length
    ? `**Quest Flavor**
${questFlavor.map((goal) => `- ${goal}`).join("\n")}`
    : ""
}`.trimEnd()
          ),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Add Quest XP")
            .setStyle(3)
            .setCustomId(
              `${interactions.button.quest.addXp}|${quest.subject.id}`
            )
        ),
      ],
    });
  } catch (ex) {
    let content = "Error parsing content";
    if (ex instanceof Error) {
      content = ex.message;
    }
    return await interaction.reply({
      ephemeral: true,
      content,
    });
  }
}
