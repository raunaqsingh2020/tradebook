import { React, useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import profileLogo from '../assets/profile.png';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { UserContext } from '../App';
import { deleteTextbook, getTextbookById, getUser, updateTextbook } from '../modules/api';

const styles = StyleSheet.create({
  img: {
    height: 55,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 30,
  },
  resultsContainer: {
    borderColor: '#ddd',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    width: '86%',
    height: '45%',
    margin: 0,
  },
  resultView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 13,
  },
  textbookName: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#444',
    width: '85%',
  },
  usernameText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
    color: '#333',
    maxWidth: '80%',
    marginTop: 10,
  },
  sectionText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    color: '#333',
    width: '86%',
    marginTop: 10,
  },
  emptyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#555',
    width: '75%',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: '#FFF',
    alignSelf: 'center',
    marginRight: 6,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#2400FF',
    flexDirection: 'row',
    padding: 14,
    paddingBottom: 6,
    paddingTop: 6,
    borderRadius: 50,
    marginTop: 14,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Profile({ route, navigation }) {

  const { username, setAuthUsername, userId, setUserId } = useContext(UserContext);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  
  const [myTextbooks, updateMyTextbooks] = useState([]);

  useEffect(async() => {
    await getUserTextbooks();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        await getUserTextbooks();
      }
      fetchData();
    }, [])
  );
  
  async function getUserTextbooks() {
    const res = await getUser(username);
    const textbookIds = res.user.textbooks;
    let promises = []
    textbookIds.forEach((textbook) => {
      promises.push(getTextbookById(textbook));
    });
    let textbooks = await Promise.all(promises)
    updateMyTextbooks(textbooks);
  }

  function handleLogOut() {
    setAuthUsername("not-authenticated");
    setUserId("no-userid");
    navigation.navigate('Login');
  }

  async function handleRemoveTextbook(textbook) {
    // await updateTextbook({id: textbook.id, sold: true});
    console.log("REMOVING TEXTBOOK", textbook.id, userId);
    await deleteTextbook(textbook.id, userId);
    updateMyTextbooks(myTextbooks => myTextbooks.filter((book) => book.id !== textbook.id));
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
          <ActivityIndicator size="large" />
      </View>
    );
  } else {
      return (
        <View style={styles.container}>
          <Image source={profileLogo} style={styles.img}/>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.usernameText}>{username}</Text>
          <TouchableOpacity style={styles.button} onPress={handleLogOut}>
            <Text style={styles.buttonText}>Log out</Text>
            <Ionicons name="log-out-outline" size={18} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.sectionText}>My textbooks</Text>
          <View style={{ backgroundColor: '#333', height: 1, width: '86%', marginBottom: 16, marginTop: 3 }} />
          {myTextbooks.length == 0 &&
            <>
              <Ionicons style={{ marginTop: 70 }} name="library-outline" size={85} color="#2400FFC0" />
              <Text style={styles.emptyText}>No textbooks in your profile.</Text>
            </> 
          }
          {myTextbooks.length > 0 &&
            <View style={styles.resultsContainer}>
                <ScrollView style={{ width: '100%', height: '100%' }}>
                {myTextbooks.map((textbook) =>
                  <View style={styles.resultView} key={textbook.name}>
                      <Text style={styles.textbookName} numberOfLines={2}>{textbook.name}</Text>
                      <TouchableOpacity onPress={() => handleRemoveTextbook(textbook)}>
                        <Ionicons style={{ alignSelf: 'center' }} name="person-remove-outline" size={20} color="#2400FF" />
                      </TouchableOpacity>
                  </View>
                )}
                </ScrollView>
            </View>
          }
        </View>
    );
  }
}

export default Profile;