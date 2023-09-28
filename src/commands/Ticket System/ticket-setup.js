const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../../Schemas.js/ticketSchema');
const disabled = require("../../Schemas.js/Panel/Systems/ticket");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Sets up the ticket system for the server.')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .addChannelOption(option => option.setName('channel')
        .setDescription('The channel to send the ticket panel to')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        }).setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option => option.setName('category')
        .setDescription('The category to create the ticket channels in')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        }).setRequired(true).addChannelTypes(ChannelType.GuildCategory))
        .addRoleOption(option => option.setName('role')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        }).setDescription('The role to ping when a ticket is created').setRequired(true))
        .addChannelOption(option => option.setName('ticket-logs')
        .setDescription('The channel for the transcripts to be sent to')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        }).setRequired(true))
        .addStringOption(option => option.setName('description')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setDescription('The description for the ticket system').setRequired(true).setMinLength(1).setMaxLength(1000))
        .addStringOption(option => option.setName('color')
        .setDescription('The color for the ticket panel')
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .addChoices(
            { name: 'Red', value: 'Red' },
            { name: 'Blue', value: 'Blue' },
            { name: 'Green', value: 'Green' },
            { name: 'Yellow', value: 'Yellow' },
            { name: 'Purple', value: 'Purple' },
            { name: 'Pink', value: 'DarkVividPink' },
            { name: 'Orange', value: 'Orange' },
            { name: 'Black', value: 'NotQuiteBlack' },
            { name: 'White', value: 'White' },
            { name: 'Gray', value: 'Gray' },
            { name: 'Dark Blue', value: 'DarkBlue' },
            { name: 'Dark Red', value: 'DarkRed' },
        ).setRequired(true)),


    async execute(interaction, client) {
        try {
        const { options, guild } = interaction;
        const color = options.getString('color');
        const msg = options.getString('description');
        const thumbnail = interaction.guild.iconURL();
        const GuildID = interaction.guild.id;
        const panel = options.getChannel('channel');
        const category = options.getChannel('category');
        const role = options.getRole('role');
        const logs = options.getChannel('ticket-logs');

        const DISABLED = await disabled.findOne({ Guild: guild.id});

        if (DISABLED) {
            await interaction.reply({
                content: "❌ Command has been disabled in this server!",
                ephemeral: true
            })
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        }

        const data = await ticketSchema.findOne({ GuildID: GuildID });
        if (data) return await interaction.reply({ content: `You **already** have a ticket system set up in this server!`, ephemeral: true});

        else {
            await ticketSchema.create({
                GuildID: GuildID,
                Channel: panel.id,
                Category: category.id,
                Role: role.id,
                Logs: logs.id,
            })

            const embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTimestamp()
            .setTitle('> <:ticket:1135254113219784734> Ticket Panel')
            .setAuthor({ name: `<:ticket:1135254113219784734> Ticket System`})
            .setFooter({ text: `<:ticket:1135254113219784734> Ticket Panel Setup`})
            .setDescription(`> ${msg} `)

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel('<:ticket:1135254113219784734> Create Ticket')
                .setStyle(ButtonStyle.Primary)
            )

            const channel = client.channels.cache.get(panel.id);
            await channel.send({ embeds: [embed], components: [button] });

            await interaction.reply({ content: `The ticket panel has been sent to ${channel}`, ephemeral: true });
        }
    } catch (err) {
        return;
    }
}
}