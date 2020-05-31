const random = require('random')
const config = require('./botconfig.json')
const sift = require('sift')
const discord = require('discord.js')
var bot = new discord.Client();
class Deck {
    constructor(){
        this.bot = bot;
    }
    generateDeck(gd){
        let gameDeck = [];
        for(let c in gd.colors) {
            for(let n in gd.numbers){
                gameDeck.push({card:gd.colors[c], property:gd.numbers[n]})
            }
            for(let a in gd.attack){
                gameDeck.push({card: gd.colors[c], property:gd.attack[a]})
            }
        }
        for(let w in gd.wilds.cards){
            for(let i = 0; i < gd.wilds.max; i++){
                gameDeck.push({card: gd.wilds.cards[w], property:gd.wilds.cards[w]})
            }
        }
        return gameDeck;
    }
    deal(deck, players){
        let deltcards = [];
        players.forEach((p, i) => {
            var pCards = [];
            for(let c = 0; c < config.cardsToDeal; c++){
                let rnd = random.int(0, deck.length);
                pCards.push({
                    player: p,
                    card: deck[rnd].card,
                    property: deck[rnd].property
                })
                deck.splice(rnd, 1)
            }
            deltcards.push({player:p, cards:pCards})
        })
        return {deltcards, deck};
    }
}

module.exports = Deck;