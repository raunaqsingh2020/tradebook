import axios from 'axios';
import socket from './socket'
// const rootURL = 'https://textbookbackend.herokuapp.com/api/v1';
const rootURL = 'http://localhost:8081/api/v1'

export async function authAccount(username, password) {
    try {
        const response = await axios.post(`${rootURL}/users/login`, {
            email: `${username}`,
            password: `${password}`,
        });
        socket.emit("addUser", { user: response.data.data.user._id });
        return response.data;
    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
    }
}

export async function getUser(username) {
    try {
        const response = await axios.get(`${rootURL}/users/getUser?email=${username}`);
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getUserById(userId) {
    try {
        const response = await axios.get(`${rootURL}/users/getUser?id=${userId}`);
        return response.data.user;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function verifySecurityQuestion(userId, answer) {
    try {
        const response = await axios.post(`${rootURL}/users/verify`, {
            answer: answer,
            userId: userId,
        });
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function updatePassword(answer, userId, password) {
    try {
        const response = await axios.patch(`${rootURL}/users/updatePasswordS`, {
            answer: answer,
            userId: userId,
            password: password,
            passwordConfirm: password,
        });
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function addTrials(userId) { //TO CHECK IG THEY EXCEED 3
    try {
        const response = await axios.patch(`${rootURL}/users/trials`, {
            userId: userId,
        });
        let allowed = true; 
        if (response.data.data.trials >= 3) { 
            allowed = false
        }
        return allowed //if allowed = false not allowed to reatteempt, else if allowed=true allowed. Needs to query for this prior to login.
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

// TEXTBOOK ROUTES
export async function createTextbook(name, dept, course_number_code, userId, price, note) { //NOTE DEPT SHOULD BE AN ARRAY OF ACCEPTABLE DEPTs
    try {
        const response = await axios.post(`${rootURL}/textbooks/textbook`, {
            "name": name,
            "dept": dept,
            "course_number_code": course_number_code, 
            "userId": userId,
            "price": price, 
            "note": note,
        });
        return response.data.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getTextbookById(id) { //NOTE DEPT SHOULD BE AN ARRAY OF ACCEPTABLE DEPTs
    try {
        const response = await axios.get(`${rootURL}/textbooks/textbook?id=${id}`)
        return response.data.data[0];
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getTextbookByName(name) { 
    try {
        const response = await axios.get(`${rootURL}/textbooks/textbook?name=${name}`)
        return response.data.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getTextbookByCourse(dept, code) { //DEPT ideally all caps 
    try {
        const response = await axios.get(`${rootURL}/textbooks/textbook?dept=${dept}&course_number_code=${code}`)
        return response.data.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function updateTextbook(updateBody) { //updateBody is of the form {id: , ...} where ... refers to the other textbook features we wish to update, i.e {id; ___, price: 500}
    try {
        const response = await axios.patch(`${rootURL}/textbooks/textbook`, updateBody)
        return response.data.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function updateTextbookMP(id, mp) { //developer function to update textbook market price all at once. DO NOT CALL. 
    try {
        const response = await axios.patch(`${rootURL}/textbooks/textbook`, {
            id: id,
            marketPrice: mp
        })
        return response.data.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function deleteTextbook(id, userId) { //developer function to update textbook market price all at once. DO NOT CALL. 
    try {
        const response = await axios.delete(`${rootURL}/textbooks/textbook`, { data: {
            id: id,
            userId: userId
        }})
        return response.data.newUser; //returns the newe User not really relevant
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getAllTextbooks() {
    try {
        const response = await axios.get(`${rootURL}/textbooks/aggregate`)
        return response.data.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

// NOTIFICATIONS 
export async function postNotification(userId, textbook_name, course_number_code, dept) { //IDEALLY ALL IN CAPS 
    try {
        const response = await axios.post(`${rootURL}/users/notifications`, {
            course_number_code: course_number_code,
            textbook_name: textbook_name,
            userId: userId,
            dept: dept
        })
        return response.data.notifications; 
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getNotification(userId) { //IDEALLY ALL IN CAPS 
    try {
        const response = await axios.get(`${rootURL}/users/notifications?id=${userId}`)
        return response.data; //returns the foundNotifications i.e what textbooks and  which index of the notification it corresponds to.. For a given course
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}


export async function deleteNotifications(userId, index) { //index of the notification you are trying to delete and the user who's notifications you are trying to delete
    try {
        const response = await axios.delete(`${rootURL}/users/notifications`, { data: {
            userId: userId,
            index: index,
        }});
        return response.data.notifications; //response.data.notifications will give you the leftover notifications 
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

// CHAT ROUTES
export async function createMessage(user1, user2, sender, message, user1Name, user2Name) {
    try {
        const response = await axios.post(`${rootURL}/conversations/conversation`, {
            user1,
            user2,
            sender,
            message,
            user1Name,
            user2Name
        });
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getUsersConversations(userId, username) {
    try {
        const response = await axios.get(`${rootURL}/conversations/conversations?user1=${userId}&userName1=${username}`);
        return response.data;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}

export async function getConversation(user1, user2) {
    try {
        const response = await axios.get(`${rootURL}/conversations/conversation?user1=${user1}&user2=${user2}`);
        console.log(response.data)
        return response.data.data.messages;
    } catch (err) {
        console.log(err.response.data)
        return err.response.data;
    }
}