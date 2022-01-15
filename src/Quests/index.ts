import * as n3 from "n3";
import CustomQuad from "../services/CustomQuad";
import store, { DataFactory } from "../services/store";
import { iris } from "../__schema";

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

  static find(id: string) {
    const quests = store.getSubjects(
      DataFactory.namedNode(iris.rdf.type),
      DataFactory.namedNode(iris.chuubo.Quest),
      DataFactory.defaultGraph()
    );

    console.log(quests);
    const subject =
      quests.find((q) => q.id === id) ??
      DataFactory.blankNode(String(Math.random()));
    console.log(subject);
    return store.getQuads(subject, null, null, null);
  }
}
