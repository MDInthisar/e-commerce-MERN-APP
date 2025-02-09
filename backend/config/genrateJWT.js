import jwt from "jsonwebtoken";

const genrateJWT = (id, role)=>{
    const token = jwt.sign({userID: id, role}, process.env.JWT_SECERT,{expiresIn: '24h'});
    return token;
}

export default genrateJWT;