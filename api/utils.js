export function parseUserToTokenData(user){
    const data = {name: user.username, todos: user.todos};
    return data;
}
export function setCookie(response,name, value){
    response.cookie(name, value, {httpOnly: true});
}
export async function setHeaders(res){
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}