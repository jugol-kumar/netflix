const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../helpers/verifyToken");

//UPDATE
router.put('/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password =  CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECTATE_KEY
            ).toString();
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

router.delete("/:id", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("THis user is deleted successfully done");
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json('You can only delete your account.');
    }
});



//SHOW
router.get('/find/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            const user = await User.findById(req.params.id,);
            const {password, ...info} = user._doc;
            res.status(200).json(info);
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json('You have no access permission...');
    }
});


//INDEX
router.get('/',verify, async (req, res) => {
    if (req.user.isAdmin){
        const query = req.query.new
        try {
            const users =  query ? await User.find().limit(2) : await User.find() ;
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You Don't have admin permission");
    }
});

//STATICS

router.get("/stats", async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
    try {

        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;