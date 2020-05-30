class Deck {
    constructor(){
        
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
                gameDeck.push({color: gd.wilds.cards[w], property:gd.wilds.cards[w]})
            }
        }
        return gameDeck;
    }
}

module.exports = Deck;