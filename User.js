import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, require: true,dropDups: true},
    password: String,
    todos:[{
            type: Object,
            text: String,
            done: Boolean,
            id: Number
    }],
    accessToken: String,
    refreshToken: String
});
userSchema.pre('save', async function(){
    console.log('saved');
});
userSchema.methods.generateRefreshToken = async function(){
    const user = this;
    const token = jwt.sign({name: user.username, todos: user.todos}, 'jaba', {expiresIn: '5m'});
    user.tokens = await user.tokens.concat(token);
    await user.save();
    return token;
};
userSchema.methods.gettingTokenData = function(){
    const user = this;
    const data = {name: user.username, todos: user.todos};
    return data;
}
userSchema.statics.findUser = async(name) =>{
    const user = await User.findOne({username: name});
    return user;
};
const User = mongoose.model('User', userSchema, "users");
export default User;