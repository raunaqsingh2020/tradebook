import { React, useState, useEffect, useContext } from 'react';
//import ActivityIndicator from 'react-activity-indicator'
import SearchBar  from "material-ui-search-bar";
import './Search.css'
//import TouchableOpacity from 'react-native-web';
import { UserContext } from '../App'
import { BookOutline } from 'react-ionicons';
import { SadOutline } from 'react-ionicons';
import Navbar from './Navbar';
import {getAllTextbooks, getUserById, createTextbook} from '../modules/api'
import { ChevronForwardOutline } from 'react-ionicons';
import { useNavigate } from "react-router-dom";

const styles = ({
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
    alignSelf: 'center',
    borderRadius: 16,
    borderColor: '#000',
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: 500,
  },
  resultView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    //width: 'max(300px, 60%)'
  },
  textbookName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
    color: '#555',
    //width: '100%',
  },
  className: {
    //fontFamily: 'Poppins_400Regular',
    alignSelf: 'center',
    fontSize: 15,
    marginTop: 5,
    //marginLeft: 10, 
    marginBottom: 8,
    color: '#555',
    //maxWidth: '70%',
  },
  moreInfo: {
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 12,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'white',
    marginLeft: 'auto',
    marginRight: 12,
    height: 150,
    width: 1000,
    //marginBottom: 8,
    //borderRadius: 16,
    borderWidth: 1,
    border: 'solid',
    borderColor: '#ddd',  
    // overflow: 'hidden',
    maxHeight: 350
  },
});

function Tradebooks() {

  const searchIgnoreParams = ["availability"];
  const { userId } = useContext(UserContext);

  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [dept, setDept] = useState([])
  const [name, setName] = useState("")
  const [click, setClick] = useState(false)
  const [course_number_code, setCourse] = useState("")

  let navigate = useNavigate(); 
  function handleTextbookDetail(textbook) {
    navigate('/TextbookDetails', { state: { textbook } });
  }

  const handleChange = (value) => {
    setSearch(value);
    filterData(value);
  };

  useEffect(() => {
    async function fetchData () {
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
      setData(dataList);
      setAllData(dataList); 
    }
    fetchData();
  }, [click])

  async function addTextbook() { 
    await createTextbook(name, dept, course_number_code, userId, 100, "N/A")
    setClick(false)
  }

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

    return (
        <>
        <Navbar/>
        <div style={styles.container}>
            <center>
              <p style={{ fontFamily: 'Poppins_700Bold', fontSize: 26, marginTop: 0 }}>Find your tradebooks.</p>
            </center>
            <div style={{ padding: '30px' }}>
              <SearchBar
                placeholder="ECON 101"
                onChange={handleChange}
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
            </div>
            <div styles={{ height: '500px', width: '500px', overflowY: 'scroll' }}>
                {data.map((d) =>
                  <div>
                    <center>
                        <button style={styles.button} onClick={() => handleTextbookDetail(d)}>
                          <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            margin: "10px 0 20px 0",
                            padding: "30px",
                          }}>
                            <div> 
                              <p style={styles.textbookName} numberOfLines={2}>{d.name}</p>
                              <p style={styles.className} numberOfLines={1}>{d.course}</p>
                            </div> 
                            <ChevronForwardOutline
                              color={'#00000'} 
                              height="50px"
                              width="50px"
                            />
                          </div>
                        </button>
                    </center>
                  </div>
                )}
            </div>
            {!search &&
              <>
                <p style={styles.searchInfo}>Search by textbook name, course ID, or course title!</p>
                <div style={styles.iconContainer}>
                  <center>
                    <BookOutline 
                      color={'#2400FF'}
                      height="150px"
                      width="150px"
                    />
                  </center>
                </div>
              </> 
            }
            {(search !== '' && data.length === 0) &&
              <>
                <p style={styles.searchInfo}>No results found.</p>
                <div style={styles.iconContainer}>
                  <SadOutline
                    color={'#DDD'} 
                    height="150px"
                    width="150px"
                  />
                </div>
              </> 
            }
            <button className="buttonAdd" onClick={() => { setClick(true)}}>
              <p>Add a textbook</p>
            </button>
            {click ? 
            <div className="add_window">
              <form>
                <input placeholder="Name" required="" type="text" onChange={(e) => {setName(e.target.value)}}/>
                <input name="Dept" placeholder="Department (e.g. MATH)" onChange={(e) => {setDept([e.target.value.toUpperCase()])}}/>
                <input name="Course_Number_Code" placeholder="Course Code (e.g 104)" type="number" onChange={(e) => {setCourse(e.target.value)}}/>
                <button type="button" onClick={async () => { 
                  await addTextbook();
                }}>Add Textbook</button>
              </form>
            </div> : null}
        </div>
        </>
    );
  }

export default Tradebooks;