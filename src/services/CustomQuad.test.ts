import * as n3 from "n3";
import { iris } from "../__schema.js";
import CustomQuad from "./CustomQuad.js";

const ttl = `@prefix : <http://library.fortitude.cyou/> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dash: <http://datashapes.org/dash#> .
@prefix dc11: <http://purl.org/dc/elements/1.1/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix awooo: <http://awooo.fortitude.cyou/> .
@prefix chuubo: <http://library.fortitude.cyou/> .
@prefix discord: <http://discord.fortitude.cyou/> .
@base <http://library.fortitude.cyou/> .

awooo:character-kymme rdf:type owl:NamedIndividual ,
                               chuubo:Character ;
                      chuubo:arc chuubo:Aspect ;
                      chuubo:belongsTo awooo:player-kymme ;
                      chuubo:affliction "Technology is hostile to me." ;
                      chuubo:arcLevel "0"^^xsd:int ;
                      chuubo:arcTitle "n00b" ;
                      chuubo:bond "I must live up to my sister's example." ;
                      chuubo:skill "Annoying Little Brother 1" ,
                                   "Clever 2" ,
                                   "Determinator 3" ,
                                   "Good Friend 2" ,
                                   "Technical Wizardry -1" ;
                      rdfs:label "Kymme" .`;

const data = new n3.Parser().parse(ttl);

describe("CustomQuad", () => {
  const c = new CustomQuad(data, iris.chuubo.Character);
  it("can get properties", () => {
    expect(c.get(iris.rdfs.label)[0]).toBe("Kymme");
  });
  it("can get default properties", () => {
    expect(c.get(iris.chuubo.totalMp)[0]).toBe("0");
  });
});
