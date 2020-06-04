const botConfig = require('./botconfig.json');
const token = require('./token.json')
const Discord = require('discord.js');
const random = require('random');
const gameDeck = require('./deck.template')
const mg = require('./mongoose.db')

/* Custom classes*/
const deckClass = require('./classes/deck.class');
const gameClass = require('./classes/game.class')

/* MongoDB Schema */
const queueSchema = require("./schematics/queue.schema");

let client = new Discord.Client({fetchAllMembers: true});
let deck = new deckClass;
let game = new gameClass(client);

/* Bot settings, etc */
let prefix = botConfig.prefix;
let currentGames;

/* Format command */
let command = (cmd) => {return `${prefix}${cmd}`; }

/* Temporary Until Mongo is setup*/
// let queue = [];
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
    let args = message.content.slice(prefix.length).split(' ')

    if(message.channel.type == "dm") return;

    if(cmd == command('queue')){
        queueSchema.find({server:message.guild.id.toString()}, 'username', (err, res) => {
            let queueEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Queue')
            .setDescription(`${res.length}/4 In Queue`)
            if(res.length >= 1){
                res.forEach((q, i) => {
                    queueEmbed.addField(`Player ${i+1}`, res[i].username, true)
                });
            }
            message.channel.send(res.length == 0 ? '0/4' : queueEmbed)
        })
    }

    /* Join game queue */
    if(cmd == command('join')){
        queueSchema.find({server:message.guild.id.toString()}, 'username', (err, res) => {
            res = res.filter(x => x.username == message.author.username);
            if(res.length > 0){
                message.channel.send("You are already in queue!") 
            } else {
                new queueSchema(
                    {
                        server:message.guild.id, 
                        serverName: message.guild.name,
                        username:message.author.username, 
                        id:message.member.id,
                        ready: false
                    }
                )
                .save()
                .then(() => {
                    message.channel.send(`You have joined the queue ${message.author.username}`)
                })
            }
        })
        return;
    }

    if(cmd == command('start')){
        game.start(gd, queue.filter(x => x.server == message.guild.id));
        return;
    }

    if(cmd == command('ready')){
        queueSchema.find({username:message.author.username, server:message.guild.id}, (err, res) => {
            if(res.length > 0){
                queueSchema.findByIdAndUpdate(res[0])
                .then((q) => {
                    q.ready = !q.ready
                    q.save()
                    .then(() => message.channel.send(`You are ${!q.ready ? 'no longer' : 'now'} ready!`))
                    .catch(e => console.log(e))
                })
            } else {
                message.channel.send("You must be in queue")
            }
        })
    }

    if(cmd == command('random')){
        for(let i = 0; i < botConfig.cardsToDeal; i++){
            message.channel.send(Math.floor(Math.random() * 100))
        }
    }

    if(message.author.id == "348459284645937153"){
        if(cmd == command('stats')){
            return message.channel.send(`Server count: ${client.guilds.cache.size}`)
        }
        if(cmd == command('queues')){
            queueSchema.find().then(queues => {
                queues = [...new Map(queues.map(q => [q.server, q]).values())]
                let queuesEmbed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("All active queues")
                queuesEmbed.setDescription(`${queues.length} Active queues`)
                queues.forEach((s, i) => {
                    console.log(queues[i][1])
                    queuesEmbed.addField(`${i+1}`, `${s[1].serverName}`)
                })
                if(args.length < 2) return message.channel.send(queuesEmbed)
                console.log(args.length)
                if(args.length == 2){
                    queueSchema.find({server: queues[parseInt(args[1]-1)][1].server}, (err, res) => {
                        let queueInfo = new Discord.MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle(`${queues[parseInt(args[1])-1][1].serverName}`)
                        res.forEach((x,i) => {
                            queueInfo.addField(`Player ${i+1}`, x.username)
                        })
                        message.channel.send(queueInfo)
                    })   
                }
            })
        }
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