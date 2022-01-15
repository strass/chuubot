import * as n3 from "n3";
import invariant from "tiny-invariant";
import CustomQuad from "../services/CustomQuad.js";
import store, { DataFactory } from "../services/store.js";
import { iris, prefixes } from "../__schema.js";

export default class Quest extends CustomQuad {
  constructor(questQuads: n3.Quad[]) {
    super(questQuads);

    const subjects = this._store.getSubjects(
      iris.rdf.type,
      iris.chuubo.Quest,
      null
    );
    if (subjects.length !== 1)
      throw new Error("Quest received multiple subjects or a non-quest");
  }

  static find(_id: string): Quest {
    let id = _id;
    if (_id.startsWith("chuubo:")) {
      id = id.replace("chuubo:", prefixes.chuubo);
    } else if (!_id.startsWith(prefixes.chuubo)) {
      id = `${prefixes.chuubo}${_id}`;
    }
    const quests = store.getSubjects(
      DataFactory.namedNode(iris.rdf.type),
      DataFactory.namedNode(iris.chuubo.Quest),
      DataFactory.defaultGraph()
    );
    const subject = quests.find((q) => q.id === id);
    invariant(subject, `Quest ${id} not found`);
    const quads = store.getQuads(subject, null, null, null);
    const quest = new Quest(quads);
    const sameAs = quest.get(iris.owl.sameAs);
    if (sameAs.length > 0) {
      invariant(
        sameAs.length === 1,
        `Reference has multiple sameAs (${sameAs.join(", ")})`
      );
      return Quest.find(sameAs[0]);
    }
    return quest;
  }

  static fromJsonLd(data: Record<string, string | number>) {
    const subject = DataFactory.namedNode(iris.rdf.type);
    const quads = Object.entries(data).map(([key, value]) =>
      DataFactory.quad(
        subject,
        DataFactory.namedNode(key),
        DataFactory.literal(value)
      )
    );
    return new Quest(quads);
  }
}
