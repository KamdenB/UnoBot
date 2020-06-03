const random = require('random')
const config = require('../botconfig.json')
const deckTemplate = require('../deck.template')

class Deck {
    /* Generates game deck based off the deck definitions from deck.js */
    generateDeck(){
        let gd = deckTemplate;
        let gameDeck = [];
        let id = 0;
        for(let c in gd.colors) {
            for(let n in gd.numbers){
                gameDeck.push({card:gd.colors[c], property:gd.numbers[n], id:id++})
            }
            for(let a in gd.attack){
                gameDeck.push({card: gd.colors[c], property:gd.attack[a], id:id++})
            }
        }
        for(let w in gd.wilds.cards){
            for(let i = 0; i < gd.wilds.max; i++){
                gameDeck.push({card: "wild", property:gd.wilds.cards[w], id:id++})
            }
        }
        return gameDeck;
    }

    /* Draw a random card from the deck */
    draw(deck, player){
        let rnd = random.int(0, deck.length);
        return { card:deck[rnd].card, property: deck[rnd].property, player:player} 
    }

    adminDraw(deck){
        let rnd = Math.floor(Math.random() * deck.length);
        return { card:deck[rnd].card, property: deck[rnd].property, player:'admin'}
    }

    /* Deals 7 cards / config amount of cards to all players */
    deal(deck, players){
        let deltcards = [];
        players.forEach((p, i) => {
            var pCards = [];
            console.log('Player ', i)
            for(let c = 0; c < config.cardsToDeal; c++){
                console.log("deck length", deck.length)
                let rnd = Math.floor(Math.random() * deck.length)
                console.log(rnd)
                pCards.push({
                    player: p.author.username,
                    card: deck[rnd].card,
                    property: deck[rnd].property
                })
                deck = deck.filter(d => d.id != deck[rnd].id)
            }
            deltcards.push({player:p.author.id, cards:pCards})
        })
        return {deltcards, deck};
    }

}

module.exports = Deck;