const { mongoose } = require('../db');

const UserSchema = new mongoose.Schema({
    net_id: {
        type: String,
        unique: true
    }
    // stats (smart, happy, ...)
    // avatar info
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);
