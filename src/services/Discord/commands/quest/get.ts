import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  CommandInteraction,
} from "discord.js";
import Quest from "../../../../Quests/index.js";
import { iris } from "../../../../__schema.js";
import createDiscordEmbed from "../../helpers/embed.js";
import { interactions, options } from "../_namespaces.js";

export default async function getQuest(interaction: CommandInteraction) {
  try {
    const resourceId = interaction.options.getString(
      options.quest.get.subject,
      true
    );
    const quest = Quest.find(resourceId);
    const { title, description } = createDiscordEmbed(quest);
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(
            `${title} (${quest.get(iris.chuubo.xpEarned)}/${quest.get(
              iris.chuubo.xpRequired
            )})`
          )
          .setDescription(description),
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
