import { React, useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../App'
import { StyleSheet, View, Text, Image, TextInput, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import profileLogo from '../assets/profile.png';
import { getUsersConversations } from '../modules/api';

const styles = StyleSheet.create({
  img: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 10,
    marginRight: 15
  },
  nameText: {
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginTop: 4,
    maxWidth: '85%'
  },
  msgText: {
    color: '#777',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    marginTop: 1,
    maxWidth: '70%'
  },
  noMsgsHeader: {
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    marginTop: 1,
    maxWidth: '80%',
    top: -50,
  },
  noMsgsSubhead: {
    color: '#777',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginTop: 13,
    maxWidth: '80%',
    top: -50,
  },
  moreInfo: {
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 
const Chats = ({ navigation }) => {
  // in componentDidMount or useEffect({},[]) we need to first get all
  // conversationss associates with the user1 or logged in users id by calling the "get" /conversationss route
  const [conversations, setConversations] = useState([]);
  const { username, setAuthUsername, userId, setUserId } = useContext(UserContext);

  async function getAllConvos() {
    const res = await getUsersConversations(userId, username);
    if (res.data) {
      setConversations(res.data);
    }
    console.log('chats', res.data);
  }

  useEffect(async () => {
    await getAllConvos();
  }, [userId, navigation])

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        await getAllConvos();
      }
      fetchData();
    }, [])
  );

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {conversations.length == 0 &&
          <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Text style={styles.noMsgsHeader}>Your messages will show up here.</Text>
            <Text style={styles.noMsgsSubhead}>Get started by finding someone with a textbook you need!</Text>
          </View>
        }
        {conversations.length > 0 &&
          <FlatList 
            data={conversations}
            keyExtractor={item => item.id}
            style={{ height: '100%' }}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => navigation.navigate('Chat', { user2: item.user2, user2Name: item.user2Name })}> 
              {/* should  */}
                <View style={{ flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: 1, padding: 8 }}>
                  <Image style={styles.img} source={profileLogo} />
                  <View style={{ width: '100%'}} >
                    <Text numberOfLines={1} style={styles.nameText}>{item.user2Name}</Text>
                    <Text numberOfLines={1} style={styles.msgText}>{item.lastMessage}</Text>
                  </View>
                  <Ionicons style={styles.moreInfo} name="chevron-forward" size={20} color="#2400FF" />
                </View>
              </TouchableOpacity>
            )}
          />
        }
      </View>
    );
  }
};

export default Chats;