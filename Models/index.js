const mongoose = require("mongoose")
const connectionString = process.env.CONNECTION_STRING;

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