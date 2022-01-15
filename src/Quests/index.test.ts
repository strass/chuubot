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
"@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix xml: <http://www.w3.org/XML/1998/namespace>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix chuubo: <http://library.fortitude.cyou/>.

chuubo:Changes a owl:NamedIndividual, chuubo:Quest;
    chuubo:xpEarned \\"0\\"^^xsd:int;
    chuubo:xpRequired \\"35\\"^^xsd:int;
    chuubo:completed false.
"
`);
  });

  it("can find quests", () => {
     expect(Quest.find("http://library.fortitude.cyou/quest-dex-any-time-1")).toMatchInlineSnapshot(`
Array [
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Quest",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "termType": "NamedNode",
      "value": "http://www.w3.org/2002/07/owl#NamedIndividual",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "datatype": Object {
        "termType": "NamedNode",
        "value": "http://www.w3.org/2001/XMLSchema#string",
      },
      "language": "",
      "termType": "Literal",
      "value": "You can earn a bonus XP towards this quest at any time (up to once per scene) by explaining what you've been doing or trying for in the current scene as related to one of your errands. Catch-phrase: \\"I was going that way anyway.\\"",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://purl.org/dc/elements/1.1/description",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/dex",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/belongsTo",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "datatype": Object {
        "termType": "NamedNode",
        "value": "http://www.w3.org/2001/XMLSchema#string",
      },
      "language": "",
      "termType": "Literal",
      "value": "",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/affliction",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "datatype": Object {
        "termType": "NamedNode",
        "value": "http://www.w3.org/2001/XMLSchema#int",
      },
      "language": "",
      "termType": "Literal",
      "value": "0",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/xpEarned",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "datatype": Object {
        "termType": "NamedNode",
        "value": "http://www.w3.org/2001/XMLSchema#int",
      },
      "language": "",
      "termType": "Literal",
      "value": "15",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/xpRequired",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
  Object {
    "graph": Object {
      "termType": "DefaultGraph",
      "value": "",
    },
    "object": Object {
      "datatype": Object {
        "termType": "NamedNode",
        "value": "http://www.w3.org/2001/XMLSchema#string",
      },
      "language": "",
      "termType": "Literal",
      "value": "Running Errands",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://www.w3.org/2000/01/rdf-schema#label",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/quest-dex-any-time-1",
    },
    "termType": "Quad",
  },
]
`);
  });
});
