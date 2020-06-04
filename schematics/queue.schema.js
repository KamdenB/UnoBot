const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const queueSchema = new Schema({
    server: {
        type: String,
        required: true
    },
    serverName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    ready: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('queue', queueSchema)