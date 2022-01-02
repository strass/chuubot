import { MessageEmbed } from "discord.js";
import * as n3 from "n3";
import store, { DataFactory } from "../services/store";
import writeTurtle from "../services/writer";
import { iris, prefixes } from "../__schema";

export default class Quest {
  _store: n3.Store;
  subject: n3.Quad_Subject;
  constructor(questQuads: n3.Quad[]) {
    const store = new n3.Store(questQuads);
    const subjects = store.getSubjects(iris.rdf.type, iris.chuubo.Quest, null);
    if (subjects.length !== 1)
      throw new Error("Quest received multiple subjects or a non-quest");
    this.subject = subjects[0];
    this._store = store;
  }

  get(questProperty: string) {
    return (
      this._store.getObjects(this.subject, questProperty, null) 
    ).map((object => object.value));
  }

  get ttl() {
    const quads = this._store.getQuads(null, null, null, null);
    return writeTurtle(quads);
  }

  get discordEmbed() {
    const [xpRequired] = this.get(iris.chuubo.xpRequired);
    const [xpEarned] = this.get(iris.chuubo.xpEarned);

    const progress = `${xpEarned}/${xpRequired}`;
    return new MessageEmbed().setDescription(progress);
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
