const api = require('./api');
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

let mock;
const rootURL = 'http://localhost:8081/api/v1';
const username = 'raunaq@gmail.com';
const userId = '62763c9ca8b638a6510fd9a3';
const user1 = '62763c9ca8b638a6510fd9a3';
const user2 = '626b39db608ef44eed0353ac';
const id = '1';
const name = 'steph';
const dept = 'MATH';
const code = '104';

beforeAll(() => {
    mock = new MockAdapter(axios);
});

test('registerAccount new account', async () => {
    mock.onPost(`${rootURL}/users/signup`).reply(201, {user:  {id: 1, email:'raunaq@gmail.com', password: 'test1234', passwordConfirm: 'test1234',
                                                        question: 'What is your favorite month?', answer: 'June'}});
    const response = await api.registerAccount({email: 'raunaq@gmail.com'});
    expect(response.user).toMatchObject({id: 1, email:'raunaq@gmail.com', password: 'test1234', passwordConfirm: 'test1234',
                                            question: 'What is your favorite month?', answer: 'June'});
});

test('registerAccount error', async () => {
    mock.onPost(`${rootURL}/users/signup`).networkError();
    const response = await api.registerAccount({email: 'raunaq@gmail.com'});
    expect(response).toBe('not registered');
});

test('authAccount account', async () => {
    mock.onPost(`${rootURL}/users/login`).reply(200, {data: {user: {id: 1, email:'raunaq@gmail.com', password: 'test1234'}}});
    const response = await api.authAccount('raunaq@gmail.com', 'test1234');
    expect(response.data.user).toMatchObject({id: 1, email:'raunaq@gmail.com', password: 'test1234'});
});

test('authAccount account error', async () => {
    mock.onPost(`${rootURL}/users/login`).reply(201, {user:  {id: 1, email:'raunaq@gmail.com', password: 'test1234'}});
    const response = await api.authAccount({email: 'raunaq@gmail.com'});
    expect(response).toBe('not authorized');
});

test('getUser user', async () => {
    mock.onGet(`${rootURL}/users/getUser?email=${username}`).reply(200, {data: {user: {id: 1, email:'raunaq@gmail.com'}}});
    const response = await api.getUser('raunaq@gmail.com');
    expect(response.data.user).toMatchObject({id: 1, email:'raunaq@gmail.com'});
});

test('getUser error', async () => {
    mock.onGet(`${rootURL}/users/getUser?email=${username}`).networkError();
    const response = await api.getUser('raunaq@gmail.com');
    expect(response).toBe('no user returned');
});

// test('getUserById userId', async () => {
//     mock.onGet(`${rootURL}/users/getUser?id=${userId}`).reply(200, {data: {user: {id: '62763c9ca8b638a6510fd9a3'}}});
//     const response = await api.getUserById('62763c9ca8b638a6510fd9a3');
//     console.log(response);
//     expect(response.data.user.id).toMatchObject({id: '62763c9ca8b638a6510fd9a3'});
// });

test('getUserById error', async () => {
    mock.onGet(`${rootURL}/users/getUser?id=${userId}`).networkError();
    const response = await api.getUserById('62763c9ca8b638a6510fd9a3');
    expect(response).toBe('no userId returned');
});

test('verifySecurityQuestion question', async () => {
    mock.onPost(`${rootURL}/users/verify`).reply(201, {data: {user: {answer: 'June', userId: '62763c9ca8b638a6510fd9a3'}}});
    const response = await api.verifySecurityQuestion('62763c9ca8b638a6510fd9a3', 'June');
    expect(response.data.user).toMatchObject({answer: 'June', userId: '62763c9ca8b638a6510fd9a3'});
});

test('verifySecurityQuestion error', async () => {
    mock.onPost(`${rootURL}/users/verify`).networkError();
    const response = await api.verifySecurityQuestion('62763c9ca8b638a6510fd9a3', 'June');
    expect(response).toBe('not verified');
});

test('updatePassword password', async () => {
    mock.onPatch(`${rootURL}/users/updatePasswordS`).reply(201, {data: {user: {answer: 'June',
        userId: '62763c9ca8b638a6510fd9a3',
        password: 'user1234',
        passwordConfirm: 'user1234'}}});
    const response = await api.updatePassword('June', '62763c9ca8b638a6510fd9a3', 'user1234');
    expect(response.data.user).toMatchObject({answer: 'June',
        userId: '62763c9ca8b638a6510fd9a3',
        password: 'user1234',
        passwordConfirm: 'user1234'});
});

test('createMessage message', async () => {
    mock.onPost(`${rootURL}/conversations/conversation`).reply(201, {data: {user: {user1: 'steph',
        user2: 'raunaq',
        sender: 'steph',
        message: 'hi',
        user1Name: 'raunaq1',
        user2Name: 'steph1'}}});
    const response = await api.createMessage('steph', 'raunaq', 'steph', 'hi', 'raunaq1', 'steph1');
    expect(response.data.user).toMatchObject({user1: 'steph',
    user2: 'raunaq',
    sender: 'steph',
    message: 'hi',
    user1Name: 'raunaq1',
    user2Name: 'steph1'});
});

test('getUsersConversations message', async () => {
    mock.onGet(`${rootURL}/conversations/conversations?user1=${userId}&userName1=${username}`).reply(200, {data: {user: {user1: 'steph',
        user2: 'raunaq'}}});
    const response = await api.getUsersConversations('62763c9ca8b638a6510fd9a3', 'raunaq@gmail.com');
    expect(response.data.user).toMatchObject({user1: 'steph', user2: 'raunaq'});
});

