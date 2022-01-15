import { ButtonInteraction } from "discord.js";
import Quest from "../../../../../Quests/index.js";
import { iris } from "../../../../../__schema.js";
import { interactions } from "../../_namespaces.js";

const buttonAddXp = async function (this: any, interaction: ButtonInteraction) {
  const [, resourceId] = interaction.customId.split("|");
  const quest = Quest.find(resourceId);
  quest.set(iris.chuubo.xpEarned, Number(quest.get(iris.chuubo.xpEarned)) + 1);
  interaction.reply({ ephemeral: true, content: "Added 1 XP to Quest" });
};

Object.defineProperty(buttonAddXp, "name", {
  value: interactions.button.quest.addXp,
});

export default buttonAddXp;
