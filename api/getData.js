import jwt from "jsonwebtoken";
async function getData(token, key){
    let data = undefined;
    await jwt.verify(token, key, function(err, decode){
        if(!err){
            data = {name: decode.name, todos: decode.todos};
        }
    });
    return data;
};
export default getData;