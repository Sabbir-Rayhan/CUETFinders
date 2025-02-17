const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/CUETFinders");

const user = new mongoose.Schema({
    name : String,
    //email: { type: String, required: true, unique: true },
    email : String,
    password : String,
    mobile : String,
    address : String,
    post : [{type : mongoose.Schema.Types.ObjectId,ref : "PostFound"}]
})

module.exports = mongoose.model('users',user);