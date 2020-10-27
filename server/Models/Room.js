const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    viewers: [{type: Schema.Types.ObjectId, ref: "User"}],
    currentVideo: {type:String},
    videoQueue: [{type: String}]
})

module.exports = mongoose.model("Room", RoomSchema)