import { React, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationsOutline } from 'react-ionicons';
import { EllipseOutline } from 'react-ionicons';
import { PersonRemoveOutline } from 'react-ionicons';
import { PersonAddOutline } from 'react-ionicons';
import { ChatbubbleOutline } from 'react-ionicons';
import { Link } from "react-router-dom";
import styled from "styled-components";
import { NotificationsOffOutline } from 'react-ionicons';
import { UserContext } from '../App'
import { createMessage, createTextbook, deleteNotifications, deleteTextbook, getAllTextbooks, getNotification, getTextbookById, getUserById, postNotification } from '../modules/api';

const StyledRegisterLink = styled(Link)`
  text-decoration: none; 
  font-family: Poppins;
  font-weight: 600;
  font-size: 30px;
  color: #2400FF;
  position: relative;
  margin-left: 5px;
`;

const styles = ({
  searchInfo: {
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
    fontSize: 13,
    marginTop: 10,
    marginLeft: 10,
    color: '#555',
    width: '100%',
  },
  statusText: {
    fontSize: 13,
    color: '#555',
    maxWidth: '70%',
  },
  questionText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    margin: 20,
    marginBottom: 8,
  },
  traderText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#555',
    marginTop: 30,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 13,
    color: '#FFF',
    alignSelf: 'center',
    marginRight: 6,
  },
  button: {
    alignSelf: 'center',
    alignText: 'center',
    backgroundColor: '#2400FF',
    color: 'white',
    flexDirection: 'row',
    padding: 14,
    paddingBottom: 6,
    paddingTop: 6,
    borderRadius: 50,
  },
  moreInfo: {
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 12,
  },
  buttonTwo: {
    textAlign: 'center',
    backgroundColor: 'white',
    marginLeft: 'auto',
    marginRight: 12,
    height: 70,
    width: 400,
    marginBottom: 8,
  },
  notificationsButton: {
    alignSelf: 'flex-end',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'white',
    padding: '0',
    border: 'none',
  },
});

