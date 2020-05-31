const botConfig = require('./botconfig.json');
const token = require('./token.json')
const Discord = require('discord.js');
const random = require('random');
const gameDeck = require('./deck')

const Deck = require('./deck.class');
let deck = new Deck;

let bot = new Discord.Client();

let prefix = botConfig.prefix;

let command = (cmd) => {return `${prefix}${cmd}`; }

///

let queue = []
///

let gd = deck.generateDeck(gameDeck);
console.log(gd)

// console.log(deck.generateDeck(deck))


let deal = (cards) => {
    for(p in queue){

    }
}

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
})

bot.on("message", async (message) => {
    let cmd = message.content.split(" ")[0].toLowerCase();
    if(message.channel.type === "dm") return;

    if(cmd == command('queue')){
        let queueEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Queue')
            .setDescription(`${queue.length}/4 In Queue`)
        if(queue.length >= 1){
            queue.forEach((e, i) => {
                queueEmbed.addField(`Player ${i+1}`, e, true)
            });
        }
        let q = queue.length == 0 ? '0/4' : queueEmbed
        message.channel.send(q)
    }

    if(cmd == command('join')){
        queue.includes(message.member.user.tag) ? null : queue.push(message.member.user.tag)
        message.channel.send("You have joined the game queue.")
    }

    if(cmd == command('deal')){
        let deal = deck.deal(gd, queue)
        message.channel.send(deal[0])
    }

})

bot.login(token.token)