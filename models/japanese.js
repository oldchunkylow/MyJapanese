const mongoose = require('mongoose');

const japaneseSchema = new mongoose.Schema({
    slug: String,
    is_common: false,
    japanese: [],
    senses: []
});

const Japanese = mongoose.model('Japanese', japaneseSchema);

module.exports = Japanese;