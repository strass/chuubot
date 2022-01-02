
export module prefixes {
    export const owl = "http://www.w3.org/2002/07/owl#";
    export const rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    export const xml = "http://www.w3.org/XML/1998/namespace";
    export const xsd = "http://www.w3.org/2001/XMLSchema#";
    export const rdfs = "http://www.w3.org/2000/01/rdf-schema#";
    export const chuubo = "http://library.fortitude.cyou/";
};

export module iris {
    export module chuubo {
        export const _ = "http://library.fortitude.cyou/";
        export const arc = "http://library.fortitude.cyou/arc";
        export const Character = "http://library.fortitude.cyou/Character";
        export const Arc = "http://library.fortitude.cyou/Arc";
        export const belongsTo = "http://library.fortitude.cyou/belongsTo";
        export const onQuest = "http://library.fortitude.cyou/onQuest";
        export const Quest = "http://library.fortitude.cyou/Quest";
        export const affliction = "http://library.fortitude.cyou/affliction";
        export const arcLevel = "http://library.fortitude.cyou/arcLevel";
        export const arcTitle = "http://library.fortitude.cyou/arcTitle";
        export const bond = "http://library.fortitude.cyou/bond";
        export const completed = "http://library.fortitude.cyou/completed";
        export const majorGoals = "http://library.fortitude.cyou/majorGoals";
        export const questFlavor = "http://library.fortitude.cyou/questFlavor";
        export const skill = "http://library.fortitude.cyou/skill";
        export const xpEarned = "http://library.fortitude.cyou/xpEarned";
        export const xpRequired = "http://library.fortitude.cyou/xpRequired";
        export const Aspect = "http://library.fortitude.cyou/Aspect";
        export const Changes = "http://library.fortitude.cyou/Changes";
        export const Emptiness = "http://library.fortitude.cyou/Emptiness";
        export const Knight = "http://library.fortitude.cyou/Knight";
        export const dex = "http://library.fortitude.cyou/dex";
        export const everspace = "http://library.fortitude.cyou/everspace";
        export const kymme = "http://library.fortitude.cyou/kymme";
    };
    export module rdf {
        export const type = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    };
    export module owl {
        export const Ontology = "http://www.w3.org/2002/07/owl#Ontology";
        export const ObjectProperty = "http://www.w3.org/2002/07/owl#ObjectProperty";
        export const topObjectProperty = "http://www.w3.org/2002/07/owl#topObjectProperty";
        export const FunctionalProperty = "http://www.w3.org/2002/07/owl#FunctionalProperty";
        export const inverseOf = "http://www.w3.org/2002/07/owl#inverseOf";
        export const TransitiveProperty = "http://www.w3.org/2002/07/owl#TransitiveProperty";
        export const DatatypeProperty = "http://www.w3.org/2002/07/owl#DatatypeProperty";
        export const topDataProperty = "http://www.w3.org/2002/07/owl#topDataProperty";
        export const Class = "http://www.w3.org/2002/07/owl#Class";
        export const NamedIndividual = "http://www.w3.org/2002/07/owl#NamedIndividual";
    };
    export module rdfs {
        export const subPropertyOf = "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";
        export const domain = "http://www.w3.org/2000/01/rdf-schema#domain";
        export const range = "http://www.w3.org/2000/01/rdf-schema#range";
    };
    export module xsd {
        export const boolean = "http://www.w3.org/2001/XMLSchema#boolean";
    };
    export module undefined {
        export const int = "\"0\"^^http://www.w3.org/2001/XMLSchema#int";
        export const boolean = "\"false\"^^http://www.w3.org/2001/XMLSchema#boolean";
    };
};
export default {
    prefixes,
    iris
};
