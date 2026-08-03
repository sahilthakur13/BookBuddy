const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v);
            },
            message: props => `${props.value} is not a valid Gmail address!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select:false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified:{
        type:Boolean,
        default:false
    }
}, { timestamps: true }); 
    
userSchema.pre("save",async function(){
    if(!this.isModified("password")){
       return ;
    }
    this.password = await bcrypt.hash(this.password,10);
})


   userSchema.methods.comparePassword = async function(password){
    const decyptedPassword= await bcrypt.compare(password,this.password);
    
    return decyptedPassword;
}

module.exports = mongoose.model('User', userSchema);
