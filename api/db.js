import mongoose from 'mongoose';
import User from '../User.js';

export async function connectDataBase() {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URL, (err) =>{
        console.log('Connecting to Database. Errors:', err);
        console.log('Server start');
    });
};
export async function inDataBase(name){
    const isInDB = await User.findUser(name);
    return (isInDB ? true : false);
}
export async function findUser(name){
    const user = await User.findUser(name);
    return user;
}
export async function updateAccessToken(name, token){
    User.updateOne({username: name}, {accessToken: token})
}
export async function updateRefreshToken(name, token){
    User.updateOne({username: name}, {accessToken: token})
}
export async function updateTokens(name, access, refresh){
    User.updateOne({username: name}, {accessToken: access, refreshToken: refresh});
}
export async function updateTokensInUser(user, access, refresh){
    user.accessToken = access;
    user.refreshToken = refresh;
    user.save();
}
export async function createUser(payload){
    User.create(payload);
}