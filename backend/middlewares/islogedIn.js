import jwt from "jsonwebtoken"

const islogedIn = (req, res, next)=>{
    const authHeader = req.headers.Authorization || req.headers.authorization;
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECERT, (err, payload)=>{
        if(err) return res.json(err.message)
        req.user = payload;
        next()
    });
}

export default islogedIn;