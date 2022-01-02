import { Parser } from "n3";
import Quest from "../Quests";
import store from "./store";
import fs from "fs/promises";
import { iris } from "../__schema";

// Save a copy of the ontology so we don't make any changes with the test
// TODO: look into mocking the file
const ontologyContents = (await fs.readFile(process.env.ONTOLOGY_FILE)).toString();

const parser = new Parser();
const questQuads1 =
  parser.parse(`@prefix chuubo: <http://library.fortitude.cyou/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

chuubo:MyNewQuest rdf:type owl:NamedIndividual ,
            chuubo:Quest ;
    chuubo:xpEarned "0"^^xsd:int ;
    chuubo:xpRequired "35"^^xsd:int ;
    chuubo:completed "false"^^xsd:boolean .`);

const questQuads2 =
  parser.parse(`@prefix chuubo: <http://library.fortitude.cyou/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

chuubo:MyNewQuest rdf:type owl:NamedIndividual ,
            chuubo:Quest ;
    chuubo:xpEarned "35"^^xsd:int ;
    chuubo:xpRequired "35"^^xsd:int ;
    chuubo:completed "true"^^xsd:boolean .`);

describe("store service", () => {
  it("can replace entries", () => {
    store.addQuads(questQuads1);

    store.replaceSubject(questQuads2);
    const newQuads = Array.from(store);

    const newQuest = new Quest(
      newQuads.filter((q) => q.subject.id === questQuads2[0].subject.id)
    );

    expect(newQuest.get(iris.chuubo.xpEarned)[0]).toEqual("35")
    expect(newQuest.get(iris.chuubo.completed)[0]).toEqual("true")
  });

  afterAll(async () => {
    return await fs.writeFile(process.env.ONTOLOGY_FILE, ontologyContents);
  });
});
