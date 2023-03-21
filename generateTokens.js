import jwt from 'jsonwebtoken'

const generateTokens = async (user) =>{
    const payload = {login: user.login, todos: user.todos};
    const token = await jwt.sign(            
        payload,
        'jaba',
        {expiresIn: '20s'}
    );
    return token;
};
export default generateTokens;