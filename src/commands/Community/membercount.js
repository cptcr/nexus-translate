const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("membercount")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }),
    
    async execute(interaction) {

        const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("membercount")
        .addFields({ name: "Members:", value: `${interaction.guild.memberCount}`})
        return await interaction.reply({embeds: [embed]})
    }
}

