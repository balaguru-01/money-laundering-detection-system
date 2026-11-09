const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);