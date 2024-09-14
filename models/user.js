const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
   pic:{
            type:String,
            dafault:"https://res.cloudinary.com/dqsgpoznr/image/upload/v1724486653/iuqhrseu5vi4u3wpohcd.png"
   },
    followers:[{type:ObjectId,ref:'User'}],
    following:[{type:ObjectId,ref:'User'}]
})

mongoose.model("User",userSchema)