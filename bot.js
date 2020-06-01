const botConfig = require('./botconfig.json');
const token = require('./token.json')
const Discord = require('discord.js');
const random = require('random');
const gameDeck = require('./deck')

/* Custom classes*/
const Deck = require('./deck.class');

let bot = new Discord.Client();
let deck = new Deck;

/* Bot settings, etc */
let prefix = botConfig.prefix;
let currentGames;

/* Format command */
let command = (cmd) => {return `${prefix}${cmd}`; }

/* Temporary Until Mongo is setup*/
let queue = [];
let gd = deck.generateDeck(gameDeck);
/***/

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
})

bot.on("message", async (message) => {
    let cmd = message.content.split(" ")[0].toLowerCase();

    if(cmd == command('queue')){
        let queueEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Queue')
            .setDescription(`${queue.length}/4 In Queue`)
        if(queue.length >= 1){
            queue.forEach((q, i) => {
                queueEmbed.addField(`Player ${i+1}`, q.name, true)
            });
        }
        message.channel.send(queue.length == 0 ? '0/4' : queueEmbed)
    }

    /* Join game queue */
    if(cmd == command('join')){
        queue.includes(message.member.user.tag) ? null : queue.push({id:message.member.user.id, name:message.member.user.username})
        message.channel.send("You have joined the game queue.")
    }

    /* Draw card from deck */
    if(cmd == command('draw')){
        if(message.channel.type === "dm"){
            let draw = deck.draw(gd, message.author.tag)
            message.channel.send(`${draw.card} ${draw.property} ${draw.player}`)
        } else {
            message.channel.send("This command can only be used during the game!");
        }
    }

    /* Deal cards to all players. This will automatically happen once all players are "ready" */
    if(cmd == command('deal')){
        console.log(gd)
        let deal = deck.deal(gd, queue)
        gd = deal.deck;
        deal.deltcards.forEach((p) => {
            bot.users.fetch(p.player).then(player => {
                player.send("You've been delt: ")
                p.cards.forEach(c => {
                    player.send(`${c.c} ${c.property}`)
                })
            })
        })
        message.channel.send("Players have been delt")
    }
})

bot.login(token.token)