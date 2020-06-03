const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const queueSchema = new Schema({
    server: {
        type: String,
        required: true
    },
    user: {
        username: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    }
})

module.exports = mongoose.model('queue', queueSchema)