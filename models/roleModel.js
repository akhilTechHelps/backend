const mongoose = require('mongoose')
const Schema = mongoose.Schema



const roleSchema = new Schema( {

    name : {    type :     String ,   require : [true,"name is required " ],     },

     
    

  },  {timestamps:true}
  )

module.exports = mongoose.model("role", roleSchema );