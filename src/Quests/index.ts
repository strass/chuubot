import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import * as n3 from "n3";
import store, { DataFactory } from "../services/store";
import writeTurtle from "../services/writer";
import { iris, prefixes } from "../__schema";

export default class Quest {
  _store: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>;
  subject: n3.Quad_Subject;
  constructor(questQuads: n3.Quad[]) {
    const store = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>(questQuads);
    const subjects = store.getSubjects(iris.rdf.type, iris.chuubo.Quest, null);
    if (subjects.length !== 1)
      throw new Error("Quest received multiple subjects or a non-quest");
    this.subject = subjects[0];
    this._store = store;
  }

  get(questProperty: string) {
    return this._store
      .getObjects(this.subject, questProperty, null)
      .map((object) => object.value);
  }

  /** Right now this only works for functional properties (single per subject), and only for literals */
  set(questProperty: string, newValue: any) {
    const currentQuads = this._store.getQuads(
      this.subject,
      questProperty,
      null,
      null
    );
    this._store.removeQuads(currentQuads);
    const newQuad = DataFactory.quad(
      this.subject,
      DataFactory.namedNode(questProperty),
      newValue
    );
    this._store.addQuad(newQuad);
    store.replaceSubject(Array.from(this._store));
    return newQuad;
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

  get discordActionComponent() {
    return new MessageActionRow().addComponents(
      new MessageButton().setLabel("Add Quest XP").setCustomId(this.subject.id)
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
