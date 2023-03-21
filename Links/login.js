import { createAccessToken, createRefreshToken } from "../api/createTokens.js";
import { findUser, updateTokens, updateTokensInUser } from "../api/db.js";
import { parseUserToTokenData, setCookie } from "../api/utils.js";


async function login(req, res, secretAccess, secretRefresh){
    const login = req.body.login;
    console.log(secretAccess);
    const password = req.body.password;
    const user = await findUser(login);
    if(user){
        if(user.password === password){
            const tokensData = parseUserToTokenData(user);
            const accessToken = await createAccessToken(tokensData, secretAccess);
            const refreshToken = await createRefreshToken({name: tokensData.name}, secretRefresh);
            updateTokensInUser(user, accessToken, refreshToken);
            setCookie(res, 'access', accessToken);
            setCookie(res, 'refresh', refreshToken);
            res.status(200).json({auth: true, user: {name: user.username, todos: user.todos}});
        }
        else{
            res.status(201).json({auth: false, error: 'password'})
        }
    }
    else{
        res.status(201).json({auth: false, error: 'login'})
    }
    
}

export default login;