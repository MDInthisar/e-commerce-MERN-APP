const isAdmin = (...allowroles)=>{
    return (req, res, next)=>{
        const role = allowroles.includes(req.user.role);
        if(!role){
            res.json({error:'you are not authorized '})
        }
        next()
    }
    
}

export default isAdmin;