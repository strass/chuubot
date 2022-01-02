import Character from ".";
import Quest from "../Quests";
import store, { DataFactory } from "../services/store";
import { iris } from "../__schema";

const dexChar = store.getQuads(
  DataFactory.namedNode(iris.chuubo.dex),
  null,
  null,
  null
);

describe("Character", () => {
  it("Can grab quests", async () => {
    const character = new Character(dexChar);
    const quests = character.questQuads.map((quads) =>  (new Quest(quads).ttl));
    const ttls = await Promise.all(quests)
    expect(ttls).toMatchInlineSnapshot(`
Array [
  "@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix xml: <http://www.w3.org/XML/1998/namespace>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix chuubo: <http://library.fortitude.cyou/>.

chuubo:Changes a chuubo:Quest, owl:NamedIndividual;
    chuubo:belongsTo chuubo:dex;
    chuubo:completed false;
    chuubo:majorGoals \\"you find a new favorite restaurant/market.\\", \\"you meet an aunt you've never met.\\", \\"you find an extracurricular activity to please your dad.\\";
    chuubo:questFlavor \\"missing the life you used to have\\", \\"doing what someone from your past would have wanted you to do\\", \\"breaking away from who you used to be\\", \\"listening to stories from before the 'net\\", \\"comforting your little sister\\", \\"talking with somebody about why there’s such a thing as death\\", \\"proving that you're just as good as everyone else\\";
    chuubo:xpEarned \\"0\\"^^xsd:int;
    chuubo:xpRequired \\"35\\"^^xsd:int.
",
]
`);
  });
});
