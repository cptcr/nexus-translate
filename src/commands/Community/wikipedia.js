const wiki = require("wikijs");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('search something on wikipedia')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addStringOption(option => option.setName('search').setDescription('the thing you want to search on wiki')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(true)),
    async execute (interaction) {
 
        const query = interaction.options.getString('search')
 
        await interaction.deferReply();
 
        const search = await wiki.search(query);
        if (!search.results.length) return await interaction.editReply({ content: `Wikipedia doesn't seem to know what your searching for....`, ephemeral: true});
 
        const result = await wiki.page(search.results[0]);
 
        const summary = await result.summary();
        if (summary.length > 8192) return await interaction.reply({ content: `${summary.slice(0, 2048)}`, ephemeral: true});
        else {
            const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`Wiki Search: ${result.raw.title}`)
            .setDescription(`\`\`\`${summary.slice(0, 2048)}\`\`\``)
 
            await interaction.editReply({ embeds: [embed] });
        }
    }
}