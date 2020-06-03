const botConfig = require('./botconfig.json');
const token = require('./token.json')
const Discord = require('discord.js');
const random = require('random');
const gameDeck = require('./deck.template')
const mg = require('./mongoose.db')

/* Custom classes*/
const deckClass = require('./classes/deck.class');
const gameClass = require('./classes/game.class')

let client = new Discord.Client({fetchAllMembers: true});
let deck = new deckClass;
let game = new gameClass(client);

/* Bot settings, etc */
let prefix = botConfig.prefix;
let currentGames;

/* Format command */
let command = (cmd) => {return `${prefix}${cmd}`; }

/* Temporary Until Mongo is setup*/
let queue = [];
let gd = deck.generateDeck(gameDeck);
/***/

/* MongoDB */
mg.on('error', console.error.bind(console, 'connection error'))
mg.once('open', () => {
    console.log('MongoDB database connection established successfully')
})


/* DISCORD */
client.on("ready", async () => {
    console.log(`${client.user.username} is online!`);
})

client.on("message", async (message) => {
    let cmd = message.content.split(" ")[0].toLowerCase();

    if(message.channel.type == "dm"){
        // await message.channel.send("WHAT");
        return;
    }

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
        if(queue.length <= 4){
            queue.includes(message.member.user.id) ? null : queue.push({author: message.author})
            message.channel.send("You have joined the game queue.")
        } else {
            game.start(gd, queue)
        }
        return;
    }

    if(cmd == command('start')){
        game.start(gd, queue);
        
        return;
    }

    /* Draw card from deck */
    if(cmd == command('draw')){
        if(message.channel.type === "dm"){
            let draw = deck.draw(gd, message.author.tag)
            client.users.cache.get('id').username.send('Test')
            message.channel.send(`${draw.card} ${draw.property} ${draw.player}`)
        } else {
            message.channel.send("This command can only be used during the game!");
        }
        return;
    }

    /* Deal cards to all players. This will automatically happen once all players are "ready" */
    if(cmd == command('deal')){
        console.log(gd)
        let deal = deck.deal(gd, queue)
        gd = deal.deck;
        deal.deltcards.forEach((p) => {
            client.users.fetch(p.player).then(player => {
                player.send("You've been delt: ")
                p.cards.forEach(c => {
                    player.send(`${c.c} ${c.property}`)
                })
            })
        })
        message.channel.send("Players have been delt")
        return;
    }
    return;
})

client.login(token.token)