const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/CUETFinders");

const reportlost = mongoose.Schema({
    name: String,
    item: String,
    location: String,
    date: String,
    description: String,
    photo: String,
    contact: String,
})

module.exports = mongoose.model('ReportLost',reportlost);