const router = require("express").Router();
const List = require("../models/List");
const verify = require("../helpers/verifyToken");

//CREATE
router.post('/', verify, async (req, res) => {
    if ( req.user.isAdmin ) {
        const newList = new List(req.body);
        try {
            const saveList = await newList.save();
            res.status(200).json(saveList);
        }catch (err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
    }
});




//
//UPDATE
router.put('/:id', verify, async (req,res) => {
    if (req.user.isAdmin){
        try{
            const updateList = await List.findByIdAndUpdate(req.params.id, {
                $set:req.body,
            },{
                new : true,
            });
            res.status(200).json(updateList);
        }catch (err){
            res.status(500).json(err);
        }
    } else{
        res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
    }
});
//
//
//DELETE
router.delete('/:id', verify, async (req, res) => {
    if (req.user.isAdmin){
        try{
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json("ভাই তুই এত্ত খারাপ, ফুল মুভি লিস্ট টা ডিলিট করে দিলি... :(");
        }catch (err){
            res.status(500).json(err);
        }
    } else{
        res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
    }
});
//
//
//
// SHOW
router.get('/find/:id', verify, async (req, res) => {
    if (req.user.isAdmin){
        try{
            const singleList = await List.findById(req.params.id);
            res.status(200).json(singleList);
        }catch (err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
    }
});
//
//
//
// INDEX
router.get('/', verify, async (req, res) => {
    const typeQuery = req.query.type;
    const generQuery = req.query.gener;
    let list = [];

    try{
        if (typeQuery){
            if (generQuery){
                list = await List.aggregate([
                    {$sample: { size: 10} },
                    { $match: {  type: typeQuery, gener: generQuery } }
                ]);
            }else{
                list = await List.aggregate([
                    {$sample: { size: 10} },
                    { $match: {  type: typeQuery } }
                ]);
            }
        }else{
            list = await List.aggregate([
                { $sample: { size:10 } }
            ]);
        }
        res.status(200).json(list);
    } catch (err){
        res.status(500).json(err);
    }
});
//
//
//
// //GET RANDOM
// router.get('/random',verify, async (req, res) => {
//     const type = req.query.type;
//     let movie;
//     try {
//         if (type === "series") {
//             movie = await Movie.aggregate([
//                 { $match: { isSeries: true } },
//                 { $sample: { size: 1 } },
//             ]);
//         } else {
//             movie = await Movie.aggregate([
//                 { $match: { isSeries: false } },
//                 { $sample: { size: 1 } },
//             ]);
//         }
//         res.status(200).json(movie);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


module.exports = router;