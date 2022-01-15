export module commands {
  export module quest {
    export const $ = "quest";
    export const get = "get";
    export const create = "create";
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
}

export module interactions {
  export module button {
    export module quest {
      export const addXp = "interactions.buttons.quest.addXp";
    }
  }
}
