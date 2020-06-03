const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playCardSchema = new Schema({
    player: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    card: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('playedCards', playCardSchema)