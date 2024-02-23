const mongoose = require("mongoose")

const Schema = mongoose.Schema

let userSchema = new Schema({
    username: {type: String},
    email: {type: String},
    password: {type: String},
    likes: {type: Array}
})

module.exports = mongoose.model("User", userSchema)