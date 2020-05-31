const random = require('random')
const config = require('./botconfig.json')
class Deck {
    constructor(){
        this.random = random;
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
        let currentDeck = deck;
        let deltcards = [];
        for(let p in players){
            console.log("p",p)
            let cards = []
            for(let c = 0; c <= config.cardsToDeal; c++){
                console.log("c",c)
                let card = this.random.int(0, currentDeck.length)
                cards.push({player: p, card:currentDeck[card].card, property:currentDeck[card].property})
            }
            deltcards.push({player:p,cards})
            console.log(deltcards)
        }
        return deltcards;
    }
}

module.exports = Deck;