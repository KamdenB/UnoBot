const deck = require('./deck.class')
const Discord = require('discord.js')

class game {
    constructor(client){
        this.deck = new deck;
        this.client = client;
    }
    start(deck, players, index=0, discardDeck=[], first=true, delt=null){
        if(first){
            this.delt = this.deck.deal(deck, players);
            players.forEach((p) => {
                this.client.users.cache.get(p.author.id).send("Game started!")
            })
            players.forEach((p) => {
                let delt = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("You've been delt")
                let playerCards = this.delt.deltcards.filter((c => {return c.player == p.author.id}))[0]
                // console.log(playerCards)
                playerCards.cards.forEach((cc, i) => {
                    delt.addField(`(${i+1})`, `${cc.card} ${cc.property}`, true)
                })
                this.client.users.cache.get(p.author.id).send(delt)
            })
            let firstDraw = this.deck.adminDraw(deck);
            discardDeck.push(firstDraw);
            players.forEach(p => {
                this.client.users.cache.get(p.author.id).send(`First card played: ${firstDraw.card} ${firstDraw.property}`)
            })
        }
        var currentPlayer = this.client.users.cache.get(players[index].author.id);
        var everyoneElse = players.filter((p) => p.author.id != currentPlayer)
        var currentCards = this.delt.deltcards.filter(c => {return c.player == players[index].author.id})[0].cards;
        

        // if(first){
        // }

        // let query = {
        //     card: discardDeck[discardDeck.length-1].card,
        //     property: discardDeck[discardDeck.length-1].property
        // }

        // let search = (card) => {
        //     return Object.keys(this).every((key) => card[key] === this[key])
        // }

        // let availableCards = currentCards.filter(search, query)

        let availableCards = currentCards.filter(x => x.card == discardDeck[discardDeck.length-1].card || x.property == discardDeck[discardDeck.length-1].property)

        // console.log(discardDeck[discardDeck.length-1])
        // console.log(availableCards)

        if(availableCards.length > 0){
            let available = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Your turn. Available Cards")
            .setDescription("These cards are available to be played based off the last played card")
            availableCards.forEach((cc, i) => {
                available.addField(`(${i+1})`, `${cc.card} ${cc.property}`, true)
            })
            currentPlayer.send(available).then(() => {
                const filter = m => players[index].author.id === m.author.id;
                currentPlayer.dmChannel.awaitMessages(filter, {time: 60000, max: 1, errors: ['time']})
                    .then(messages => {

                        discardDeck.push(availableCards[messages.first().content-1]);

                        players.forEach(p => {
                            console.log(`Player played: ${availableCards[messages.first().content].card} ${availableCards[messages.first().content].property}`)
                            this.client.users.cache.get(p.author.id).send(`${players[index].author.username} played: ${availableCards[messages.first().content].card} ${availableCards[messages.first().content].property}`)
                        })
                        
                    })
                    .catch((e) => {
                        console.log(e)
                        // currentPlayer.send('Time expired. Automatically played x card');
                        // this.client.users.cache.get(e.author.id).send(`${players[index].author.username} played x`)
                    })
                    .finally(collected => {
                        // console.log(collected)
                        // console.log(`Player played: ${availableCards[collected.first().content].card} ${availableCards[collected.first().content].property}`)
                        index = index+1 >= players.length ? 0 : index+1 // Increment to next player, or move to first player
                        this.start(deck, players, index, discardDeck, false)
                    })
            })
        } else {
            currentPlayer.send("Unable to play").finally(() => {
                let c = this.deck.adminDraw(deck);
                discardDeck.push(c)
                players.forEach(p => this.client.users.cache.get(p.author.id).send(`Admin drew: ${c.card} ${c.property}`))
                index = index+1 >= players.length ? 0 : index+1
                this.start(deck, players, index, discardDeck, false)
            })
        }

    }
}

module.exports = game;