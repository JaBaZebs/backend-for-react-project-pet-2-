import jwt from 'jsonwebtoken'

async function verifyToken(token, key){
    let isValid = false;
    await jwt.verify(token, key, function(err, data){
        if(data){
            isValid = true;
        }
    });
    return isValid;
}
export default verifyToken; 