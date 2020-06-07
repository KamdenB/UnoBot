const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const deckSchema = new Schema({
    server: { type: String, required: true},
    players: { type: Array, required: true},
    deck: { type: Array, required: true }
})

module.exports = mongoose.model()