test('updatePassword password', async () => {
    mock.onPatch(`${rootURL}/users/updatePasswordS`).networkError();
    const response = await api.updatePassword('June', '62763c9ca8b638a6510fd9a3', 'user1234');
    expect(response).toBe('not updated');
});

test('addTrials trials', async () => {
    mock.onPatch(`${rootURL}/users/trials`).reply(201, {data: {user: {userId: '62763c9ca8b638a6510fd9a3'}}});
    const response = await api.addTrials('62763c9ca8b638a6510fd9a3');
    expect(response).toBe(true);
});

test('addTrials trials', async () => {
    mock.onPatch(`${rootURL}/users/trials`).networkError();
    const response = await api.addTrials('62763c9ca8b638a6510fd9a3');
    expect(response).toBe('not calculated');
});

// test('createTextbook textbook', async () => {
//     mock.onPost(`${rootURL}/textbooks/textbook`).reply(201, {data: {data: {
//         name: 'raunaq@gmail.com',
//         dept: 'MATH',
//         course_number_code: '104',
//         userId: '62763c9ca8b638a6510fd9a3',
//         price: '10',
//         note: 'test'
//     }}});
//     const response = await api.createTextbook('raunaq@gmail.com', 'MATH', '10', '62763c9ca8b638a6510fd9a3', '10', 'test');
//     expect(response.data.data).toMatchObject({name: 'raunaq@gmail.com',
//     dept: 'MATH',
//     course_number_code: '104',
//     userId: '62763c9ca8b638a6510fd9a3',
//     price: '10',
//     note: 'test'});
// });

test('createTextbook textbook', async () => {
    mock.onPost(`${rootURL}/textbooks/textbook`).networkError();
    const response = await api.createTextbook('raunaq@gmail.com', 'MATH', '10', '62763c9ca8b638a6510fd9a3', '10', 'test');
    expect(response).toBe('not created');
});

test('getTextbookById textbook', async () => {
    mock.onGet(`${rootURL}/textbooks/textbook?id=${id}`).networkError();
    const response = await api.getTextbookById('1');
    expect(response).toBe('no data');
});

test('getTextbookByName textbook', async () => {
    mock.onGet(`${rootURL}/textbooks/textbook?name=${name}`).networkError();
    const response = await api.getTextbookByName('1');
    expect(response).toBe('no data');
});

test('getTextbookByCourse textbook', async () => {
    mock.onGet(`${rootURL}/textbooks/textbook?dept=${dept}&course_number_code=${code}`).networkError();
    const response = await api.getTextbookByCourse('MATH', '104');
    expect(response).toBe('no data');
});

test('updateTextbook textbook', async () => {
    mock.onPatch(`${rootURL}/textbooks/textbook`).networkError();
    const response = await api.updateTextbook('MATH');
    expect(response).toBe('no data');
});

test('updateTextbookMP textbook', async () => {
    mock.onPatch(`${rootURL}/textbooks/textbook`).networkError();
    const response = await api.updateTextbook('MATH', '15');
    expect(response).toBe('no data');
});

test('deleteTextbook textbook', async () => {
    mock.onDelete(`${rootURL}/textbooks/textbook`).networkError();
    const response = await api.deleteTextbook('MATH', 'user123');
    expect(response).toBe('no data');
});

test('getAllTextbooks textbooks', async () => {
    mock.onDelete(`${rootURL}/textbooks/aggregate`).networkError();
    const response = await api.getAllTextbooks();
    expect(response).toBe('no data');
});

test('postNotification textbooks', async () => {
    mock.onPost(`${rootURL}/users/notifications`).networkError();
    const response = await api.postNotification('user1234', 'math', '104', 'MATH');
    expect(response).toBe('no data');
});

// test('getConversation conversation', async () => {
//     mock.onGet(`${rootURL}/conversations/conversation?user1=${user1}&user2=${user2}`).reply(201, {data: {data: {messages: {_id: '62783e148da8efeb7eb8898a'}}}});
//     const response = await api.getConversation('62763c9ca8b638a6510fd9a3', '626b39db608ef44eed0353ac');
//     expect(response.data.data.messages).toMatchObject({_id: '62783e148da8efeb7eb8898a'});
// });

test('getConversation error', async () => {
    mock.onGet(`${rootURL}/conversations/conversation?user1=${user1}&user2=${user2}`).networkError();
    const response = await api.getConversation('62763c9ca8b638a6510fd9a3', '626b39db608ef44eed0353ac');
    expect(response).toBe('could not get convo');
});

test('getUsersConversations error', async () => {
    mock.onGet(`${rootURL}/conversations/conversations?user1=${userId}&userName1=${username}`).networkError();
    const response = await api.getUsersConversations('userId', 'username');
    expect(response).toBe('could not get conversations');
});

test('createMessage error', async () => {
    mock.onPost(`${rootURL}/conversations/conversation`).networkError();
    const response = await api.createMessage('user1', 'user2');
    expect(response).toBe('could not create message');
});

test('deleteNotifications error', async () => {
    mock.onDelete(`${rootURL}/users/notifications`, { data: {
        userId: userId,
        index: 1,
    }}).networkError();
    const response = await api.deleteNotifications('userId', 1);
    expect(response).toBe('could not delete');
});

test('getNotification notifications', async () => {
    mock.onGet(`${rootURL}/users/notifications?id=${userId}`).reply(200, {data: {user: {user1: 'steph',
        user2: 'raunaq'}}});
    const response = await api.getNotification('62763c9ca8b638a6510fd9a3');
    expect(response.data.user).toMatchObject({user1: 'steph', user2: 'raunaq'});
});

test('getNotification error', async () => {
    mock.onGet(`${rootURL}/users/notifications?id=${userId}`).networkError();
    const response = await api.getNotification('1');
    expect(response).toBe('could not get notification');
});

