import * as n3 from "n3";
import store, { DataFactory } from "../services/store.js";
import writeTurtle from "../services/writer.js";
import { iris } from "../__schema.js";

export default class CustomQuad {
  _store: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>;
  subject: n3.Quad_Subject;
  types: n3.Quad_Object[];
  constructor(quads: n3.Quad[]) {
    const store = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>(quads);
    const subjects = store.getSubjects(null, null, null);
    if (subjects.length !== 1)
      throw new Error(`Received ${subjects.length} subjects, expected 1.`);
    const types = store.getObjects(null, iris.rdf.type, null);
    if (types.length === 0)
      throw new Error(`Received no types, expected at least one.`);
    this.subject = subjects[0];
    this.types = types;
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
      DataFactory.literal(newValue)
    );
    this._store.addQuad(newQuad);
    store.replaceSubject(Array.from(this._store));
    return newQuad;
  }

  save() {
    store.replaceSubject(Array.from(this._store));
  }

  get ttl() {
    const quads = this._store.getQuads(null, null, null, null);
    return writeTurtle(quads);
  }
}
