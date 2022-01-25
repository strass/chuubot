import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { commands, options } from "../_namespaces.js";
import buttonManageWill from "./interactions/will/index.js";
import buttonGetQuests from "./interactions/quests/index.js";
import selectSetWill from "./interactions/will/set.js";
import getCharacter from "./get.js";

export default {
  name: commands.character.$,
  data: new SlashCommandBuilder()
    .setName(commands.character.$)
    .setDescription("Character related commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(commands.character.get)
        .setDescription("Looks up an Chuubos Character.")
        .addStringOption((option) =>
          option
            .setName(options.character.get.subject)
            .setDescription("ID of item to get")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    if (interaction.options.getSubcommand() === commands.character.get) {
      return getCharacter(interaction);
    } else {
      interaction.reply({ ephemeral: true, content: "Invalid command" });
    }
  },
  buttons: [buttonManageWill, selectSetWill, buttonGetQuests],
} as const;
