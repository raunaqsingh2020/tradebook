import React, { useState, useCallback, useEffect, useContext } from 'react'
import { View, Text, Image } from 'react-native';
import { GiftedChat, Actions } from 'react-native-gifted-chat'
import { UserContext } from '../App'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createMessage, getConversation } from "../modules/api";// import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from "expo-image-picker";
import socket from "../modules/socket";

function Chat({route, navigation}) {
  // const socket = io("http://10.180.222.240:8081", { transport: ["websocket"], upgrade: false });
  const insets = useSafeAreaInsets();
  const { user2, user2Name } = route.params
  const { username, setAuthUsername, userId, setUserId } = useContext(UserContext)

  const [messages, setMessages] = useState([]);

  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  const transposeMessage = (message) => { 
    var image = null;
    if (isImage(message.text)) {
      image = message.text;
    }

    return  {
      _id: (message.sender == user2) ? 1 : 2,
      text: message.text,
      createdAt: message.timestamp,
      user: {
        _id: (message.sender == user2) ? 2 : 1,
        name: "user-name",
        avatar: 'https://i.imgur.com/kQirypY.png',
      },
      image: image,
    }
  }

  useEffect(async() => {
    const messages = await getConversation(userId, user2);
    var transposedArr = [];
    Array.from(messages).forEach(message => { 
      let element = transposeMessage(message);
      transposedArr.push(element);
    })
    // transposedArr = transposedArr.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    setMessages(transposedArr);
    socket.on("getMessage", (message) => { //messages are actually timestamp, text, sender
      setMessages(previousMessages => GiftedChat.append(previousMessages, transposeMessage(message), false)); //previousMessages.push(message)
    })
  }, [])

  async function refreshMessages() {
    console.log('refreshing messages');
    const messages = await getConversation(userId, user2);
    var transposedArr = [];
    Array.from(messages).forEach(message => { 
      let element = transposeMessage(message);
      transposedArr.push(element);
    })
    setMessages(transposedArr);
  }

  useEffect(() => {
    setInterval(refreshMessages, 4000);
  }, [])

  const onSend = useCallback(async(messages = []) => {
    if (isImage(messages[0].text)) {
      messages[0].image = messages[0].text;
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages, false));
    await createMessage(userId, user2, (messages[0].user._id == 1) ? userId : user2, messages[0].text, username.substring(0, username.indexOf('@')), user2Name);
    socket.emit("sendMessage", {senderId: userId, receiverId: user2, text: messages[0].text, timestamp: Date.now() }); //is messages[0].text the text sent??? 
  }, [])

  const renderMessageImage  = (props) => {
		if (props.currentMessage.image) {
			return (
				<View
          style={{
            borderRadius: 15,
            padding: 2,
          }}>
          <Image
            resizeMode="contain"
            style={{
              width: 200,
              height: 200,
              padding: 6,
              borderRadius: 15,
              resizeMode: 'cover',
            }}
            source={{uri: props.currentMessage.image}}
          />
        </View>
			);
		}
		return null
	}

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      bottomOffset={50 + insets.bottom}
      renderMessageImage={renderMessageImage}
      isAnimated
      user={{
        _id: 1,
      }}
    />
  )
}

export default Chat;