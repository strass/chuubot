import { CommandInteraction, MessageEmbed } from "discord.js";
import Quest from "../../../../Quests/index.js";
import { iris } from "../../../../__schema.js";
import { options } from "../_namespaces.js";

export default async function createQuest(interaction: CommandInteraction) {
  try {
    const name = interaction.options.getString(options.quest.create.name, true);
    const quest = Quest.fromJsonLd({
      [iris.rdf.type]: iris.chuubo.Quest,
      [iris.rdfs.label]: name,
      [iris.chuubo.xpEarned]: 0,
      [iris.chuubo.xpRequired]: 15,
    });
    quest.save();
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${quest.get(iris.rdfs.label)[0]}`)
          .setDescription(`${quest.get(iris.dc11.description)[0]}`),
      ],
      //   components: [
      //     new MessageActionRow().addComponents(
      //       new MessageButton()
      //         .setLabel("Add Quest XP")
      //         .setStyle(3)
      //         .setCustomId(
      //           `${interactions.button.quest.addXp}|${quest.subject.id}`
      //         )
      //     ),
      //   ],
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
