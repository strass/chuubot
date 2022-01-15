import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import invariant from "tiny-invariant";

invariant(process.env.DISCORD_TOKEN, "DISCORD_TOKEN must be set");
invariant(process.env.CLIENT_ID, "CLIENT_ID must be set");
invariant(process.env.GUILD_ID, "GUILD_ID must be set");

const commands: object[] = [];

const commandFiles = fs
  .readdirSync("src/services/Discord/commands")
  .flatMap((fileOrDirectory) => {
    if (fileOrDirectory.endsWith(".ts")) {
      return [["", fileOrDirectory]];
    } else {
      return fs
        .readdirSync(`src/services/Discord/commands/${fileOrDirectory}`)
        .map((fileName) => [fileOrDirectory, fileName]);
    }
  })
  .filter(([, fileName]) => {
    if (fileName.startsWith("_")) return false;
    if (fileName !== "index.ts") return false;
    return true;
  })
  .reduce((commands, [directory, file]) => {
    const prev = commands.get(directory) ?? [];
    commands.set(directory, [...prev, file]);
    return commands;
  }, new Map<string, string[]>());

console.log(commandFiles);

invariant(commandFiles.size > 0, "No commands found");

for (const [dir, files] of commandFiles) {
  for (const fileName of files) {
    const command = (
      await import(
        `./commands/${dir}/${fileName.substring(0, fileName.length - 3)}.js`
      )
    ).default;
    invariant(command, "Command must export a default function");
    invariant(command.data, "Command must have data");
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "9" }).setToken(
  process.env.DISCORD_TOKEN as string
);

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID as string,
      process.env.GUILD_ID as string
    ),
    { body: commands }
  )
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
