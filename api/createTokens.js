import jwt from 'jsonwebtoken'


export async function createTokens(payload, expiresAccess, expiresRefresh){
    const acessToken = createToken(payload, 'jaba', expiresAccess);
    const refreshToken = createToken(payload, 'jabaRef', expiresRefresh);
}
export async function createToken(payload, secretKey, expires){
    const token = await jwt.sign(payload, secretKey, {expiresIn: expires});
    return token;
};
export async function createAccessToken(payload, key){
    const token = await jwt.sign(payload, key, {expiresIn: '1m'});
    return token;
}
export async function createRefreshToken(payload, key){
    const token = await jwt.sign(payload, key, {expiresIn: '10m'});
    return token;
}
