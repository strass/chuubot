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
    const quests = character.questQuads.map((quads) => quads.ttl);
    const ttls = await Promise.all(quests);
    expect(ttls).toMatchInlineSnapshot(`
Array [
  "@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix xml: <http://www.w3.org/XML/1998/namespace>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix chuubo: <http://library.fortitude.cyou/>.

chuubo:quest-dex-any-time-1 a chuubo:Quest, owl:NamedIndividual;
    <http://purl.org/dc/elements/1.1/description> \\"You can earn a bonus XP towards this quest at any time (up to once per scene) by explaining what you've been doing or trying for in the current scene as related to one of your errands. Catch-phrase: \\\\\\"I was going that way anyway.\\\\\\"\\";
    chuubo:belongsTo chuubo:dex;
    chuubo:affliction \\"\\";
    chuubo:xpEarned \\"0\\"^^xsd:int;
    chuubo:xpRequired \\"15\\"^^xsd:int;
    rdfs:label \\"Running Errands\\".
",
  "@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix xml: <http://www.w3.org/XML/1998/namespace>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix chuubo: <http://library.fortitude.cyou/>.

chuubo:quest-dex-emptiness-1 a chuubo:Quest, owl:NamedIndividual;
    <http://purl.org/dc/elements/1.1/description> \\"You've just moved to the city to live with your dad. You miss the countryside but you don't have anywhere else to go. It's been hard to adjust to your new life - your dad works long hours so you have to spend a lot of time taking care of your sister.\\";
    chuubo:belongsTo chuubo:dex;
    chuubo:completed false;
    chuubo:majorGoals \\"you find a new favorite restaurant/market.\\", \\"you find an extracurricular activity to please your dad.\\", \\"you meet an aunt you've never met.\\";
    chuubo:questFlavor \\"breaking away from who you used to be\\", \\"comforting your little sister\\", \\"doing what someone from your past would have wanted you to do\\", \\"listening to stories from before the 'net\\", \\"missing the life you used to have\\", \\"proving that you're just as good as everyone else\\", \\"talking with somebody about why there’s such a thing as death\\";
    chuubo:xpEarned \\"0\\"^^xsd:int;
    chuubo:xpRequired \\"35\\"^^xsd:int;
    rdfs:label \\"Changes\\".
",
]
`);
  });
});
