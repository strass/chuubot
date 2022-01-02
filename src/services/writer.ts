import { Quad, Writer } from "n3";
import { prefixes } from "../__schema";

export default function writeTurtle(quads: Quad[]) {
  const writer = new Writer({ prefixes });
  writer.addQuads(quads);
  return new Promise<string>((res, rej) => {
    writer.end((err, out) => {
      if (err) rej(err);
      res(out);
    });
  });
}
