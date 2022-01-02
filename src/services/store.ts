import * as n3 from "n3";
import fs from "fs/promises";

const store = new n3.Store();
const data = await fs.readFile("data/data.ttl");
const quads = new n3.Parser().parse(data.toString());
store.addQuads(quads);

export default store;

export const DataFactory = n3.DataFactory;
