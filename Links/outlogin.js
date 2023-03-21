import { findUser } from "../api/db.js";
import getData from "../api/getData.js";
import verifyToken from "../api/verifyToken.js";

async function outlogin(req, res, secretAccess, secretRefresh){
    const refreshToken = req.cookies.refresh;
    const accessToken = req.cookies.access;
    const refreshData = await getData(refreshToken, secretRefresh);
    if(refreshData){
        const user = await findUser(refreshData.name);
        if(user && user.accessToken === accessToken && user.refreshToken === refreshToken){
            //IF Token expired
            if(!(await verifyToken(accessToken, secretAccess))){
                res.status(200).json({outlogin: false});
                return;
            }
            res.clearCookie('access');
            res.clearCookie('refresh');
            user.accessToken = 'none-token';
            user.refreshToken = 'none-token';
            user.save();
            res.status(200).json({outlogin: true});
        }
        //RefreshData not valid;
        else{
            res.status(201).json({outlogin: false});
        }
    }
    else{
        res.status(201).json({outlogin: false});
    }
}

export default outlogin;