
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATA_FOLDER: string;

        // Discord Bot
        DISCORD_TOKEN: string;
        CLIENT_ID?: string;
        GUILD_ID?: string;
      }
    }
  }
  
  export {}