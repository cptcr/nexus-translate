const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('dictionary')
    .setDescription('search a word in the dictionary')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addStringOption(option => option.setName('word').setDescription('the word you want to search')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(true)),
    async execute(interaction) {
 
        const word = interaction.options.getString('word');
 
        let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
 
        if (data.statusText == 'Not Found') {
            return interaction.reply({ content: 'that word does not exist', ephemeral: true});
        }
 
        let info = await data.json();
        let result = info[0];
 
      let embedInfo = await result.meanings.map((data, index) => {
 
            let definition = data.definitions[0].definition || "No definition found";
            let example = data.definitions[0].example || "No example found";
 
 
            return {
                name: data.partOfSpeech.toUpperCase(),
                value: `\`\`\` Description: ${definition} \n Example: ${example} \`\`\``,
            };
 
 
        });
 
        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(`Definition of | **${result.word}**`)
        .addFields(embedInfo)
 
        await interaction.reply({ embeds: [embed] });
    }
}