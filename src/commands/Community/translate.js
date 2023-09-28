// remember to do npm i @imatraction/google-translate

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require("@iamtraction/google-translate");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translator')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addSubcommand(command => command.setName('text').setDescription('This will translate text for you')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addStringOption(option => option.setName('message').setDescription('What do you want to translate?')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(true))
    .addStringOption(option => option.setName('language').setDescription('What language do you want to translate to?')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).addChoices(
        { name: "• English", value: "en" },
        { name: "• Latin", value: "la" },
        { name: "• French", value: "fr" },
        { name: "• German", value: "de" },
        { name: "• Italian", value: "it" },
        { name: "• Portuguese", value: "pt" },
        { name: "• Spanish", value: "es" },
        { name: "• Greek", value: "el" },
        { name: "• Russian", value: "ru" },
        { name: "• Japanese", value: "ja" },
        { name: "• Arabic", value: "ar" }
    ).setRequired(true))),
    async execute (interaction) {
        const sub = interaction.options.getSubcommand();
        switch (sub) {
            case 'text':
                const text = interaction.options.getString(`message`);
                const lan = interaction.options.getString(`language`);
                
                const translated = await translate(text, { to: `${lan}` });

                const embed = new EmbedBuilder()
                .setTitle(`Translate Successful`)
                .setColor('#FCC01E')
                .addFields({ name: `Old Text: `, value: `\`\`\` ${text}\`\`\``, inline: false })
                .addFields({ name: `Translated Text: `, value: `\`\`\` ${translated.text}\`\`\``, inline: false })

                await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}