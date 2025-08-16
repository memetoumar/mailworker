const mongoose= require("mongoose")
const connectDb=(url)=>{
    return mongoose.connect(url)
    // return mongoose.connect("mongodb+srv://dangabarin2020:mimihaha@cluster0.lo7pg4o.mongodb.net/cms?retryWrites=true&w=majority")

}
module.exports={connectDb}