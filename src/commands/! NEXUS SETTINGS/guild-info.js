const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("guild-info")
    .setDescription("Get information about a guild")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .addStringOption(option => option.setName("guild-id").setDescription("The id of the server/guild")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    }).setRequired(true)),

    async execute (interaction, client) {
        const {options} = interaction;
        const guildID = options.getString("guild-id");
        const guild = await client.guilds.cache.get(guildID)

        if (!guild) {
            await interaction.reply({
                content: `I cannot find a guild with the id ${guildID}!`,
                ephemeral: true
            })
        }

        const name = guild.name;
        const id = guild.id;
        const ownerId = guild.ownerId;
        const textChannelCount = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size;
        const voiceChannelCount = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size;
        const defaultMessage = guild.defaultMessageNotifications;
        const afkTimeout = guild.afkTimeout;
        const created = guild.createdAt;
        const avatar = guild.iconURL();
        const banner = guild.bannerURL()
        const roleCount = guild.roles.cache.size;
        const channels = guild.channels.cache.size;

        const text =  `Text: ${textChannelCount}`;
        const voice = `Voice: ${voiceChannelCount}`;


        const embed = new EmbedBuilder()
        .setTitle(`Guild Information for ${name}`)
        .setThumbnail(`${avatar}`)
        .addFields(
            {name: "Name:", value: `${name}`},
            {name: "ID:", value: `${id}`},
            {name: "Owner ID:", value: `${ownerId}`},
            {name: "Owner Tag:", value: `<@${ownerId}>`},
            {name: "Channel Count:", value: `\n${text} \n${voice} \n\n TOTAL: ${channels}`},
            {name: "Roles:", value: `${roleCount}`},
            {name: "Default Message Perms:", value: `${defaultMessage}`},
            {name: "AFK Timeout:", value: `${afkTimeout}`},
            {name: "Created At:", value: `${created}`},
            {name: "Avatar:", value: `[Link](${avatar})`}
        )

        if (banner) {
            embed.addFields({
                name: "Banner:",
                value: `[Link](${banner})`
            })

            embed.setImage(`${banner}`)
        }

        const owner = client.users.cache.get(`${guild.ownerId}`);

        if (owner) {
            const ownerEmbed = new EmbedBuilder()
            .setTitle(`Owner Information of ${guild.name}`)
            .setThumbnail(`${owner.displayAvatarURL()}`)
            .addFields(
                {name: "Name:", value: `${owner.username}`},
                {name: "ID:", value: `${owner.id}`},
                {name: "Tag:", value: `${owner}`},
                {name: "Created Account:", value: `${owner.createdAt}`},
            )

            await interaction.reply({
                embeds: [embed, ownerEmbed]
            })

        } else {
            await interaction.reply({
                embeds: [embed]
            })
        }
    }
}