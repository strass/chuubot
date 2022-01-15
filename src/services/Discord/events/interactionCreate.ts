import { Collection, Interaction } from "discord.js";
import fs from "fs";
import invariant from "tiny-invariant";

const commands = new Collection<string, Function>();
const buttons = new Collection<string, Function>();
const commandFiles = fs.readdirSync("src/services/Discord/commands");

for (const file of commandFiles) {
  const command = (
    await import(`../commands/${file.substring(0, file.length - 3)}.js`)
  ).default;
  commands.set(command.data.name, command.execute);
  buttons.set(command.data.name, command.button);
}

export default {
  name: "interactionCreate",
  execute(interaction: Interaction) {
    if (interaction.isApplicationCommand()) {
      const command = commands.get(interaction.commandName);
      invariant(command, "Command must exist");
      command(interaction);
    } else if (interaction.isButton()) {
      const [commandName] = interaction.customId.split("|");
      const command = buttons.get(commandName);
      invariant(command, "Command must exist");
      command(interaction);
    } else {
      console.warn("Unknown interaction type.");
    }
  },
} as const;
