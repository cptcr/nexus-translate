const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Schema = require("../../Schemas.js/autoreply");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("autoreply-setup")
    .setDescription("Setup the autoreply in your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addStringOption(option => option
        .setName("keyword")
        .setDescription("the keyword for the reply")
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
        .setName("reply")
        .setDescription("The reply")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const embed = new EmbedBuilder();

        const {options, guild} = interaction;
        const g = guild.id;
        const keyword = options.getString("keyword");
        const reply = options.getString("reply");

        const data = await Schema.findOne({ Guild: g, Keyword: keyword });

        if (data) {
            embed.setDescription(`There is already a reply for **${keyword}**! | Reply: **${data.Reply}**`).setColor("Red")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } else {
            embed.setTitle("Keyword Setup").addFields({ name: "Keyword:", value: `${keyword}`, inline: false}).addFields({ name: "Reply:", value: `${reply}`, inline: false}).setColor("White")

            await Schema.create({
                Guild: g,
                Keyword: keyword,
                Reply: reply,
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}