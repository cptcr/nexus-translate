const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../Schemas.js/loggingSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("command-logging")
    .setDMPermission(true)
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .setDescription("enable/disable command logging for you")
    .addSubcommand(command => command
        .setName("enable")
        .setDescription("Enable, to help us making this bot better")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
    )
    .addSubcommand(command => command
        .setName("disable")
        .setDescription("Disable if you dont want to share command data")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
    ),
    async execute (interaction) {
        const {user, options} = interaction;
        const sub = options.getSubcommand();
        const data = await Schema.findOne({ User: user.id });

        switch (sub) {
            case "disable":
                if (data) {
                    await interaction.reply({
                        content: "<:pepeDumb:1121382044119867463> You already have disabled command logging",
                        ephemeral: true
                    })
                } else {
                    await Schema.create({ User: user.id });

                    await interaction.reply({
                        content: "Command logging has been disabled!",
                        ephemeral: true
                    })
                }
            break;
            case "enable":
                if (!data) {
                    await interaction.reply({
                        content: "<:pepeDumb:1121382044119867463> You already have enabled command logging",
                        ephemeral: true
                    })
                } else {
                    await Schema.deleteMany({ User: user.id });

                    await interaction.reply({
                        content: "Command logging has been enabled!",
                        ephemeral: true
                    })
                }
            break;
        }
    }
}