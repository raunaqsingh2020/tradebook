import { React, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TextInput, ActivityIndicator, Alert, Icon, TouchableOpacity, Touchable, ScrollView } from 'react-native';
import { Button, SearchBar } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { getAllTextbooks, createTextbook, deleteTextbook, getTextbookById, getUserById, createMessage, getNotification, postNotification, deleteNotifications } from '../modules/api';

const styles = StyleSheet.create({
  searchInfo: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
    color: '#888'
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
  resultsContainer: {
    borderRadius: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    overflow: 'hidden',
    height: 225,
  },
  resultView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 8,
  },
  personName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    marginTop: 10,
    marginLeft: 10,
    color: '#555',
    width: '100%',
  },
  statusText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#555',
    maxWidth: '70%',
  },
  questionText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#555',
    alignSelf: 'center',
    margin: 20,
    marginBottom: 8,
  },
  traderText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#555',
    marginTop: 30,
    marginBottom: 10
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
  },
  moreInfo: {
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 12,
  },
});

function TextbookDetails({ route, navigation }) {

  const { textbook, username, userId } = route.params;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [alert, setAlert] = useState(false);
  const [inProfile, setInProfile] = useState(false);
  const [messageableTraders, setMsgTraders] = useState([]);

  useEffect(async() => {
    await getTextbookProfileData();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        await getTextbookProfileData();
      }
      fetchData();
    }, [])
  );

  async function getTextbookProfileData() {
    const res = await getAllTextbooks();
    const currTextbook = res.filter(tb => 
      tb._id.textbookName === textbook.name &&
      tb._id.textbookCourseCode === textbook.courseId &&
      tb._id.textbookDept[0] === textbook.deptName
    )[0]
    const availableTradersIds = currTextbook.users;

    let promises = [];
    availableTradersIds.forEach((traderId) => {
      promises.push(getUserById(traderId));
    });
    let availableTraders = await Promise.all(promises);
    setMsgTraders(availableTraders.filter(a => a.id != userId));

    if (availableTradersIds.includes(userId)) {
      setInProfile(true);
    } else {
      setInProfile(false);
    }

    const notifications = await getNotification(userId);
    const subscriptions = notifications.subscriptions;
    if (subscriptions.filter(sub => 
      sub.textbook_name === textbook.name &&
      sub.course_number_code === textbook.courseId &&
      sub.dept === textbook.deptName
    ).length > 0) {
      setAlert(true);
    } else {
      setAlert(false);
    }
  }

  async function handleAlert() {
    if (alert) {
      const notifications = await getNotification(userId);
      const subscriptions = notifications.subscriptions;
      const currTextbookSubIndex = subscriptions.findIndex((sub) => 
        sub.textbook_name === textbook.name &&
        sub.course_number_code === textbook.courseId &&
        sub.dept === textbook.deptName
      )
      await deleteNotifications(userId, currTextbookSubIndex);
      setAlert(!alert);
    } else {
      await postNotification(userId, textbook.name, textbook.courseId, textbook.deptName)
      setAlert(!alert);
    }
    await getTextbookProfileData();
  }

  async function handleProfileTextbookChange() {
    if (inProfile) {
      const usersTextbookIds = await getUserById(userId);
      let promises = [];
      usersTextbookIds.textbooks.forEach((textbookId) => {
        promises.push(getTextbookById(textbookId));
      });
      let usersTextbooks = await Promise.all(promises);
      let textbookIdToSell = usersTextbooks.filter(tb => 
        tb.course_number_code == textbook.courseId &&
        tb.dept[0] == textbook.deptName &&
        tb.name == textbook.name
      )[0].id;
      // await updateTextbook({id: textbookIdToSell, sold: true});
      await deleteTextbook(textbookIdToSell, userId);
      setInProfile(!inProfile);
    } else {
      await createTextbook(textbook.name, textbook.deptName, textbook.courseId, userId, 250, "n/a");
      setInProfile(!inProfile);
    }
    await getTextbookProfileData();
  }

  async function handleMessage(person) {
    await createMessage(userId, person.id, userId,
      `Hey! I am interested in your textbook, "${textbook.name}." Let me know if it is still available!`,
      username.substring(0, username.indexOf('@')),
      person.email.substring(0, person.email.indexOf('@'))
    );
    navigation.navigate('Chat', { user2: person.id, user2Name: person.email.substring(0, person.email.indexOf('@')) });
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
            <TouchableOpacity onPress={handleAlert}>
              {alert ? 
                <Ionicons style={{ alignSelf: 'flex-end', marginTop: 0, marginBottom: 0 }} name="notifications" size={28} color="#333" /> : 
                <Ionicons style={{ alignSelf: 'flex-end', marginTop: 0, marginBottom: 0 }} name="notifications-outline" size={28} color="#333" />
              }
            </TouchableOpacity>
            <Ionicons style={{ alignSelf: 'center', marginTop: 10, marginBottom: 14 }} name="book-outline" size={54} color="#333" />
            <Text numberOfLines={3} style={{ fontFamily: 'Poppins_700Bold', fontSize: 26, marginTop: 0, textAlign: 'center' }}>
              {textbook.name}
            </Text>
            {messageableTraders.length == 0 &&
              <>
                <View style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'center', justifyContent: 'center'}}>
                  <Text style={styles.statusText}>Unavailable</Text>
                  <Ionicons style={{ marginTop: 5, marginLeft: 4 }} name="ellipse" size={9} color="#FFC300" />
                </View>
                {inProfile ? 
                    <>
                        <Text style={styles.questionText}>No longer have this textbook?</Text>
                        <TouchableOpacity style={styles.button} onPress={handleProfileTextbookChange}>
                            <Text style={styles.buttonText}>Remove from profile</Text>
                            <Ionicons name="person-remove" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </> : 
                    <>
                        <Text style={styles.questionText}>Have this textbook?</Text>
                        <TouchableOpacity style={styles.button} onPress={handleProfileTextbookChange}>
                            <Text style={styles.buttonText}>Add to profile</Text>
                            <Ionicons name="person-add" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </>
                }
              </> 
            }
            {messageableTraders.length > 0 &&
              <>
                <View style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'center', justifyContent: 'center'}}>
                  <Text style={styles.statusText}>Available</Text>
                  <Ionicons style={{ marginTop: 5, marginLeft: 4 }} name="ellipse" size={9} color="#0FFF50" />
                </View>
                {inProfile ? 
                    <>
                        <Text style={styles.questionText}>No longer have this textbook?</Text>
                        <TouchableOpacity style={styles.button} onPress={handleProfileTextbookChange}>
                            <Text style={styles.buttonText}>Remove from profile</Text>
                            <Ionicons name="person-remove" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </> : 
                    <>
                        <Text style={styles.questionText}>Have this textbook?</Text>
                        <TouchableOpacity style={styles.button} onPress={handleProfileTextbookChange}>
                            <Text style={styles.buttonText}>Add to profile</Text>
                            <Ionicons name="person-add" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </>
                }
                <Text style={styles.traderText}>Available traders:</Text>
                <View style={styles.resultsContainer}>
                    <ScrollView>
                    {messageableTraders.map((person) =>
                        <TouchableOpacity onPress={() => handleMessage(person)} key={person.id}>
                            <View style={styles.resultView}>
                                <View style={{ width: '75%' }}>
                                    <Text style={styles.personName} numberOfLines={2}>{person.email.substring(0, person.email.indexOf('@'))}</Text>
                                </View>
                                <Ionicons style={styles.moreInfo} name="chatbubble" size={20} color="#2400FF" />
                            </View>
                        </TouchableOpacity>
                    )}
                    </ScrollView>
                </View>
                {/* <Ionicons name="chatbubble" size={30} color="#2400FF" /> */}
              </> 
            }
        </View>
    );
  }
}

export default TextbookDetails;