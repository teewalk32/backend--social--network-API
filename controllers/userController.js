const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');


module.exports = {
  // Get all users
  async getAllUsers(req, res) {
    try{
        const allUsers = await User.find()
        return res.status(200).json(allUsers)
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
  },

  // Get a user
  async getOneUser(req, res) {
    try{
        const userData = await User.findOne({_id: req.params.userId}).populate('friends').populate('thoughts')
        if(!userData){
            return res.status(404).json({message: "User Not Found"})
        }
        return res.status(200).json(userData)
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
  },

  // Create a user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      //console.log(newUser);
        return res.json(newUser);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
  },

  // Delete a user
  async deleteUser(req,res){
    try{
        const userData = await User.findOneAndDelete({_id: req.params.userId})
        if(!userData){
            return res.status(404).json({message: "User Not Found"})
        }
    
        return res.status(200).json(userData)
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
  },

  // Update user
  async updateUser(req, res){
    try{
        const userData = await User.findOneAndUpdate(
            {_id: req.params.userId},
            { $set: req.body },
            { runValidators: true, new: true })
        if(!userData){
            return res.status(404).json({message: "User Not Found"})
        }
        return res.status(200).json(userData)
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
  },

  // add new friend
  async addFriend(req, res) {
    try{
        const friendData =await User.findOne({_id: req.body.friendId})
        if(!friendData){
            return res.status(404).json({message: "Cannot add a friend that doesn't exist"})
        }
        const userData = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.body.friendId}},
            {runValidators: true, new: true})

        const friendData2 = await User.findOneAndUpdate(
                {_id: req.body.friendId},
                {$addToSet: {friends: req.params.userId}},
                {runValidators: true, new: true})
        if(!userData){
            return res.status(404).json({message: "User Not Found"})
        }
        return res.status(200).json({message: "successfully added friend"})
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
  },

  // delete friend
  async removeFriend(req, res) {
    try{
        const friendData =await User.findOne({_id: req.body.friendId})
        if(!friendData){
            return res.status(404).json({message: "Cannot add a friend that doesn't exist"})
        }
        const userData = await User.findOne(
            {_id: req.params.userId})
            
        if(!userData){
            return res.status(404).json({message: "User Not Found"})
        }
        userData.friends.pull(req.body.friendId)
        console.log(userData)
        await userData.save();

        friendData.friends.pull(req.params.userId)
        console.log(friendData)
        await friendData.save();
        return res.status(200).json({message: "successfully removed friend"})
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
  }

};
