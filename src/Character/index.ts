import * as n3 from "n3";
import Quest from "../Quests/index.js";
import CustomQuad from "../services/CustomQuad.js";
import store, { DataFactory, ldToQuads } from "../services/store.js";
import { iris } from "../__schema.js";

export default class Character extends CustomQuad {
  constructor(characterQuads: n3.Quad[]) {
    super(characterQuads);

    const subjects = this._store.getSubjects(
      iris.rdf.type,
      iris.chuubo.Character,
      null
    );
    if (subjects.length !== 1)
      throw new Error(
        "Character received multiple subjects or a non-character"
      );
  }

  /** Quests per character */
  get questQuads() {
    const quests = this.get(iris.chuubo.onQuest);
    return quests.map((q) => Quest.find(q));
  }

  setQuests(newQuests: n3.Quad[] | ((oldQuests: Quest[]) => n3.Quad[])) {
    const oldQuestsSubjects = this._store.getSubjects(
      iris.chuubo.onQuest,
      null,
      null
    );

    const oldQuests = oldQuestsSubjects.flatMap((subject) =>
      Quest.find(subject.id)
    );

    const newQuads =
      typeof newQuests === "function" ? newQuests(oldQuests) : newQuests;

    this._store.removeQuads(oldQuests.flatMap((q) => Array.from(q._store)));
    this._store.addQuads(newQuads);
  }

  static find(id: string) {
    const match = store.findResource(id);
    return new Character(match);
  }

  static fromJsonLd(data: Record<string, string | number>) {
    const quads = ldToQuads(data);
    return new Character(quads);
  }
}
