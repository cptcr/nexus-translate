const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clear a channels messages")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => option
        .setName("amount")
        .setDescription("The amount of messages")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel you want to clear the message")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setRequired(false)
    ),

    async execute (interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;
        const amount = interaction.options.getInteger("amount");

        try {
        await channel.bulkDelete(amount).catch(err => {
            return;
        });

        const embed = new EmbedBuilder()
        .setTitle("Clear")
        .setDescription(`I deleted **${amount} message(s)** in ${channel}!`)
        .setColor("Red")

        const embed2 = new EmbedBuilder()
        .setDescription(`**${amount} Message(s)** have been deleted`)
        .setColor("Red")

        await channel.send({
            embeds: [embed2]
        }).then(msg => { setTimeout(() => {msg.delete().catch(err => {
            return;
        });}, 10000)}).catch(err => {
            return;
        });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        }).then(msg => { setTimeout(() => {msg.delete().catch(err => {
            return;
        });}, 10000)}).catch(err => {
            return;
        });
      } catch (error) {
        await interaction.reply("There was an error cleaning this channel!").then(msg => { setTimeout(() => {msg.delete()}, 10000)});
      }
    }
}