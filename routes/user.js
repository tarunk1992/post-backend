const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post  = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name");
        res.json({ user, posts });
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});

router.put('/follow', requireLogin, async (req, res) => {
    try {
      // First, update the followers array of the user being followed
      const updatedUser = await User.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id }
        },
        { new: true } // Return the updated document
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(422).json({ error: 'User not found' });
      }
  
      // Then, update the following array of the current user
      const currentUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId }
        },
        { new: true }
      ).select("-password");
  
      res.json(currentUser);
    } catch (err) {
      return res.status(422).json({ error: err.message });
    }
  });
  
  


  router.put('/unfollow', requireLogin, async (req, res) => {
    try {
      // First, remove the current user from the followers array of the user being unfollowed
      const updatedUser = await User.findByIdAndUpdate(
        req.body.unfollowId,
        {
          $pull: { followers: req.user._id }
        },
        { new: true }// Return the updated document
      ).select("-password"); 
  
      if (!updatedUser) {
        return res.status(422).json({ error: 'User not found' });
      }
  
      // Then, remove the user being unfollowed from the following array of the current user
      const currentUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId }
        },
        { new: true }
      );
  
      res.json(currentUser);
    } catch (err) {
      return res.status(422).json({ error: err.message });
    }
  });
  

  router.put('/updatepic', requireLogin, async (req, res) => {
    try {
      if (!req.body.pic) {
        return res.status(400).json({ error: "Picture URL is required" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { pic: req.body.pic } },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id name")
    .then(user=>{
      res.json({user})
    }).catch(err=>{
      console.log(err)
    })
  })

module.exports = router