import fs from "fs/promises";
import * as n3 from "n3";
import invariant from "tiny-invariant";
import { iris, prefixes } from "../__schema.js";
import writeTurtle from "./writer.js";
import path from "path";

invariant(process.env.DATA_FOLDER, "DATA_FOLDER must be set");

const store: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad> & {
  replaceSubject: (newQuads: n3.Quad[]) => void;
  findResource: (id: string) => n3.Quad[];
  getLabel: (subject: n3.Quad_Subject) => string;
} = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>() as any;

const dataFiles = await fs.readdir(path.resolve(process.env.DATA_FOLDER));

for (const file of dataFiles) {
  const data = await fs.readFile(path.resolve(process.env.DATA_FOLDER, file));
  const quads = new n3.Parser().parse(data.toString());
  store.addQuads(quads);
}

store.replaceSubject = async (newQuads) => {
  if (newQuads.length === 0) throw new Error("No data provided");
  if (
    newQuads.reduce((acc, curr) => acc.add(curr.subject.id), new Set()).size > 1
  )
    throw new Error("Please only replace one subject at a time");
  const oldQuads = store.getQuads(newQuads[0].subject, null, null, null);
  store.removeQuads(oldQuads);
  store.addQuads(newQuads);

  await fs.writeFile(
    path.resolve(process.env.DATA_FOLDER, "data.ttl"),
    await writeTurtle(Array.from(store))
  );
};

// TODO: what happens if two subjects are pointing at each other with sameAs?
store.findResource = (_id: string) => {
  // Normalize ID
  // TODO: make more robust (autolookup from channel description?)
  let id = _id;
  if (_id.startsWith("chuubo:")) {
    id = id.replace("chuubo:", prefixes.chuubo);
  } else if (_id.startsWith("awooo:")) {
    id = id.replace("awooo:", prefixes.awooo);
  } else if (!id.startsWith("http") && !_id.startsWith(prefixes.chuubo)) {
    id = `${prefixes.chuubo}${_id}`;
  }

  // Find all resources of the given type
  const match = new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>(
    store.getQuads(DataFactory.namedNode(id), null, null, null)
  );

  // Find the resource with the given ID
  invariant(match.size !== 0, `${id} not found`);

  // Check whether the resource has a sameAs
  const sameAs = match.getObjects(null, iris.owl.sameAs, null);

  // If it does, return that resource instead
  if (sameAs.length > 0) {
    invariant(
      sameAs.length === 1,
      `Reference has multiple sameAs (${sameAs.join(", ")})`
    );
    return store.findResource(sameAs[0].id);
  }

  // Otherwise, return the resource
  return Array.from(match);
};

store.getLabel = (subject: n3.Quad_Subject) => {
  const label = store.getObjects(subject, iris.rdfs.label, null)[0]?.value;
  return label ?? subject.value;
};

export default store;

export const DataFactory = n3.DataFactory;

export const ldToQuads = (
  data: Record<string, string | number>,
  subject: n3.Quad_Subject = DataFactory.blankNode()
) =>
  Object.entries(data).map(([key, value]) =>
    DataFactory.quad(
      subject,
      DataFactory.namedNode(key),
      // TODO: better way to handle named nodes or literals
      [iris.rdf.type].includes(key)
        ? DataFactory.namedNode(value as string)
        : DataFactory.literal(value),
      DataFactory.defaultGraph()
    )
  );
