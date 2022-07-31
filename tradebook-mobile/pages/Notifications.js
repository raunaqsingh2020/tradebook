import { React, useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { UserContext } from '../App';
import { getNotification, deleteNotifications } from '../modules/api';

const styles = StyleSheet.create({
  resultsContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    margin: 0,
  },
  resultView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 20,
    margin: 0,
  },
  textbookName: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#555',
    width: '100%',
  },
  availableText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#444',
    width: '100%',
    marginBottom: 2,
  },
  statusText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
    color: '#AAA',
    maxWidth: '90%',
    marginTop: 30,
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

function Notifications({ route, navigation }) {

  const { username, userId } = useContext(UserContext);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const list = [
    {name: 'Differential Equations and Linear Algebra', courseId: '240', courseName: 'MATH', course: 'MATH 240', availability: [
      {id: 1, name: 'Aspen Koch'},
    ]},
    {name: 'C: A Reference Manual', courseId: '240', courseName: 'CIS', course: 'CIS 240', availability: [
      {id: 2, name: 'Rubi Chambers'},
    ]},
    {name: 'Introduction to Algorithms', courseId: '320', courseName: 'CIS', course: 'CIS 320', availability: [
      {id: 3, name: 'Nathaniel Craig'},
    ]},
  ];

  // const list = []

  const [notifications, setNotifications] = useState([]);

  useEffect(async() => {
    await getNotifications();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        await getNotifications();
      }
      fetchData();
    }, [])
  );

  async function getNotifications() {
    const res = await getNotification(userId);
    const notifications = res.foundNotificationsResults;
    if (notifications.length > 0) {
      const notifTextbooks = notifications.map(notif => ({ 
        textbook_name: notif[0].name,
        textbook_dept: notif[0].dept[0],
        textbook_course_code: notif[0].course_number_code,
      }));
      setNotifications(notifTextbooks);
    } else {
      setNotifications([]);
    }
  }

  async function handleDeleteNotif(textbook) {
    const notifications = await getNotification(userId);
    const subscriptions = notifications.subscriptions;
    const currTextbookSubIndex = subscriptions.findIndex((sub) => 
      sub.textbook_name === textbook.textbook_name &&
      sub.course_number_code === textbook.textbook_course_code &&
      sub.dept === textbook.textbook_dept
    )
    await deleteNotifications(userId, currTextbookSubIndex);
    await getNotifications();
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
          {notifications.length == 0 &&
            <>
              <Ionicons style={{ marginTop: '35%' }} name="time-outline" size={85} color="#2400FFC0" />
              <Text style={styles.statusText}>Nothing to see here...</Text>
            </> 
          }
          {notifications.length > 0 &&
            <View style={styles.resultsContainer}>
                <ScrollView style={{ width: '100%', height: '100%' }}>
                {notifications.map((textbook) =>
                    // <TouchableOpacity onPress={() => handleTextbookDetail(textbook)} key={textbook.name}>
                        <View style={styles.resultView} key={textbook.name}>
                            <View>
                              <Text style={styles.availableText} numberOfLines={2}>Available now!</Text>
                              <Text style={styles.textbookName} numberOfLines={2}>{textbook.textbook_name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteNotif(textbook)} >
                              <Ionicons style={{ alignSelf: 'center' }} name="close-outline" size={20} color="#DC143C" />
                            </TouchableOpacity>
                        </View>
                    // </TouchableOpacity>
                )}
                </ScrollView>
            </View>
          }
        </View>
    );
  }
}

export default Notifications;