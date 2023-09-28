const axios = require("axios");
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, Embed } = require("discord.js");

const ytSchema = require("./src/Schemas.js/Video Notif.js/youtube");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("video-notification")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("This checks if a video has been published")
    .addSubcommand(command => command.setName("add").setDescription("Add a video notifier")
        .addStringOption(option => option
            .setName("type")
            .setDescription("The type of social media Platform")
            .addChoices(
                {name: "YouTube", value: "YouTube"},
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("username")
            .setDescription("The username of the social media user (with @)")
            .setRequired(true)
        )
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel you would like to send the notification")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
        )
        .addStringOption(option => option
            .setName("message")
            .setDescription("Add a custom notification message (use {author}, {platform})")
            .setRequired(false)
        )
    )
    .addSubcommand(command => command.setName("remove").setDescription("Remove a video notifier")
        .addStringOption(option => option
            .setName("type")
            .setDescription("The type of social media platform")
            .addChoices(
                {name: "YouTube", value: "YouTube"},
            )
            .setRequired(true)
        )
    ),
    async execute (interaction, client) {
        const {options, guild} = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case "add":
                const type = options.getString("type");
                const account = options.getString("account");
                const channel = options.getChannel("channel");
                const messageContent = options.getString("message") || `{author} published a new video on ${type}! Check it out!`;

                let message = messageContent.replace("{author}", account).replace("{platform}", type);

                if (type === "YouTube") {
                    const data = await ytSchema.findOne({
                        Guild: guild.id
                    });

                    if (data) {
                        await interaction.reply({
                            content: "You already have a YouTube notifier!",
                            ephemeral: true
                        })
                    } else if (!data) {
                        await ytSchema.create({
                            Account: account,
                            Channel: channel.id,
                            Guild: guild.id,
                            Message: message
                        })

                        const embed = new EmbedBuilder()
                        .setTitle("Video Notif Setup")
                        .setColor("DarkButNotBlack")
                        .addFields(
                            {name: "Type:", value: type, inline: true},
                            {name: "Channel:", value: `${channel}`, inline: true},
                            {name: "Message:", value: message, inline: true},
                            {name: "Account:", value: account, inline: false}
                        )
                        .setTimestamp()

                        return await interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                }
            break;
            case "remove":
                const remType = options.getString("type");

                if (remType === "YouTube") {
                    const data = await ytSchema.findOne({
                        Guild: guild.id
                    });

                    if (!data) {
                        await interaction.reply({
                            content: "Sorry, i cant find a notification system for this server!",
                            ephemeral: true
                        })
                    } else {
                        await ytSchema.deleteMany({
                            Guild: guild.id
                        })

                        await interaction.reply({
                            content: "Notification System has been deleted successful!",
                            ephemeral: true
                        })
                    }
                }
            break;
        }
    }
}