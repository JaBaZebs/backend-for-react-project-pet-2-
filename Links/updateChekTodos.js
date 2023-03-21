import { createAccessToken} from "../api/createTokens.js";
import { findUser } from "../api/db.js";
import getData from "../api/getData.js";

export default async function updateChekTodos(req, res, secretAccess, secretRefresh){
    const refreshToken = req.cookies.refresh;
    const accessToken = req.cookies.access;
    const refreshData = await getData(refreshToken, secretRefresh);
    if(refreshData){
        const user = await findUser(refreshData.name);
        console.log(user, user.accessToken === accessToken, user.refreshToken === refreshToken)
        if(user && user.accessToken === accessToken && user.refreshToken === refreshToken){
            const newTodos = req.body.todos;
            user.todos = newTodos;
            console.log(user.todos, newTodos,"tod");
            const accessData = {name: user.username, todos: newTodos};
            const newAccessToken = await createAccessToken(accessData, secretAccess);
            user.accessToken = newAccessToken;
            user.save();
            res.cookie('access', newAccessToken, {httpOnly: true, maxAge:2147483647});
            res.status(200).json({put: true});
        }
        else{
            res.status(201).json({put: false});
        }
    }
    else{
        res.status(201).json({put: false});
    }
}