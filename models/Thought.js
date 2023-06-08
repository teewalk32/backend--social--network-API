const { Schema, model } = require('mongoose');
const User = require('./User')
const reactionSchema = require('./Reaction');

// Schema to create a course model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280

    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: formatDate
    },
    username: {
      type: String,
      required: true,
      validate: {
        validator: async function (v) {
          const userExists = await User.findOne({ username: v });
          if (userExists)
            return true;
          return false;
        }
      }
    },
    reactions: [
      reactionSchema
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,

  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length
})

function formatDate(date) {

  const formattedDate = date.toLocaleDateString("en-US")
  return formattedDate;
}
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
