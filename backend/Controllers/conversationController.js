/* eslint-disable no-underscore-dangle */
/* eslint-disable */
const userController = require('./userController');
const authController = require('./authController');
const Conversation = require('../Model/conversationModel');
const User = require('../Model/userModel');

const errRes = (res, status, message, err) => {
  console.log(err);
  return res.status(status).json({
    status: 'error',
    error: err,
    message,
  });
};

exports.getConversation = async (req, res, next) => {
  let reqUser1 = req.query.user1
  let reqUser2 = req.query.user2 
  try {
    const existing = await Conversation.findOne({users: { $all: [reqUser1, reqUser2] }});
    if (existing) {
      return res.status(200).json({
        status: "Success. Conversation retrieved.",
        data: existing
      });
    } else {
      return res.status(404).json({
        status: 'error',
        message: "Conversation does not exist. Make sure filters are correct"
    })
    }
  } catch (err) {
    errRes(res, 404, "Conversation could not be found", err);
  }
};


exports.getConversations = async (req, res, next) => { //user1 = sender
  try {
    reqUser1 = req.query.user1;
    reqUserName1 = req.query.userName1.substring(0, req.query.userName1.indexOf('@'));

    let chats = await Conversation.find({users: reqUser1});
    let filteredChats = []
    Array.from(chats).forEach(chat => { 
      let lastMessage = ""
      if (chat.messages.length) { 
        if (chat.messages[chat.messages.length - 1] && chat.messages[chat.messages.length - 1].text) { 
          lastMessage = chat.messages[chat.messages.length - 1].text
        }
      }
      let user2 = ""
      let userName2 = ""

      Array.from(chat.users).forEach(user => { 
        if (!user.equals(reqUser1)) { 
          user2 = user
        }
      })
      Array.from(chat.userNames).forEach(userName => { 
        console.log('CHECK HEHEHEHHEHEHEE', userName, reqUserName1)
        if (userName !== (reqUserName1)) { 
          userName2 = userName
        }
      })
      filteredChats.push({id: chat._id, lastMessage: lastMessage, user2: user2, user2Name: userName2 }) //user2 = other person 
    })
    return res.status(200).json({
      status: 'success',
      data: filteredChats,
    });
  } catch (err) {
    errRes(res, 404, "Conversations could not be retrieved", err);
  }
};

exports.postConversation = async (req, res, next) => { //order of reqUsers doesn't matter AND to create a chat also 
  try {
    reqUser1 = req.body.user1;
    reqUser2 = req.body.user2;
    reqSender = req.body.sender; 
    reqMessage = req.body.message;
    const existingChat = await Conversation.findOne({users: { $all: [reqUser1, reqUser2] }});
    let newConversation;
    let append = { timestamp: Date.now(), text: req.body.message, sender: reqSender}
    if (existingChat) {
      let { messages } = existingChat;
      messages.push(append);
      newConversation = await Conversation.findOneAndUpdate({users: { $all: [reqUser1, reqUser2] }}, { messages: messages }, { new: true });
    } else {
      newConversation = await Conversation.create({users: [reqUser1, reqUser2], sender: reqSender, messages: [append], userNames: [req.body.user1Name, req.body.user2Name]}); //consistent ordering!
    }
    return res.status(200).json({
      status: 'success',
      data: newConversation,
    });
  } catch (err) {
    errRes(res, 404, "Conversation could not be created", err);
  }
};