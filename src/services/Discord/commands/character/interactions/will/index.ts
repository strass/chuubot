import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from "discord.js";
import Character from "../../../../../../Character/index.js";
import { iris } from "../../../../../../__schema.js";
import { interactions } from "../../../_namespaces.js";

const buttonManageWill = async function (
  this: any,
  interaction: ButtonInteraction
) {
  const [, resourceId] = interaction.customId.split("|");
  const character = Character.find(resourceId);
  const totalWill = Number(character.get(iris.chuubo.totalWill)[0]);
  const currentWill = Number(character.get(iris.chuubo.currentWill)[0]);

  interaction.reply({
    ephemeral: true,
    content: `Current Will: ${currentWill}/${totalWill}`,
    components: [
      new MessageActionRow().addComponents(
        new MessageSelectMenu({
          customId: `${interactions.select.character.will.set}|${resourceId}`,
          placeholder: "Set Will",
          options: new Array(totalWill + 1).fill(undefined).map((_, idx) => ({
            value: String(idx),
            label: String(idx),
            selected: idx === currentWill,
          })),
        })
      ),
    ],
  });
};

Object.defineProperty(buttonManageWill, "name", {
  value: interactions.button.character.will.$,
});

export default buttonManageWill;
