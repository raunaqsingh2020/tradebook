import React, { useState, useEffect, useContext } from 'react'
import styled from "styled-components";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import { useLocation } from 'react-router-dom';
import { UserContext } from '../App'
import { createMessage, getConversation } from '../modules/api';
import Navbar from './Navbar';

const StyledChatContainer = styled(ChatContainer)`
  height: calc(100vh - 68px);
`;

function ChatMessage({ message, userId }) {

  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  return (
    <>
      {isImage(message.text) ?
        <Message
          model={{
            message: message.text,
            direction: message.sender === userId ? "outgoing" : "incoming",
            type: "image",
          }}
        >
          <Message.ImageContent src={message.text} alt="Akane avatar" width={200} />
        </Message>
        : 
        <Message
          model={{
            message: message.text,
            direction: message.sender === userId ? "outgoing" : "incoming"
          }}
        />
      }
    </>
  );
}

function Chat() {
  const location = useLocation();
  const { user2, user2Name } = location.state;
  var { username, userId } = useContext(UserContext)

  if (!userId || userId === "no-userid") {
    try {
      userId = localStorage.getItem('user-id');
      username = localStorage.getItem('username');
    } catch {
      console.log('log in!');
    }
  }

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetched = await getConversation(userId, user2);
        setMessages(fetched);
      } catch {
        setMessages([]);
      }
    }
    fetchData();
  }, [userId, user2, user2Name])

  useEffect(() => {
    async function refreshMessages() {
      try {
        const fetched = await getConversation(userId, user2);
        setMessages(fetched);
      } catch {
        setMessages([]);
      }
    }

    setInterval(refreshMessages, 4000);
  }, [userId, user2])

  async function sendMessage (textContent) {
    console.log(textContent);
    await createMessage(userId, user2, userId, textContent, username.substring(0, username.indexOf('@')), user2Name);
    setMessages(previousMessages => previousMessages.concat([{
      sender: userId,
      text: textContent,
    }]));
  }

  return (
    <>
      <Navbar/>
      <div style={{ position: "relative", }}>
        <MainContainer style={{ position: "relative" }}>
          <StyledChatContainer style={{paddingTop: 0}}>
            <MessageList>
              {messages.map((msg) =>
                <ChatMessage message={msg} userId={userId}/>
              )}
            </MessageList>
            <MessageInput onSend={sendMessage} attachButton={false} placeholder="Type message here" />
          </StyledChatContainer>
        </MainContainer>
      </div>
    </>
  )
}

export default Chat;
