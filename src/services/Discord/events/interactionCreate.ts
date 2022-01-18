import { Collection, Interaction } from "discord.js";
import invariant from "tiny-invariant";
import { getCommandFiles } from "../deploy.js";

const commands = new Collection<string, Function>();
const buttons = new Collection<string, Function>();
const commandFiles = getCommandFiles();

for (const [dir, files] of commandFiles) {
  for (const fileName of files) {
    const command = (
      await import(
        `../commands/${dir}/${fileName.substring(0, fileName.length - 3)}.js`
      )
    ).default;
    invariant(command, "Command must export a default function");
    invariant(command.data, "Command must have data");

    commands.set(command.data.name, command.execute);
    for (const button of command?.buttons ?? []) {
      console.log(`Registering button ${button.name}`);
      buttons.set(button.name, button);
    }
  }
}

export default {
  name: "interactionCreate",
  execute(interaction: Interaction) {
    if (interaction.isApplicationCommand()) {
      const command = commands.get(interaction.commandName);
      invariant(command, "Command must exist");
      command(interaction);
    } else if (interaction.isMessageComponent()) {
      const [commandName] = interaction.customId.split("|");
      const command = buttons.get(commandName);
      invariant(command, "Command must exist");
      command(interaction);
    } else {
      console.warn("Unknown interaction type.");
    }
  },
} as const;
