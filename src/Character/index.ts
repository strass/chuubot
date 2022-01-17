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
      this.types[0], // TODO: is this right?
      null
    );
    if (subjects.length !== 1)
      throw new Error(
        "Character received multiple subjects or a non-character"
      );

    // TODO: validate with shacl
    const shape = store.getQuads(this.types[0], iris.sh.property, null, null);
    const test = shape.reduce(
      (acc, curr) => {
        const propertyObject = store.getQuads(curr.object.id, null, null, null);
        return [...acc, ...propertyObject];
      },
      [] as n3.Quad[]
    );
    console.log(test);
    this.shape = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>(test);
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
