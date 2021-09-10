const jwt = require('jsonwebtoken');

function verify(req,res,next){
    const authHeader = req.headers.token;
    if (authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECTATE_KEY, (err, user) => {
            if (err) res.status(403).json('Your Token Is Not Authenticated');
            req.user = user;
            next();
        });
    }else{
        res.status(401).json("You Not Authentic...! Login First...");
    }
}

module.exports = verify;