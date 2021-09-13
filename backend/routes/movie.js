const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../helpers/verifyToken");

//CREATE
router.post('/', verify, async (req, res) => {
    if ( req.user.isAdmin ) {
        const newMovie = new Movie(req.body);
        try {
            const saveMovie = await newMovie.save();
            res.status(200).json(saveMovie);
        }catch (err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
    }
});


//UPDATE
router.put('/:id', verify, async (req,res) => {
   if (req.user.isAdmin){
       try{
           const newMovie = await Movie.findByIdAndUpdate(req.params.id, {
               $set:req.body,
           },{
               new : true,
           });
           res.status(200).json(newMovie);
       }catch (err){
           res.status(500).json(err);
       }
   } else{
       res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
   }
});


//DELETE
router.delete('/:id', verify, async (req, res) => {
   if (req.user.isAdmin){
       try{
           await Movie.findByIdAndDelete(req.params.id);
           res.status(200).json("ভাই মুভি টা ডিলিট করে দিলি");
       }catch (err){
           res.status(500).json(err);
       }
   } else{
       res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
   }
});



//SHOW
router.get('/find/:id', verify, async (req, res) => {
    if (req.user.isAdmin){
        try{
            const singleMovie = await Movie.findById(req.params.id);
            res.status(200).json(singleMovie);
        }catch (err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json('বা চুদির ভাই বা , দেকাই পাচ্চু তোর পারমিশন নাই, তুই হ্যাক করবার আচ্ছু ??? ');
    }
});



//INDEX
router.get('/', verify, async (req, res) => {
   try{
        const allMovie = await Movie.find();
        res.status(200).json(allMovie.reverse());
   } catch (err){
       res.status(500).json(err);
   }
});



//GET RANDOM
router.get('/random',verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === "series") {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } },
            ]);
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } },
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;