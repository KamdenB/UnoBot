const deck = require('./deck.class')

class game {
    constructor(client){
        this.discord = client;
        this.deck = new deck;
        this.client = client;
    }
    start(deck, players, index=0, direction=1, first=true){
        if(first){
            players.forEach((p) => {
                this.client.users.cache.get(p.author.id).send("Game started!")
            })
        }
        let currentPlayer = this.client.users.cache.get(players[index].author.id);
        let everyoneElse = players.filter((p) => p.author.id != currentPlayer)
        currentPlayer.send('Please choose a card').then(() => {
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
                .catch(() => {
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