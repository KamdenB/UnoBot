const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const createGameSchema = new Schema({
    players: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Games', createGameSchema)