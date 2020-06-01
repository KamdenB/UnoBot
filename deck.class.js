const random = require('random')
const config = require('./botconfig.json')
const sift = require('sift')
const discord = require('discord.js')

class Deck {

    /* Generates game deck based off the deck definitions from deck.js */
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
                gameDeck.push({card: "wild", property:gd.wilds.cards[w]})
            }
        }
        return gameDeck;
    }

    /* Draw a random card from the deck */
    draw(deck, player){
        let rnd = random.int(0, deck.length);
        return { card:deck[rnd].card, property: deck[rnd].property, player} 
    }

    /* Deals 7 cards / config amount of cards to all players */
    deal(deck, players){
        let deltcards = [];
        players.forEach(p => {
            var pCards = [];
            for(let c = 0; c < config.cardsToDeal; c++){
                let rnd = random.int(0, deck.length);
                pCards.push({
                    player: p.name,
                    c: deck[rnd].card,
                    property: deck[rnd].property
                })
                deck.splice(rnd, 1)
            }
            deltcards.push({player:p.id, cards:pCards})
        })
        return {deltcards, deck};
    }

}

module.exports = Deck;