const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const disabled = require("../../Schemas.js/Panel/Systems/warn");


module.exports = {
    data: new SlashCommandBuilder()
    .setName('trollwarn')
    .setDescription('trollwarn a user')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addUserOption(option => option
        .setName('target')
        .setDescription('target for trollwarn')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("reason")
        .setDescription("trollreason")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setRequired(true)),

    async execute (interaction) {
        const errEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setColor("Red")
        .setDescription("Missing Permissions: Kick Members")
        .setTimestamp()

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: "Du kannst diesen Befehl nicht ausführen!", ephemeral: true});

        const { options, guildId, user } = interaction;

        const target = options.getUser('target');
        const reason = options.getString("reason");

        
        const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark: You have been trollwarned in ${interaction.guild.name} | Reason: ${reason}`)

        const embed2 = new EmbedBuilder()
        .setColor("Green")
        .setDescription(` :white_check_mark: ${target.tag} has been trollwarned | Reasons: ${reason} `)

        target.send({ embeds: [embed] }).catch(err => {
            return;
        })

        interaction.reply({ embeds: [embed2], ephemeral: true })
    }
}