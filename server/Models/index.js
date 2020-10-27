const mongoose = require("mongoose")
const connectionString = 'mongodb://localhost:27017/youtube-share';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})

mongoose.connection.on('connected', ()=>{
    console.log('mongo successful connection');
})
mongoose.connection.on('disconnected', ()=>{
    console.log('mongo connection disconnected');
})
mongoose.connection.on('error', (error)=>{
    console.log(error);
})


module.exports = {
    Room: require("./Room"),
    User: require("./User")
}