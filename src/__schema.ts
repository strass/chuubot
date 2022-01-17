
export module prefixes {
    export const sh = "http://www.w3.org/ns/shacl#";
    export const owl = "http://www.w3.org/2002/07/owl#";
    export const rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    export const xml = "http://www.w3.org/XML/1998/namespace";
    export const xsd = "http://www.w3.org/2001/XMLSchema#";
    export const dash = "http://datashapes.org/dash#";
    export const dc11 = "http://purl.org/dc/elements/1.1/";
    export const rdfs = "http://www.w3.org/2000/01/rdf-schema#";
    export const awooo = "http://awooo.fortitude.cyou/";
    export const chuubo = "http://library.fortitude.cyou/";
    export const discord = "http://discord.fortitude.cyou/";
    export const $ = "http://library.fortitude.cyou/";
};

export module iris {
    export module chuubo {
        export const $ = "http://library.fortitude.cyou/";
        export const arc = "http://library.fortitude.cyou/arc";
        export const Character = "http://library.fortitude.cyou/Character";
        export const Arc = "http://library.fortitude.cyou/Arc";
        export const belongsTo = "http://library.fortitude.cyou/belongsTo";
        export const onQuest = "http://library.fortitude.cyou/onQuest";
        export const Quest = "http://library.fortitude.cyou/Quest";
        export const Player = "http://library.fortitude.cyou/Player";
        export const affliction = "http://library.fortitude.cyou/affliction";
        export const arcLevel = "http://library.fortitude.cyou/arcLevel";
        export const arcTitle = "http://library.fortitude.cyou/arcTitle";
        export const bond = "http://library.fortitude.cyou/bond";
        export const completed = "http://library.fortitude.cyou/completed";
        export const currentMp = "http://library.fortitude.cyou/currentMp";
        export const currentWill = "http://library.fortitude.cyou/currentWill";
        export const majorGoals = "http://library.fortitude.cyou/majorGoals";
        export const questFlavor = "http://library.fortitude.cyou/questFlavor";
        export const skill = "http://library.fortitude.cyou/skill";
        export const totalMp = "http://library.fortitude.cyou/totalMp";
        export const totalWill = "http://library.fortitude.cyou/totalWill";
        export const xpEarned = "http://library.fortitude.cyou/xpEarned";
        export const xpRequired = "http://library.fortitude.cyou/xpRequired";
        export const QuestAlias = "http://library.fortitude.cyou/QuestAlias";
        export const Emptiness = "http://library.fortitude.cyou/Emptiness";
        export const Knight = "http://library.fortitude.cyou/Knight";
        export const Aspect = "http://library.fortitude.cyou/Aspect";
    };
    export module rdf {
        export const type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    };
    export module owl {
        export const Ontology = "http://www.w3.org/2002/07/owl#Ontology";
        export const AnnotationProperty = "http://www.w3.org/2002/07/owl#AnnotationProperty";
        export const ObjectProperty = "http://www.w3.org/2002/07/owl#ObjectProperty";
        export const topObjectProperty = "http://www.w3.org/2002/07/owl#topObjectProperty";
        export const FunctionalProperty = "http://www.w3.org/2002/07/owl#FunctionalProperty";
        export const inverseOf = "http://www.w3.org/2002/07/owl#inverseOf";
        export const DatatypeProperty = "http://www.w3.org/2002/07/owl#DatatypeProperty";
        export const topDataProperty = "http://www.w3.org/2002/07/owl#topDataProperty";
        export const Class = "http://www.w3.org/2002/07/owl#Class";
        export const NamedIndividual = "http://www.w3.org/2002/07/owl#NamedIndividual";
        export const sameAs = "http://www.w3.org/2002/07/owl#sameAs";
    };
    export module dash {
        export const editor = "http://datashapes.org/dash#editor";
        export const TextAreaEditor = "http://datashapes.org/dash#TextAreaEditor";
        export const TextFieldEditor = "http://datashapes.org/dash#TextFieldEditor";
    };
    export module discord {
        export const component = "http://discord.fortitude.cyou/component";
        export const discordId = "http://discord.fortitude.cyou/discordId";
        export const embedDescription = "http://discord.fortitude.cyou/embedDescription";
        export const embedTitle = "http://discord.fortitude.cyou/embedTitle";
    };
    export module dc11 {
        export const description = "http://purl.org/dc/elements/1.1/description";
    };
    export module rdfs {
        export const label = "http://www.w3.org/2000/01/rdf-schema#label";
        export const subPropertyOf = "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";
        export const domain = "http://www.w3.org/2000/01/rdf-schema#domain";
        export const range = "http://www.w3.org/2000/01/rdf-schema#range";
        export const comment = "http://www.w3.org/2000/01/rdf-schema#comment";
        export const subClassOf = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
    };
    export module sh {
        export const datatype = "http://www.w3.org/ns/shacl#datatype";
        export const defaultValue = "http://www.w3.org/ns/shacl#defaultValue";
        export const group = "http://www.w3.org/ns/shacl#group";
        export const minCount = "http://www.w3.org/ns/shacl#minCount";
        export const name = "http://www.w3.org/ns/shacl#name";
        export const order = "http://www.w3.org/ns/shacl#order";
        export const path = "http://www.w3.org/ns/shacl#path";
        export const property = "http://www.w3.org/ns/shacl#property";
        export const NodeShape = "http://www.w3.org/ns/shacl#NodeShape";
    };
    export module xsd {
        export const token = "http://www.w3.org/2001/XMLSchema#token";
        export const boolean = "http://www.w3.org/2001/XMLSchema#boolean";
        export const int = "http://www.w3.org/2001/XMLSchema#int";
        export const integer = "http://www.w3.org/2001/XMLSchema#integer";
        export const string = "http://www.w3.org/2001/XMLSchema#string";
    };
};
export default {
    prefixes,
    iris
};
