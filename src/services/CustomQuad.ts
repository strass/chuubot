import * as n3 from "n3";
import store, { DataFactory } from "../services/store";
import writeTurtle from "../services/writer";
import { iris } from "../__schema";

export default class CustomQuad {
  _store: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>;
  subject: n3.Quad_Subject;
  constructor(quads: n3.Quad[]) {
    const store = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>(quads);
    const subjects = store.getSubjects(iris.rdf.type, null, null);
    if (subjects.length !== 1)
      throw new Error(`Received ${subjects.length} subjects, expected 1.`);
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
}
