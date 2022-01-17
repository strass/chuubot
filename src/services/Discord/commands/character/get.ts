import { CommandInteraction, MessageEmbed } from "discord.js";
import { Quad, Quad_Object, Store } from "n3";
import invariant from "tiny-invariant";
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
    const [titlePropertySubjectQuery] = character.shape.getSubjects(
      iris.discord.component,
      iris.discord.embedTitle,
      null
    );
    const [titleProperty] = character.shape.getObjects(
      titlePropertySubjectQuery,
      iris.sh.path,
      null
    );

    // Find all of the subjects which are tagged as being in the embed description
    const titlePropertyDescriptionQuery = character.shape.getSubjects(
      iris.discord.component,
      iris.discord.embedDescription,
      null
    );
    // Expand the subjects into groups of quads for each path
    const descriptionFields = titlePropertyDescriptionQuery.reduce(
      (acc, subject) => {
        const query = subject;
        acc.push();
        return [
          ...acc,
          new Store(character.shape.getQuads(subject, null, null, null)),
        ];
      },
      [] as Store[]
    );
    // Order the fields
    const orderedDescriptionFields = descriptionFields.sort((a, b) => {
      const aOrder = Number(
        a.getObjects(null, iris.sh.order, null)[0]?.value ?? -1
      );
      const bOrder = Number(
        b.getObjects(null, iris.sh.order, null)[0]?.value ?? -1
      );
      return aOrder - bOrder;
    });

    const description = orderedDescriptionFields.reduce(
      (acc, curr, idx, arr) => {
        let text = "";

        // If there is a title, add it
        const [name] = curr.getObjects(null, iris.sh.name, null);
        if (name) {
          text = text + `**${name.value}**`;
        }

        // Get the field by path
        const [path] = curr.getObjects(null, iris.sh.path, null);
        invariant(path, "No path found for description field");
        const value = character.get(path.value);
        text = text + value;

        // If the next item is in the same group, don't add a new line
        const [group] = curr.getObjects(null, iris.sh.group, null);
        const next = arr[idx + 1];
        const [nextGroup] = next
          ? next.getObjects(null, iris.sh.group, null)
          : [];
        if (!group || !nextGroup || nextGroup.value !== group.value) {
          text = text + "\n";
        }

        return `${acc}${text}`;
      },
      ""
    );

    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`${character.get(titleProperty.id)[0]}`)
          .setDescription(description),
        //   .setDescription(`${character.get(iris.chuubo.arc)[0]} ${
        //   character.get(iris.chuubo.arcLevel)[0]
        // } (${character.get(iris.chuubo.arcTitle)[0]})
        //   Bond: ${character.get(iris.chuubo.bond)[0]}
        //   Affliction: ${character.get(iris.chuubo.affliction)[0]}

        //   ${character
        //     .get(iris.chuubo.skill)
        //     .map((skill) => `- ${skill}`)
        //     .join("\n")}

        //     Will: ${character.get(iris.chuubo.currentWill)[0]}/${
        //   character.get(iris.chuubo.totalWill)[0]
        // }
        //     MP: ${character.get(iris.chuubo.currentMp)[0]}/${
        //   character.get(iris.chuubo.totalMp)[0]
        // }`),
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