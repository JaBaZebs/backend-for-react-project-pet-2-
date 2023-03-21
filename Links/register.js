import { createToken } from '../api/createTokens.js';
import { createUser, inDataBase } from '../api/db.js'


async function register(req, res, secretAccess, secretRefresh){
    const login = req.body.login;
    const password = req.body.password;
    console.log(secretAccess);
    if(await inDataBase(login)){
        res.status(200).json({auth: false});
        return;
    }
    const tokensData = {name: login, todos: []};
    const accessToken = await createToken(tokensData, secretAccess, '1m');
    const refreshToken = await createToken({name: tokensData.name}, secretRefresh, '10m');
    res.cookie('access', accessToken, {httpOnly: true, maxAge:2147483647});
    res.cookie('refresh', refreshToken, {httpOnly: true, maxAge:2147483647});
    const user = createUser({username: login, password: password, todos: [], accessToken: accessToken, refreshToken: refreshToken});
    res.status(200).json({auth: true, user: tokensData});
}

export default register