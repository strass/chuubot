import * as n3 from "n3";
import Quest from "../Quests";
import CustomQuad from "../services/CustomQuad";
import { iris } from "../__schema";

export default class Character extends CustomQuad {
  constructor(characterQuads: n3.Quad[]) {
    super(characterQuads);

    const subjects = this._store.getSubjects(
      iris.rdf.type,
      iris.chuubo.Character,
      null
    );
    if (subjects.length !== 1)
      throw new Error(
        "Character received multiple subjects or a non-character"
      );
  }

  get questQuads() {
      const quests = this.get(iris.chuubo.onQuest)
      return quests.map(q => Quest.find(q))
  }
}
