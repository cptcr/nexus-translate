const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('web-screenshot')
    .setDescription("Take a screenshot of a website")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addStringOption(option => option.setName('website').setDescription("The website to take a screenshot of")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(true)),

    async execute (interaction) {

        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const website = options.getString('website');

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(website);
            await page.setViewport({ width: 1920, height: 1080 });

            const screenshot = await page.screenshot();
            await browser.close();

            const buffer = Buffer.from(screenshot, 'base64');
            const attachment = new AttachmentBuilder(buffer, { name: "image.png"})

            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setImage('attachment://image.png')

            await interaction.editReply({ embeds: [embed], files: [attachment] })
        } catch (e) {
            console.log(e)
            await interaction.editReply({ content: "⚠️ There was an error getting that screenshot- try again with a valid website!"})
        }
    }
}