import * as n3 from "n3";
import CustomQuad from "../services/CustomQuad.js";
import store, { DataFactory, ldToQuads } from "../services/store.js";
import { iris } from "../__schema.js";

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

  static find(id: string): Quest {
    const match = store.findResource(id);
    return new Quest(match);
  }

  static fromJsonLd(data: Record<string, string | number>) {
    const quads = ldToQuads(data);
    return new Quest(quads);
  }
}
