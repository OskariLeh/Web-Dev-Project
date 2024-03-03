const mongoose = require("mongoose")

const Schema = mongoose.Schema

let messageSchema = new Schema({
    sender: {type: String},
    receiver: {type: String},
    time: {type: Date},
    content: {type: String}
})

module.exports = mongoose.model("Message", messageSchema)