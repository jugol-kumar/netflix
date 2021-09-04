const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../helpers/verifyToken");

//UPDATE

router.put('/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            CryptoJS.AES.encrypt(req.body.password,process.env.SECTATE_KEY).toString();
        }
        try{
            const updateNewUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{
                new:true,
            });
            res.status(200).json(updateNewUser);
        }catch (err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json('You can only update your account.');
    }
});

//DELETE

//SHOW

//INDEX

//STATISTICS




module.exports = router;