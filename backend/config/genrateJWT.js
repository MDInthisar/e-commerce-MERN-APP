import jwt from "jsonwebtoken";

const genrateJWT = (id, role)=>{
    const token = jwt.sign({userID: id, role}, process.env.JWT_SECERT,{expiresIn: '100d'});
    return token;
}

export default genrateJWT;