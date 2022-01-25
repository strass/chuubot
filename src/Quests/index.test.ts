import { Parser, Quad } from "n3";
import Quest from ".";
import { iris } from "../__schema";

const parser = new Parser();
const changesQuads =
  parser.parse(`@prefix chuubo: <http://library.fortitude.cyou/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

chuubo:Changes rdf:type owl:NamedIndividual ,
            chuubo:Quest ;
    chuubo:xpEarned "0"^^xsd:int ;
    chuubo:xpRequired "35"^^xsd:int ;
    chuubo:completed "false"^^xsd:boolean .`);

describe("Quest", () => {
  it("errors when given bad input", () => {
    const noQuads: Quad[] = [];
    const multipleQuests: Quad[] =
      parser.parse(`@prefix chuubo: <http://library.fortitude.cyou/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

chuubo:Changes rdf:type owl:NamedIndividual ,
            chuubo:Quest ;
    chuubo:xpEarned "0"^^xsd:int ;
    chuubo:xpRequired "35"^^xsd:int ;
    chuubo:completed "false"^^xsd:boolean .
    
chuubo:Changes2 rdf:type owl:NamedIndividual ,
            chuubo:Quest ;
    chuubo:xpEarned "0"^^xsd:int ;
    chuubo:xpRequired "35"^^xsd:int ;
    chuubo:completed "false"^^xsd:boolean .`);
    const nonQuest: Quad[] =
      parser.parse(`@prefix chuubo: <http://library.fortitude.cyou/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

###  http://library.fortitude.cyou/Emptiness
chuubo:Emptiness rdf:type owl:NamedIndividual ,
                          chuubo:Arc .`);
    expect(() => new Quest(noQuads)).toThrowError();
    expect(() => new Quest(multipleQuests)).toThrowError();
    expect(() => new Quest(nonQuest)).toThrowError();
  });

  const quest = new Quest(changesQuads);
  it("should have data", () => {
    const [xpRequired] = quest.get(iris.chuubo.xpRequired);
    const [xpEarned] = quest.get(iris.chuubo.xpEarned);

    expect(xpRequired).toBe("35");
    expect(xpEarned).toBe("0");
  });

  it("should produce ttl", async () => {
    expect(await quest.ttl).toMatchInlineSnapshot(`
"@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix xml: <http://www.w3.org/XML/1998/namespace>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix dash: <http://datashapes.org/dash#>.
@prefix dc11: <http://purl.org/dc/elements/1.1/>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix awooo: <http://awooo.fortitude.cyou/>.
@prefix chuubo: <http://library.fortitude.cyou/>.
@prefix discord: <http://discord.fortitude.cyou/>.

chuubo:Changes a owl:NamedIndividual, chuubo:Quest;
    chuubo:xpEarned \\"0\\"^^xsd:int;
    chuubo:xpRequired \\"35\\"^^xsd:int;
    chuubo:completed false.
"
`);
  });

  it("can find quests", async () => {
    expect(
await Quest.find("http://awooo.fortitude.cyou/quest-dex-any-time-1").ttl).
toMatchInlineSnapshot(`
"@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix xml: <http://www.w3.org/XML/1998/namespace>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix dash: <http://datashapes.org/dash#>.
@prefix dc11: <http://purl.org/dc/elements/1.1/>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix awooo: <http://awooo.fortitude.cyou/>.
@prefix chuubo: <http://library.fortitude.cyou/>.
@prefix discord: <http://discord.fortitude.cyou/>.

awooo:quest-dex-any-time-1 a owl:NamedIndividual, chuubo:Quest;
    dc11:description \\"You can earn a bonus XP towards this quest at any time (up to once per scene) by explaining what you've been doing or trying for in the current scene as related to one of your errands. Catch-phrase: \\\\\\"I was going that way anyway.\\\\\\"\\";
    rdfs:label \\"Running Errands\\";
    chuubo:belongsTo awooo:character-dex;
    chuubo:xpRequired \\"15\\"^^xsd:int;
    chuubo:xpEarned \\"0\\"^^xsd:int.
"
`);
  });

  it("can find quests by same-as attributes", async () => {
    expect(
      Quest.find("http://awooo.fortitude.cyou/quest-dex-1").subject.id
    ).toBe("http://awooo.fortitude.cyou/quest-dex-any-time-1");
  });

  it("can find quests by short code", async () => {
    // TODO: this is really testing the CustomQuad
    // expect(
    //   Quest.find("quest-dex-any-time-1").subject.id
    // ).toBe("http://library.fortitude.cyou/quest-dex-any-time-1");
    expect(
      Quest.find("awooo:quest-dex-any-time-1").subject.id
    ).toBe("http://awooo.fortitude.cyou/quest-dex-any-time-1");
    // expect(
    //   Quest.find("quest-dex-1").subject.id
    // ).toBe("http://library.fortitude.cyou/quest-dex-any-time-1");
    expect(
      Quest.find("awooo:quest-dex-1").subject.id
    ).toBe("http://awooo.fortitude.cyou/quest-dex-any-time-1");
  });
});
