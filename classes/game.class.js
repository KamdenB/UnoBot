const deck = require('./deck.class')
const Discord = require('discord.js')

class game {
    constructor(client){
        this.discord = client;
        this.deck = new deck;
        this.client = client;
    }
    start(deck, players, index=0, direction=1, first=true, delt=null){
        if(first){
            this.delt = this.deck.deal(deck, players);
            players.forEach((p) => {
                this.client.users.cache.get(p.author.id).send("Game started!")
            })
        }
        
        let currentPlayer = this.client.users.cache.get(players[index].author.id);
        let everyoneElse = players.filter((p) => p.author.id != currentPlayer)
        let cardOptions = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Choose your card")
        let playerCards = this.delt.deltcards.filter((c => c.player == currentPlayer))[0]
        
        playerCards.forEach((cc) => {
            cardOptions.addField(i+1, `${cc.card} ${cc.property}`, true)
        })

        currentPlayer.send(cardOptions).then(() => {
            const filter = m => players[index].author.id === m.author.id;
            currentPlayer.dmChannel.awaitMessages(filter, {time: 60000, max: 1, errors: ['time']})
                .then(messages => {
                    currentPlayer.send(`Played ${messages.first().content}`)
                    everyoneElse.forEach((e) => {
                        if(messages.first().content.includes("skip")){
                            direction = -1;
                        }
                        this.client.users.cache.get(e.author.id).send(`${players[index].author.username} played ${messages.first().content}`)
                    })
                })
                .catch((e) => {
                    currentPlayer.send('Time expired. Automatically played x card');
                    this.client.users.cache.get(e.author.id).send(`${players[index].author.username} played x`)
                })
                .finally(() => {
                    index = index+1 >= players.length ? 0 : index+direction // Increment to next player, or move to first player
                    this.start(deck, players, index, direction, false)
                })
        })
    }
}

module.exports = game;