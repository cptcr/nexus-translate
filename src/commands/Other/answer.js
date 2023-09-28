const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("answer")
    .setDescription("Answer to a message")
    .setDescriptionLocalizations({
        "de": "", //german
        "nl": "", //dutch
        "hu": "", //hungarian
        "ru": "", //russian
        "pl": "", //polish
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => option
        .setName("message-id")
        .setDescription("the message id")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("text")
        .setDescription("your text")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setRequired(true)
    )
    .addBooleanOption(option => option
        .setName("embed")
        .setDescription("embed true or false?")
        .setDescriptionLocalizations({
            "de": "", //german
            "nl": "", //dutch
            "hu": "", //hungarian
            "ru": "", //russian
            "pl": "", //polish
        })
        .setRequired(true)
    ),

    async execute (interaction, client) {
        const msgid = interaction.options.getString("message-id");
        const content = interaction.options.getString("text");
        const boolean = interaction.options.getBoolean("embed")

        const embed1 = new EmbedBuilder()
        .setDescription(`${content}`)


        if (msgid.startsWith("http")) {
            return await interaction.reply({
               content: "You can only use the message id, to get the message id enable the discord developer mode!",
               ephemeral: true
            })
        }

        await interaction.reply({
            content: `Answered to https://ptb.discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${msgid} \n | Content: ${content} \n | Embed: ${boolean}`,
            ephemeral: true
        })

        if (boolean) {
            await  client.channels.cache.get(interaction.channel.id).messages.fetch(msgid).then(message => message.reply({embeds: [embed1]}))
        } else {  
            await  client.channels.cache.get(interaction.channel.id).messages.fetch(msgid).then(message => message.reply({content: `${content}`}))
        }
    }
}