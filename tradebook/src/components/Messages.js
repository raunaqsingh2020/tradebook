import { React, useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import { ChevronForwardOutline } from 'react-ionicons';
import { PersonCircleOutline } from 'react-ionicons';
import { UserContext } from '../App'
import { getUsersConversations } from '../modules/api';

const styles = ({
  img: {
    height: 55,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  input: {
    //fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
    height: 45,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#DEDEDE',
    width: '100%',
  },
  field: {
    //fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 8
  },
  loginButton: {
    backgroundColor: '#2400FF',
    borderWidth: 0,
    borderRadius: 40,
    height: 52,
    width: 130,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20
  },
  loginButtonText: {
    color: '#FFF',
    //fontFamily: 'Poppins_600SemiBold',
    fontSize: 15
  },
  forgotButton: {
    height: 42,
    width: 200,
    alignSelf: 'center'
  },
  forgotButtonText: {
    color: '#2400FF',
    //fontFamily: 'Poppins_600SemiBold',
    fontSize: 14
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'white',
    marginLeft: 'auto',
    marginRight: 12,
    height: 150,
    width: 1000,
    borderWidth: 1,
    border: 'solid',
    borderColor: '#ddd',  
    maxHeight: 350
  },
});

const Messages = () => {
  let navigate = useNavigate(); 

  const [conversations, setConversations] = useState([]);
  var { userId, username } = useContext(UserContext);

  if (!userId || userId === "no-userid") {
    try {
      userId = localStorage.getItem('user-id');
      username = localStorage.getItem('username');
    } catch {
      console.log('log in!');
    }
  }

  useEffect(() => {
    async function getAllConvos() {
      const res = await getUsersConversations(userId, username);
      if (res.data) {
        setConversations(res.data);
      }
    }
    getAllConvos();
  }, [userId, username])

    return (
      <div>
        <Navbar/>
        <div style={styles.container}>
        {conversations.length === 0 &&
          <div style={{ flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <p style={styles.noMsgsHeader}>Your messages will show up here.</p>
            <p style={styles.noMsgsSubhead}>Get started by finding someone with a textbook you need!</p>
          </div>
        }
        {conversations.length > 0 &&
          <FlatList 
            data={conversations}
            keyExtractor={item=>item.id}
            style={{ height: '100%' }}
            renderItem={({item}) => (
              <div>
                <center>
              <button style={styles.button} onClick={() => navigate('/Chat', { state: { user2: item.user2, user2Name: item.user2Name } })}> 
                <div style={{ flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: 1, padding: 8 }}>
                  <PersonCircleOutline
                    color={'#00000'} 
                    height="50px"
                    width="50px"
                  />
                  <div style={{ width: '100%'}} >
                    <p numberOfLines={1} style={styles.nameText}>{item.user2Name}</p>
                    <p numberOfLines={1} style={styles.msgText}>{item.lastMessage}</p>
                    <ChevronForwardOutline
                      color={'#00000'} 
                      height="30px"
                      width="30px"
                    />
                  </div>
                  {/* <Ionicons style={styles.moreInfo} name="chevron-forward" size={20} color="#2400FF" /> */}
                </div>
              </button>
              </center>
              </div>
            )}
          />
        }
      </div>
        {/* <ul>
          <FlatList 
            list={Chats}
            renderItem={({item}) => (
              <li key={item.id}>
                <button onClick={() => navigate('/Chat', { userName: item.userName })}>
                  <div>
                    <div>
                      <p>{item.userName}</p>
                      <p>{item.messageTime}</p>
                    </div>
                    <p>{item.messageText}</p>
                  </div>
                </button>
              </li>
            )}
          />
        </ul> */}
      </div>
    );
};

export default Messages;