function TextbookDetails() {

  const navigate = useNavigate();
  const location = useLocation();
  const { textbook } = location.state;
  var { userId, username } = useContext(UserContext);

  if (!userId || userId === "no-userid") {
    try {
      userId = localStorage.getItem('user-id');
      username = localStorage.getItem('username');
    } catch {
      console.log('log in!');
    }
  }

  const [alert, setAlert] = useState(false);
  const [inProfile, setInProfile] = useState(false);
  const [messageableTraders, setMsgTraders] = useState([]);

  useEffect(() => {
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
      setMsgTraders(availableTraders.filter(a => a.id !== userId));
  
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

      console.log('get profile data!');
      console.log(availableTradersIds);
      console.log(userId);
    }
    getTextbookProfileData();
  }, [textbook, userId, alert, inProfile]);

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
    // await getTextbookProfileData();
  }

  async function handleProfileTextbookChange() {
    console.log('profile change!')
    console.log(userId);
    if (inProfile) {
      const usersTextbookIds = await getUserById(userId);
      let promises = [];
      usersTextbookIds.textbooks.forEach((textbookId) => {
        promises.push(getTextbookById(textbookId));
      });
      let usersTextbooks = await Promise.all(promises);
      let textbookIdToSell = usersTextbooks.filter(tb => 
        tb.course_number_code === textbook.courseId &&
        tb.dept[0] === textbook.deptName &&
        tb.name === textbook.name
      )[0].id;
      await deleteTextbook(textbookIdToSell, userId);
      setInProfile(!inProfile);
    } else {
      await createTextbook(textbook.name, textbook.deptName, textbook.courseId, userId, 250, "n/a");
      setInProfile(!inProfile);
    }
    // await getTextbookProfileData();
  }

  // async function handleMessage(person) {
  //   await createMessage(userId, person.id, userId,
  //     `Hey! I am interested in your textbook, "${textbook.name}." Let me know if it is still available!`,
  //     username.substring(0, username.indexOf('@')),
  //     person.email.substring(0, person.email.indexOf('@'))
  //   );
  //   navigation.navigate('Chat', { user2: person.id, user2Name: person.email.substring(0, person.email.indexOf('@')) });
  // }

  async function handleMessage(person) {
    await createMessage(userId, person.id, userId,
      `Hey! I am interested in your textbook, "${textbook.name}." Let me know if it is still available!`,
      username.substring(0, username.indexOf('@')),
      person.email.substring(0, person.email.indexOf('@'))
    );
    navigate('/Chat', { state: { user2: person.id, user2Name: person.email.substring(0, person.email.indexOf('@'))} });
  }

  return (
    <div style={styles.container}>
      <StyledRegisterLink to="/Search">Back to Search</StyledRegisterLink>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button style={styles.notificationsButton} onClick={() => handleAlert()}>
          {alert ?
            <NotificationsOffOutline
              style={{ alignSelf: 'flex-end', marginTop: 0, marginBottom: 0 }}
              placeIcon="right"
              placeSelf="right"
              color={'#00000'}
              height="50px"
              width="50px"
            /> :
            <NotificationsOutline
              style={{ alignSelf: 'flex-end', marginTop: 0, marginBottom: 0 }}
              placeIcon="right"
              placeSelf="right"
              color={'#00000'}
              height="50px"
              width="50px"
            />
          }
        </button>
      </div>
      <center>
        {/* <BookOutline style={styles.moreInfo} name="chevron-forward" size={20} color="#333" /> */}
        <p numberOfLines={3} style={{ fontSize: 26, marginTop: 0, textAlign: 'center' }}>
          {textbook.name}
        </p>
      </center>
      {messageableTraders.length === 0 &&
        <>
          <div style={{ flexDirection: 'row', marginTop: 10, textAlign: 'center', justifyContent: 'center' }}>
            Unavailable
            <EllipseOutline
              color={'#FFC300'}
              height="50px"
              width="50px"
            />
          </div>
          {inProfile ?
            <center>
              <p style={styles.questionText}>No longer have this textbook?</p>
              <button style={styles.button} onClick={() => handleProfileTextbookChange()}>
                <p style={styles.buttonText}>Remove from profile</p>
                <PersonRemoveOutline
                  color={'#FFF'}
                  height="20px"
                  width="20px"
                />
              </button>
            </center> :
            <center>
              <p style={styles.questionText}>Have this textbook?</p>
              <button style={styles.button} onClick={() => handleProfileTextbookChange()}>
                Add to profile
                <PersonAddOutline
                  color={'#FFF'}
                  height="20px"
                  width="20px"
                />
              </button>
            </center>
          }
        </>
      }
      {messageableTraders.length > 0 &&
        <>
          <div style={{ flexDirection: 'row', marginTop: 10, textAlign: 'center' }}>
            Available
            <EllipseOutline
              color={'#0FFF50'}
              height="20px"
              width="20px"
            />
          </div>
          {inProfile ?
            <>
              <p style={styles.questionText}>No longer have this textbook?</p>
              <button style={styles.button} onClick={() => handleProfileTextbookChange()}>
                <p style={styles.buttonText}>Remove from profile</p>
                <PersonRemoveOutline
                  color={'#FFF'}
                  height="50px"
                  width="50px"
                />
              </button>
            </> :
            <>
              <p style={styles.questionText}>Have this textbook?</p>
              <div>
                <center>
                  <button style={styles.button} onClick={() => handleProfileTextbookChange()}>
                    Add to profile
                    <PersonAddOutline
                      color={'#FFF'}
                      height="20px"
                      width="50px"
                    />
                  </button>
                </center>
              </div>
            </>
          }
          <p style={styles.traderText}>Available traders:</p>
          <div styles={{ height: '500px', width: '500px', overflowY: 'scroll' }} style={styles.wrapperDiv}>
            <>
              {messageableTraders.map((person) =>
                <div>
                  <center>
                    <button style={styles.buttonTwo} onClick={() => handleMessage(person)} key={person.id}>
                      <div style={styles.resultView}>
                        {person.email.substring(0, person.email.indexOf('@'))}
                        <ChatbubbleOutline
                          color={'#2400FF'}
                          height="20px"
                          width="20px"
                          marginLeft="20px"
                        />
                      </div>
                    </button>
                  </center>
                </div>
              )}
            </>
          </div>
        </>
      }
    </div>
  );
}

export default TextbookDetails;