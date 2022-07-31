const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }],
  userNames: [{
    type: String
  }],
  messages: {
    type: [
      {
        timestamp: {
          type: Date,
          default: Date.now(),
        },
        text: {
          type: String,
          required: [true, 'Messages must have content'],
        },
        sender: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: [true, 'Messages must have a sender, true means user 1 and false means user 2'],
        },
      },
    ],
    default: []
  },
  transactionOccurred1: {
    type: Boolean,
    default: false
    // required: [true, 'Must indicate whether user 1 has verified a transaction'],
  },
  transactionOccurred2: {
    type: Boolean,
    default: false
    // required: [true, 'Must indicate whether user 2 has verified a transaction'],
    }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
