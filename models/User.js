const { Schema, model } = require('mongoose');


// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Invalid information",
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
  }
);
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

userSchema.pre("remove", async function (next) {
  try {
    const allUsers = await User.updateMany(
        { friends: this._id },
        {$pull: {friends: req.body.friendId}},
        {runValidators: true, new: true});    
    next()
  } catch (err) {
    console.log(err)
    next()
  }
});

const User = model('user', userSchema);

module.exports = User;
