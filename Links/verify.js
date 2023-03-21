import {createToken} from "../api/createTokens.js";
import { minuts } from "../api/time.js";
import verifyToken from "../api/verifyToken.js";
import getData from "../api/getData.js";
import {findUser} from '../api/db.js'


function setResponseHeader(res){
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", );
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}



async function verify(req, res, secretAccess, secretRefresh){
    const refreshToken = req.cookies.refresh;
    const accessToken = req.cookies.access;
    console.log(refreshToken, accessToken);
    const refreshData = await getData(refreshToken, secretRefresh);
    if(refreshData){
        const user = await findUser(refreshData.name);
        if(user && user.accessToken === accessToken && user.refreshToken === refreshToken){
            console.log('if1')
            const accessDecodeData = await getData(accessToken, secretAccess);
            console.log(accessDecodeData);
            const tokensData = {name: user.username, todos: user.todos};
            if(!accessDecodeData){
                console.log('accessExpired')
                const newAccessToken = await createToken(tokensData, secretAccess, '1m');
                res.cookie('access', newAccessToken, {httpOnly: true, maxAge:2147483647});
                user.accessToken = newAccessToken;
                user.save();
            }
            res.status(200).json({auth: true, user: {...tokensData}});
        }
        else{
            res.status(200).json({auth: false});
        }
    }
    else{
        res.status(200).json({auth: false});
    }
}
export default verify;