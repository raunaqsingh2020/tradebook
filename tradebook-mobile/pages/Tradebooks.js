import { React, useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Modal, ActivityIndicator, Alert, TouchableOpacity, ScrollView, Pressable } from 'react-native';
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

import { UserContext } from '../App';
import { getAllTextbooks, getUserById, getNotification } from '../modules/api';

const styles = StyleSheet.create({
  iconContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    opacity: 0.85,
    height: '60%',
  },
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
    maxHeight: 350
  },
  resultView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  textbookName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    marginTop: 10,
    marginLeft: 10,
    color: '#555',
    width: '100%',
  },
  className: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 8,
    color: '#555',
    maxWidth: '70%',
  },
  moreInfo: {
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 12,
  },
  centeredView: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22
    position: 'absolute',
    top: '40%',
    left: '11%',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#2400FF",
    borderWidth: 1,
    padding: 24,
    width: '80%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
    elevation: 2,
    marginTop: 10
  },
  buttonClose: {
    backgroundColor: "#2400FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "black",
  },
  modalSubText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    color: "black",
  }
});

function Tradebooks({ route, navigation }) {

  const { username, userId } = useContext(UserContext);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const searchIgnoreParams = ["availability"];

  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const [modalShown, setModalShown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(async() => {
    if (!modalShown) {
      await getNotifications();
      if (notifications.length > 0) {
        setModalVisible(true);
        setModalShown(true);
      }
    }
  }, [notifications]);

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

  useEffect(async() => {
    await getAllData();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        console.log('FETCHING DATA!!!');
        await getAllData();
      }
      fetchData();
    }, [])
  );

  async function getAllData() {
    const res = await getAllTextbooks();
    const dataList = [];
    res.forEach(async(textbook) => {
      var textbookObj = { 
        name: textbook._id.textbookName,
        courseId: textbook._id.textbookCourseCode,
        deptName: textbook._id.textbookDept[0],
        course: textbook._id.textbookDept[0] + " " + textbook._id.textbookCourseCode,
        availability: [],
      }
      let promises = [];
      textbook.users.forEach((user) => {
        promises.push(getUserById(user));
      });
      let users = await Promise.all(promises);
      textbookObj.availability = users;
      dataList.push(textbookObj);
    })
    setAllData(dataList);
  }

  function handleTextbookDetail(textbook) {
    navigation.navigate('Details', { textbook, username, userId });
  }

  const handleChange = value => {
    setSearch(value);
    filterData(value);
  };

  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === "") {
      setData([]);
    } else {
      const filteredData = allData.filter(item => {
        return Object.keys(item).some(key =>
          searchIgnoreParams.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      setData(filteredData);
    }
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

            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>You have {notifications.length} notifications!</Text>
                    <Text style={styles.modalSubText}>Check the alerts tab to see newly available textbooks.</Text>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>OK</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>

            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 26, marginTop: 0 }}>Find your tradebooks.</Text>
            <SearchBar
              placeholder="ECON 101"
              onChangeText={handleChange}
              value={search}
              autoCapitalize="none"
              returnKeyType="search"
              platform="ios"
              containerStyle={{
              }}
              inputContainerStyle={{
                borderRadius: 50,
                backgroundColor: '#EEE',
              }}
              inputStyle={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 15,
                color: '#333'
              }}
              cancelButtonProps={{
                color: '#333'
              }}
            />
            <View style={styles.resultsContainer}>
              <ScrollView>
              {data.map((d) =>
                <TouchableOpacity onPress={() => handleTextbookDetail(d)}>
                  <View style={styles.resultView}>
                    <View style={{ width: '75%' }}>
                      <Text style={styles.textbookName} numberOfLines={2}>{d.name}</Text>
                      <Text style={styles.className} numberOfLines={1}>{d.course}</Text>
                    </View>
                    <Ionicons style={styles.moreInfo} name="chevron-forward" size={20} color="#2400FF" />
                  </View>
                </TouchableOpacity>
              )}
              </ScrollView>
            </View>
            {!search &&
              <>
                <Text style={styles.searchInfo}>Search by textbook name, course ID, or course title!</Text>
                <View style={styles.iconContainer}>
                  <Ionicons name="book" size={120} color="#2400FF" />
                </View>
              </> 
            }
            {(search !== '' && data.length == 0) &&
              <>
                <Text style={styles.searchInfo}>No results found.</Text>
                <View style={styles.iconContainer}>
                  <Ionicons name="sad" size={100} color="#DDD" />
                </View>
              </> 
            }
        </View>
    );
  }
}

export default Tradebooks;