const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    userId: String,
    title: String,
    html: String,
    isFavorite: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Journal", journalSchema);