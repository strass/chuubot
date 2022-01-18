import character from "./character";

export module commands {
  export module quest {
    export const $ = "quest";
    export const get = "get";
    export const create = "create";
  }
  export module character {
    export const $ = "character";
    export const get = "get";
  }
}

export module options {
  export module quest {
    export module get {
      export const subject = "subject";
    }
    export module create {
      export const name = "name";
    }
  }
  export module character {
    export module get {
      export const subject = "subject";
    }
  }
}

export module interactions {
  export module button {
    export module quest {
      export const addXp = "interactions.buttons.quest.addXp";
    }
    export module character {
      export module will {
        export const $ = "interactions.buttons.character.will";
      }
    }
  }
  export module select {
    export module character {
      export module will {
        export const set = "interactions.select.will.set";
      }
    }
  }
}
