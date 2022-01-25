import * as n3 from "n3";
import store, { DataFactory } from "../services/store.js";
import writeTurtle from "../services/writer.js";
import { iris } from "../__schema.js";

export default class CustomQuad {
  _store: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>;
  subject: n3.Quad_Subject;
  types: n3.Quad_Object[];
  shape: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>;
  constructor(quads: n3.Quad[], classType: string) {
    const quadStore = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>(quads);
    const subjects = quadStore.getSubjects(null, null, null);
    if (subjects.length !== 1)
      throw new Error(`Received ${subjects.length} subjects, expected 1.`);
    const types = quadStore.getObjects(null, iris.rdf.type, null);
    if (types.length === 0)
      throw new Error(`Received no types, expected at least one.`);
    if (!types.map((t) => t.id).includes(classType)) {
      throw new Error(`Expected ${classType}.`);
    }
    this.subject = subjects[0];
    this.types = types;
    this._store = quadStore;

    // Find the shape of this class and store it
    const shapeProperties = store.getObjects(classType, iris.sh.property, null);
    const shapeQuads = shapeProperties.reduce((acc, curr) => {
      const propertyObject = store.getQuads(curr.id, null, null, null);
      return [...acc, ...propertyObject];
    }, [] as n3.Quad[]);
    const shape = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>(shapeQuads);
    if (shape.size === 0) {
      console.warn(`No shape found for ${classType}`);
    }
    this.shape = shape;
  }

  get(property: string) {
    return this.getQuads(property).map((q) => q.object.value);
  }

  getQuads(property: string) {
    const results = this._store.getQuads(this.subject, property, null, null);
    if (results.length === 0) {
      if (this.shape) {
        const blankNodes = this.shape.getSubjects(iris.sh.path, property, null);
        return this.shape
          .getQuads(blankNodes[0], iris.sh.defaultValue, null, null)
          .map((q) =>
            DataFactory.quad(
              this.subject,
              DataFactory.namedNode(property),
              q.object
            )
          );
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
