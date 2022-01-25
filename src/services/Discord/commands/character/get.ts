import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import Character from "../../../../Character/index.js";
import createDiscordEmbed from "../../helpers/embed.js";
import { interactions, options } from "../_namespaces.js";

export default async function getCharacter(interaction: CommandInteraction) {
  try {
    const resourceId = interaction.options.getString(
      options.character.get.subject,
      true
    );
    const character = Character.find(resourceId);

    const { title, description } = createDiscordEmbed(character);

    return await interaction.reply({
      embeds: [new MessageEmbed().setTitle(title).setDescription(description)],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("Set Will")
            .setStyle(3)
            .setCustomId(
              `${interactions.button.character.will.$}|${character.subject.id}`
            ),
          new MessageButton()
            .setLabel("View Quests")
            .setStyle(3)
            .setCustomId(
              `${interactions.button.character.quests.$}|${character.subject.id}`
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
