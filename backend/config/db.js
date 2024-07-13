const mongoose = require('mongoose')
const configureDb = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('successfully connect to the database')
    }catch(err){
        console.log(err)
    }
}
module.exports=configureDb;