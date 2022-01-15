// Require the necessary discord.js classes
import { Client, Collection, CommandInteraction, Intents } from "discord.js";
import fs from "fs";
import invariant from "tiny-invariant";

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
}) as Client<any> & {
  commands: Collection<
    string,
    { execute: (interaction: CommandInteraction) => Promise<void> }
  >;
};

const eventFiles = fs.readdirSync("src/services/Discord/events");

for (const file of eventFiles) {
  const event = (
    await import(`./events/${file.substring(0, file.length - 3)}.js`)
  ).default;
  invariant(event, "Event must export a default function");
  console.log(`Registering event '${event.name}'`);
  if (event?.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
