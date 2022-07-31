import { React, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { LogOutOutline } from 'react-ionicons';
import { LibraryOutline } from 'react-ionicons';
import { PersonRemoveOutline } from 'react-ionicons';
import Navbar from './Navbar';
import { UserContext } from '../App'
import { deleteTextbook, getTextbookById, getUser } from '../modules/api';

const styles = ({
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
    // fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#444',
    width: '85%',
  },
  usernameText: {
    // fontFamily: 'Poppins_400Regular',
    fontSize: 24,
    color: '#333',
    maxWidth: '80%',
    marginTop: 10,
  },
  sectionText: {
    // fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    color: '#333',
    width: '86%',
    marginTop: 10,
  },
  emptyText: {
    // fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#555',
    width: '75%',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonText: {
    // fontFamily: 'Poppins_700Bold',
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
    color: 'white',
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
  removeButton: {
    backgroundColor: 'white',
    padding: '0',
    border: 'none',
  }
});

function Profile({ route, navigation }) {

  const navigate = useNavigate();

  //const { username, setAuthUsername, userId, setUserId } = useContext(UserContext);

  var { userId, username, setAuthUsername, setUserId } = useContext(UserContext);

  if (!userId || userId === "no-userid") {
    try {
      userId = localStorage.getItem('user-id');
      username = localStorage.getItem('username');
    } catch {
      console.log('log in!');
    }
  }

  // const list = [
  //   {id: 1, name: 'Differential Equations and Linear Algebra', courseId: '240', courseName: 'MATH', course: 'MATH 240', availability: [
  //     {id: 1, name: 'Aspen Koch'},
  //   ]},
  //   {id: 2, name: 'C: A Reference Manual', zzzcourseId: '240', courseName: 'CIS', course: 'CIS 240', availability: [
  //     {id: 2, name: 'Rubi Chambers'},
  //   ]},
  //   {id: 3,name: 'Introduction to Algorithms', courseId: '320', courseName: 'CIS', course: 'CIS 320', availability: [
  //     {id: 3, name: 'Nathaniel Craig'},
  //   ]},
  // ];

  const [myTextbooks, updateMyTextbooks] = useState([]);

  useEffect(() => {
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
    getUserTextbooks();
  }, [username])

  function handleLogOut() {
    setAuthUsername("not-authenticated");
    setUserId("no-userid");
    localStorage.setItem("user-id", "no-userid");
    localStorage.setItem("username", "not-authenticated");
    navigate('/', {});
  }

  async function handleRemoveTextbook(textbook) {
    // await updateTextbook({id: textbook.id, sold: true});
    console.log("REMOVING TEXTBOOK", textbook.id, userId);
    await deleteTextbook(textbook.id, userId);
    updateMyTextbooks(myTextbooks => myTextbooks.filter((book) => book.id !== textbook.id));
  }

  // function handleLogOut() {
  //   console.log("logging out...");
  // }

  // function handleRemoveTextbook(textbook) {
  //   updateMyTextbooks(myTextbooks => myTextbooks.filter((book) => book.id !== textbook.id));
  // }

  return (
    <>
      <Navbar />
      <center>
        <div style={{ maxWidth: "700px", margin: "50px auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            margin: "10px 0 20px 0",
            // borderBottom: "1px solid grey",
            padding: "30px",
          }}>
            <img alt="avatar" style={{ width: "160px", height: "160px", borderRadius: "80px" }} src="https://i.imgur.com/kQirypY.png" />
            <div>
              <h2 style={{ fontFamily: 'Poppins', fontWeight: '600' }}>{username.substring(0, username.indexOf('@'))}</h2>
              <button style={styles.button} onClick={handleLogOut}>
                Log out
                <LogOutOutline
                  marginLeft="10px"
                  color={'#FFF'}
                  height="30px"
                  width="30px"
                />
              </button>
              <h6 style={{ fontFamily: 'Poppins', fontWeight: '500' }}>Textbooks Available: {myTextbooks.length}</h6>
            </div>
          </div>

          <h4 style={{ fontFamily: 'Poppins', fontWeight: '600' }}>My textbooks</h4>

          <div style={styles.container}>
            {/* <p adjustsFontSizeToFit={true} numberOfLines={1} style={styles.usernameText}>{username}</p> */}
            <div style={{ backgroundColor: '#333', height: 1, width: '86%', marginBottom: 16, marginTop: 3 }} />
            {myTextbooks.length == 0 &&
              <>
                <LibraryOutline
                  color={'#2400FFC0'}
                  height="85px"
                  width="85px"
                />
                <p style={styles.emptyText}>No textbooks in your profile.</p>
              </>
            }
            {myTextbooks.length > 0 &&
              <div styles={{ height: '500px', width: '500px', overflowY: 'scroll' }} style={styles.wrapperDiv}>
                {myTextbooks.map((textbook) =>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px 0 20px 0",
                    // borderBottom: "1px solid grey",
                    padding: "30px",
                  }}>
                    <div style={styles.resultView} key={textbook.name}>
                      {textbook.name}
                    </div>
                    <div>
                      <button style={styles.removeButton} onClick={() => handleRemoveTextbook(textbook)}>
                        <PersonRemoveOutline
                          color={'#2400FF'}
                          height="30px"
                          width="30px"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            }
          </div>
        </div>
      </center>
    </>
  );
}

export default Profile;