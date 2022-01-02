
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        ONTOLOGY_FILE: string;

        // Discord Bot
        DISCORD_TOKEN: string;
        CLIENT_ID?: string;
        GUILD_ID?: string;
      }
    }
  }
  
  export {}