const { mongoose } = require('../db');

const EventSchema = new mongoose.Schema({
    creator: {
        type: String
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: Array
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    radius: {
        type: Number
    }
}, {timestamps: true});

module.exports = mongoose.model('Event', EventSchema);
