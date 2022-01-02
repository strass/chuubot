import * as n3 from "n3";
import fs from "fs/promises";
import writeTurtle from "./writer";

const store: n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad> & { replaceSubject: (newQuads: n3.Quad[]) => void } =
  new n3.Store<n3.Quad, n3.Quad, n3.Quad, n3.Quad>() as any;

const data = await fs.readFile("src/ontology.ttl");
const quads = new n3.Parser().parse(data.toString());
store.addQuads(quads);

store.replaceSubject = async (newQuads) => {
  if (newQuads.length === 0) throw new Error("No data provided");
  if (
    newQuads.reduce((acc, curr) => acc.add(curr.subject.id), new Set()).size > 1
  )
    throw new Error("Please only replace one subject at a time");
  const oldQuads = store.getQuads(newQuads[0].subject, null, null, null);
  store.removeQuads(oldQuads);
  store.addQuads(newQuads);

  await fs.writeFile("src/ontology.ttl", await writeTurtle(Array.from(store)));
};

export default store;

export const DataFactory = n3.DataFactory;
