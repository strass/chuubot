import { SelectMenuInteraction } from "discord.js";
import Character from "../../../../../../Character/index.js";
import { iris } from "../../../../../../__schema.js";
import { interactions } from "../../../_namespaces.js";

const selectSetWill = async function (
  this: any,
  interaction: SelectMenuInteraction
) {
  const [, resourceId] = interaction.customId.split("|");
  const character = Character.find(resourceId);
  const newValue = character.set(
    iris.chuubo.currentWill,
    interaction.values[0]
  );
  interaction.reply({
    ephemeral: true,
    content: `Set Will to ${newValue.object.value}`,
  });
};

Object.defineProperty(selectSetWill, "name", {
  value: interactions.select.character.will.set,
});

export default selectSetWill;
