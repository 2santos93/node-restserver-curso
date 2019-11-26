const jwt = require('jsonwebtoken');


let verifyToken = (req, res, next) => {

    const token = req.get("Authorization");

    jwt.verify(token, process.env.SEED_TOKEN, (err, payload) => {

        if(err){
            return res.status(401).json({
                ok:false,
                err
            });
        }
        
        req.user = payload.user;
        
        next();

    });

}

let verifyRoleAdmin = (req, res, next) => {

    if(req.user.role[0] !== "ADMIN_ROLE"){
        return res.status(401).json({
            ok:false,
            message: "Role doesnt have permissions"
        });
    }

    next();

}

module.exports = {
    verifyToken,
    verifyRoleAdmin
}