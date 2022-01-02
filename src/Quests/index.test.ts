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
     expect(Quest.find("http://library.fortitude.cyou/Changes")).toMatchInlineSnapshot(`
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
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "http://library.fortitude.cyou/Changes",
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
        "value": "http://www.w3.org/2001/XMLSchema#boolean",
      },
      "language": "",
      "termType": "Literal",
      "value": "false",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/completed",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "you find a new favorite restaurant/market.",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/majorGoals",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "you meet an aunt you've never met.",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/majorGoals",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "you find an extracurricular activity to please your dad.",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/majorGoals",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "missing the life you used to have",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/questFlavor",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "doing what someone from your past would have wanted you to do",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/questFlavor",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "breaking away from who you used to be",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/questFlavor",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "listening to stories from before the 'net",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/questFlavor",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "comforting your little sister",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/questFlavor",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "talking with somebody about why there’s such a thing as death",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/questFlavor",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "proving that you're just as good as everyone else",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/questFlavor",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "http://library.fortitude.cyou/Changes",
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
      "value": "35",
    },
    "predicate": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/xpRequired",
    },
    "subject": Object {
      "termType": "NamedNode",
      "value": "http://library.fortitude.cyou/Changes",
    },
    "termType": "Quad",
  },
]
`);
  });
});
