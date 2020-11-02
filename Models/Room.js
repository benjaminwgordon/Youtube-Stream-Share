const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: {type:String},
    owner: {type: Schema.Types.ObjectId, ref: "User"},
    viewers: [{type: Schema.Types.ObjectId, ref: "User"}],
    invited: [{type: Schema.Types.ObjectId, ref: "User"}],
    currentVideo: {type:String},
    videoQueue: [{type: String}],
    public: {type:Boolean, default:true}
})

module.exports = mongoose.model("Room", RoomSchema)