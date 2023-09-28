const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Say somehting as your bot!')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .setDMPermission(false)
    .addStringOption(option => option.setName('text').setDescription('Specified text will be your message')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(true).setMinLength(1).setMaxLength(2000))
    .addChannelOption(option => option.setName('channel').setDescription('Specified channel will receive your message')
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: `You cannot do that!`, ephemeral: true });
        else {

            let channel = await interaction.options.getChannel('channel') || interaction.channel;

            let message = await interaction.options.getString('text');
            await channel.send({ content: message});
            await interaction.reply({ content: `You message ${message} has been sent in ${channel}`, ephemeral: true });
        }
    }
}