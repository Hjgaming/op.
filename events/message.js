const {
    prefix
} = require('../config.json'),
Discord = require('discord.js')

/**
 * 
 * @param {Discord.Message} message 
 * @param {Discord.Client} client 
 * @returns 
 */

module.exports = async (message, client) => {

    if (!message.guild) return;

    if (message.mentions.everyone) {
        sentEveryones.push({
            guild: message.guild.id,
            author: message.author.id,
            channel: message.channel.id,
            timestamp: message.createdTimestamp
        })

        let authorEntries = sentEveryones.filter(c => c.author === message.author.id)
        let filteredEntries = authorEntries.filter(c => c.content === message.content && (c.timestamp > (message.createdTimestamp - threshold)))

        if (filteredEntries >= amount) {
            if (message.member.bannable) message.member.ban({
                days: 7,
                reason: "Spam ping raid"
            }).catch(e => {
                console.log(`Error banning ${message.author.username}`, e)
            })
        }
    }

    if (message.author.bot || !message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).trim().split(/\s+/g)
    let commandName = args.shift().toLowerCase()

    let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) 

    if(!command) return;

    try {
        await command.execute(message, args, client)
    } catch(e) {
        console.log(e)
    }
    
}