const mongoose=require("mongoose");
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
      aadharnumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{12}$/.test(v); // Must be exactly 12 digits
            },
            message: props => `${props.value} is not a valid 12-digit Aadhar number`
        }
    },

password:{
type:String,
required:true
},
role:{
    type:String,
    enum:['voter','admin'],
    default:'voter',

},
isvoted:{
    type:Boolean,
    default:false
}
})


userSchema.pre('save',async function(next) {
    const user = this;

    if(!user.isModified('password')) return next();
    try {
        //hash password generate
        const salt=await bcrypt.genSalt(10);
        //hash password
        const hashedpassword=await bcrypt.hash(user.password,salt)
        user.password=hashedpassword
        next()
    } catch (error) {
        return next(error)
    }
})
userSchema.methods.comparePassword = async function (candidatepassword) {
    try {
        const isMatch=await bcrypt.compare(candidatepassword,this.password);
        return isMatch;
        
    } catch (error) {
        throw err
    }
}

const User=mongoose.model('User',userSchema)
module.exports=User