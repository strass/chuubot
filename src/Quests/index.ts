import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Quad } from "n3";
import CustomQuad from "../services/CustomQuad";
import store, { DataFactory } from "../services/store";
import { iris } from "../__schema";

export default class Quest extends CustomQuad {
  constructor(questQuads: Quad[]) {
    super(questQuads);

    const subjects = this._store.getSubjects(
      iris.rdf.type,
      iris.chuubo.Quest,
      null
    );
    if (subjects.length !== 1)
      throw new Error(
        "Quest received multiple subjects or a non-quest"
      );
  }
  
  get discordEmbed() {
    const [xpRequired] = this.get(iris.chuubo.xpRequired);
    const [xpEarned] = this.get(iris.chuubo.xpEarned);

    const progress = `${xpEarned}/${xpRequired}`;
    return new MessageEmbed().setDescription(progress);
  }

  get discordActionComponent() {
    return new MessageActionRow().addComponents(
      new MessageButton().setLabel("Add Quest XP").setCustomId(`quest|${this.subject.id}`)
    );
  }

  static find(id: string) {
    const quests = store.getSubjects(
      DataFactory.namedNode(iris.rdf.type),
      DataFactory.namedNode(iris.chuubo.Quest),
      DataFactory.defaultGraph()
    );
    const subject =
      quests.find((q) => q.id === id) ??
      DataFactory.blankNode(String(Math.random()));
    const quest = store.getQuads(subject, null, null, null);
    return quest;
  }
}
