import jwt from 'jsonwebtoken'

export const generateToken = ({
    payload = {},
    signature = process.env.TOKEN_SECRET
}) =>{
    if(!Object.keys(payload).length){
        return false
    }
    const token = jwt.sign(payload,signature);
    return token;
}

export const decodeToken = ({
    payload = "",
    signature = process.env.TOKEN_SECRET
}) =>{
    if(payload == ""){
        return false
    }
    const decoded = jwt.verify(payload,signature);
    return decoded;
}