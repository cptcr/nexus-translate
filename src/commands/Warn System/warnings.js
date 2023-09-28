const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../Schemas.js/warnSchema");
const disabled = require("../../Schemas.js/Panel/Systems/warn");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('This gets a members warnings')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addUserOption(option => option.setName("user")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setDescription("The member you want to check the warns of").setRequired(true)),
    async execute(interaction) {

        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        const { options, guild, user } = interaction;

        const target = options.getUser("user");

        const embed = new EmbedBuilder()

        const data = await warningSchema.findOne({ GuildID: guild.id, UserID: target.id });

        if (data && data.Content.length > 0) {
            embed.setDescription(`:white_check_mark: ${target.tag}'s warnings: \n${data.Content.map(
                (w, i) =>
                    `
                    **Warning**: ${i + 1}
                    **Warning Moderator**: ${w.ExecuterTag}
                    **Warn Reason**: ${w.Reason}
                    **Warn ID**: ${w.warnID}
                    `
            ).join(`-`)}`);
        } else {
            embed.setDescription(`:white_check_mark: ${target.tag} has **0** warnings!`);
        }

        interaction.reply({ embeds: [embed] });
    }
}