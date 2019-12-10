const mongoose = require('mongoose');

const savedWordsSchema = new mongoose.Schema({
    id: String,
    savedWords: [{
        slug: String,
        is_common: Boolean,
        japanese: [{
            word: String,
            reading: String
        }],
        senses: [{
            english_definitions: [],
            parts_of_speech: []
        }]
    }]
});

const SavedWords = mongoose.model('SavedWords', savedWordsSchema);

module.exports = SavedWords;