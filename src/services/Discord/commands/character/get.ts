import { CommandInteraction, MessageEmbed } from "discord.js";
import Character from "../../../../Character/index.js";
import { iris } from "../../../../__schema.js";
import { options } from "../_namespaces.js";

export default async function getCharacter(interaction: CommandInteraction) {
  try {
    const resourceId = interaction.options.getString(
      options.character.get.subject,
      true
    );
    const character = Character.find(resourceId);
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${character.get(iris.rdfs.label)[0]}`)
          .setDescription(`${character.get(iris.dc.description)[0]}`),
      ],
      // components: [
      //   new MessageActionRow().addComponents(
      //     new MessageButton()
      //       .setLabel("Add Character XP")
      //       .setStyle(3)
      //       .setCustomId(
      //         `${interactions.button.character.addXp}|${character.subject.id}`
      //       )
      //   ),
      // ],
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
