const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require('axios');
const { execute } = require('../../events/interactionCreate');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('enlarge')
    .setDescription('make an emoji bigger')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addStringOption(option => option.setName('emoji').setDescription('emoji you want to make bigger')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(true)),
    async execute(interaction) {
 
        let emoji = interaction.options.getString('emoji')?.trim();
 
        if (emoji.startsWith('<') && emoji.endsWith('>')) {
 
            const id = emoji.match(/\d{15,}/g)[0];
 
            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }
 
        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: 'You cann enlarge default emojis', ephemeral: true})
        }
 
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: 'You cann enlarge default emojis', ephemeral: true})
        }
 
        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription('<a:blue_check:1068909665603289198>  **Your emoji has been enlarged!**')
        .setImage(emoji)
        .setTimestamp()
        .setFooter({ text: 'Emoji Enlarged', iconURL: interaction.user.displayAvatarURL()})
 
        await interaction.reply({ embeds: [embed] })
    }
}