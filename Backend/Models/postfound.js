const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/CUETFinders");

const postfound = mongoose.Schema({
    name: String,
    item: String,
    location: String,
    date: String,
    description: String,
    photo: String,
    contact: String,
    user : {type: mongoose.Schema.Types.ObjectId, ref : "users"}
})

module.exports = mongoose.model('PostFound',postfound);