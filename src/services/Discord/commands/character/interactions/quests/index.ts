import { ButtonInteraction, MessageEmbed } from "discord.js";
import Character from "../../../../../../Character/index.js";
import { iris } from "../../../../../../__schema.js";
import createDiscordEmbed from "../../../../helpers/embed.js";
import { interactions } from "../../../_namespaces.js";

const buttonGetQuests = async function (
  this: any,
  interaction: ButtonInteraction
) {
  try {
    const [, resourceId] = interaction.customId.split("|");
    const character = Character.find(resourceId);
    const questEmbeds = character.questQuads.map((q) => createDiscordEmbed(q));
    console.log(character.subject);
    return interaction.reply({
      content: `${
        character.get(iris.rdfs.label) ?? character.subject.value
      } Quests`,
      embeds: questEmbeds.map(({ title, description }) =>
        new MessageEmbed().setTitle(title).setDescription(description)
      ),
    });
  } catch (ex) {
    let content = "Error parsing content";
    if (ex instanceof Error) {
      content = ex.message;
    }
    return interaction.reply({
      ephemeral: true,
      content,
    });
  }
};

Object.defineProperty(buttonGetQuests, "name", {
  value: interactions.button.character.quests.$,
});

export default buttonGetQuests;
