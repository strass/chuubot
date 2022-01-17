import * as n3 from "n3";
import store, { DataFactory } from "../services/store.js";
import writeTurtle from "../services/writer.js";
import { iris } from "../__schema.js";

export default class CustomQuad {
  _store: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>;
  subject: n3.Quad_Subject;
  types: n3.Quad_Object[];
  shape?: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>;
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

  get(property: string) {
    const results = this._store
      .getObjects(this.subject, property, null)
      .map((object) => {
        const isLiteral = n3.Util.isLiteral(object);
        if (isLiteral) {
          return object.value;
        }
        const nonLiteralLabel = store.getObjects(
          object,
          iris.rdfs.label,
          null
        )[0];
        return nonLiteralLabel ? nonLiteralLabel.value : object.value;
      });
    if (results.length === 0) {
      if (this.shape) {
        const blankNodes = this.shape.getSubjects(iris.sh.path, property, null);
        const defaultValues = this.shape.getObjects(
          blankNodes[0],
          iris.sh.defaultValue,
          null
        );
        return defaultValues.map((dv) => dv.value);
      }
    }
    return results;
  }

  /** Right now this only works for functional properties (single per subject), and only for literals */
  set(property: string, newValue: any) {
    const currentQuads = this._store.getQuads(
      this.subject,
      property,
      null,
      null
    );
    this._store.removeQuads(currentQuads);
    const newQuad = DataFactory.quad(
      this.subject,
      DataFactory.namedNode(property),
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
