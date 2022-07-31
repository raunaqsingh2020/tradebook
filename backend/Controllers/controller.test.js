/* eslint-disable no-underscore-dangle */
// import supertest
const request = require('supertest');
const mongoose = require('mongoose');
// const jest = require('jest')
require('dotenv').config();
// import our web app
const webapp = require('../server');

beforeAll(async () => {
  webapp.listen();
  await mongoose.connect('mongodb+srv://mahtanir:pWFaUl2Xbq6e2Ow8@cluster0.hf1nh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
  jest.setTimeout(3 * 60 * 1000);
});

//AUTH CONTROLLER TESTS
describe('POST /login and signup and updatee Password', () => {
  test('ensuring login works', async () => {
    let email = `lol${Math.random()*Math.random()}${Math.random()*Math.random()}${Math.random() * Math.random()}${Math.random()*Math.random()}@gmail.com`
    const response_signup = await request(webapp).post('/api/v1/users/signup').send({
      "email" : email,
      "password": "password",
      "passwordConfirm": "password",
      "question": "yolo",
      "answer": "lol"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.data.newUser.email).toBe(email);
    expect(response_signup._body.data.newUser.password).toBeUndefined();
    const response = await request(webapp).post('/api/v1/users/login').send({
      "email":email,
      "password": "password"
  }).catch((err) => console.log(err));
    expect(response._body.data.user.email).toBe(email);
 
  const response_1 = await request(webapp).post('/api/v1/users/login').send({
    "email":email,
    "password": "password_new"
}).catch((err) => console.log(err));
  expect(response_1._body.message).toBe("Incorrect email or password");

  const response_2 = await request(webapp).post('/api/v1/users/login').send({
    "email":email
}).catch((err) => console.log(err));
  expect(response_2._body.message).toBe("Please provide email and password");

  const response_3 = await request(webapp).patch('/api/v1/users/updatePassword').send({
    "userId": response_signup._body.data.newUser.id,
    "currentPassword": "password",
    "password": "password_new",
    "passwordConfirm": "password_new"
}).catch((err) => console.log(err));
  expect(response_3._body.data.user.email).toBe(email);

  const response_4 = await request(webapp).patch('/api/v1/users/updatePassword').send({
    "userId": response_signup._body.data.newUser.id,
    "currentPassword": "wrong_pass",
    "password": "password_new",
    "passwordConfirm": "password_new"
}).catch((err) => console.log(err));
  expect(response_4._body.message).toBe("Your existing password is incorrect");
});
});

describe('POST /incorrect signup', () => {
  test('ensuring incorrect signup works', async () => {
    
    const response_signup = await request(webapp).post('/api/v1/users/signup').send({
      "userId": "6277063de0e30a6ad3defea9"
    }).catch((err) => console.log(err));
    expect(response_signup._body.status).toBe("error");
  });
});

describe('POST /addTrial', () => {
  test('ensuring addTrial works', async () => {
    const response_signup = await request(webapp).patch('/api/v1/users/trials').send({
      "userId": "6277063de0e30a6ad3defea9"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.data.trials).toBeGreaterThanOrEqual(1);
  });
});

describe('POST /addTrial', () => {
  test('ensuring addTrial works', async () => {
    const response_signup = await request(webapp).patch('/api/v1/users/trials').send({
      "userId": "sdjasodnaosdn"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("could not update trials");
  });
});

describe('POST /verify security question', () => {
  test('ensuring verify Security Question works', async () => {
    const response_signup = await request(webapp).post('/api/v1/users/verify').send({
      "answer": "yes",
      "userId": "62773d5fe09b1e13c9dfbb7e"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("correct security question answer");
  });
});

describe('POST /verify security question', () => {
  test('ensuring verify Security Question works', async () => {
    const response_signup = await request(webapp).post('/api/v1/users/verify').send({
      "answer": "no",
      "userId": "62773d5fe09b1e13c9dfbb7e"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("incorrect security question answer");
  });
});

describe('POST /verify security question', () => {
  test('ensuring verify Security Question works', async () => {
    const response_signup = await request(webapp).post('/api/v1/users/verify').send({
      "answer": "no"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("Not authorised");
  });
});

// TEXTBOOK CONTROLLER TESTS

describe('POST /create textbook', () => {
  test('ensuring create textbook works', async () => {
    const response_signup = await request(webapp).post('/api/v1/textbooks/textbook').send({
      "name": "Foundations for Mathematics Calculus", 
      "dept": ["MATH"],
      "course_number_code": "104", 
      "userId": "626b39db608ef44eed0353ac",
      "price": 250, 
      "note": "No pages damaged"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("success");
  });
});

describe('POST /create textbook', () => {
  test('ensuring create textbook doesnt work', async () => {
    const response_signup = await request(webapp).post('/api/v1/textbooks/textbook').send({
      "name": "Foundations for Mathematics Calculus", 
      "dept": ["MATH"],
      "userId": "626b39db608ef44eed0353ac",
      "price": 250, 
      "note": "No pages damaged"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('GET /get textbook', () => {
  test('ensuring get textbook works', async () => {
    const response_signup = await request(webapp).get('/api/v1/textbooks/textbook?id=6276341736031b95371f750a').catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('GET /get textbook', () => {
  test('ensuring get textbook works', async () => {
    const response_signup = await request(webapp).get('/api/v1/textbooks/textbook?id=62790998d17b97af4933f08f').catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("success");
  });
});

describe('DELETE /delete textbook', () => {
  test('ensuring delete textbook works', async () => {
    const response_signup = await request(webapp).post('/api/v1/textbooks/textbook').send({
      "name": "Foundations for Mathematics Calculus", 
      "dept": ["MATH"],
      "course_number_code": "104", 
      "userId": "626b39db608ef44eed0353ac",
      "price": 250, 
      "note": "No pages damaged"
    }).catch((err) => console.log(err));
    const response_signup2 = await request(webapp).delete('/api/v1/textbooks/textbook').send({
      "id": response_signup._body.data.id,
      userId: "626b39db608ef44eed0353ac"
    }).catch((err) => console.log(err));
    console.log(response_signup2._body)
    expect(response_signup2._body.message).toBe("success");
  });
});


describe('DELETE /delete textbook', () => {
  test('ensuring delete textbook works', async () => {
    const response_signup = await request(webapp).delete('/api/v1/textbooks/textbook').send({
      "id": "garbage"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('PATCH /update textbook', () => {
  test('ensuring update textbook works', async () => {
    const response_signup = await request(webapp).patch('/api/v1/textbooks/textbook').send({
      "dept": "MATH",
      "course_number_code": 104
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("success");
  });
});

describe('PATCH /update textbook price', () => {
  test('ensuring update textbook price works', async () => {
    const response_signup = await request(webapp).patch('/api/v1/textbooks/textbook').send({
      "id": "6276341736031b95371f750a",
      "marketPrice": 500
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("success");
  });
});

// USER CONTROLLER TESTS

describe('POST /create notification', () => {
  test('ensuring create notification works', async () => {
    const response_signup = await request(webapp).post('/api/v1/users/notifications').send({
      "course_number_code":  104,
      "dept": "MATH",
      "userId": "626b39db608ef44eed0353ac",
      "textbook_name": "hghgh"
  }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("success");
  });
});

describe('POST /create notification', () => {
  test('ensuring create notification works', async () => {
    const response_signup = await request(webapp).post('/api/v1/users/notifications').send({
      "course_number_code":  104,
      "dept": "MATH",
      "userId": "hghgh",
      "textbook_name": "hghgh"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

// describe('POST /create notification', () => {
//   test('ensuring create notification works', async () => {
//     const response_signup = await request(webapp).post('/api/v1/users/notifications').send({
//       "userId": "garbage1034072",
//       "course_number_code":  104,
//       "dept": "MATH"
//     }).catch((err) => console.log(err));
//     console.log(response_signup._body)
//     expect(response_signup._body.status).toBe("error");
//   });
// });

describe('DELETE /delete notification', () => {
  test('ensuring delete notification works', async () => {
    const response_signup = await request(webapp).delete('/api/v1/users/notifications').send({
      "userId": "62763c9ca8b638a6510fd9a3",
      "index":  0
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("success");
  });
});

describe('DELETE /delete notification', () => {
  test('ensuring delete notification works', async () => {
    const response_signup = await request(webapp).delete('/api/v1/users/notifications').send({
      "index":  0
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('DELETE /delete notification', () => {
  test('ensuring delete notification works', async () => {
    const response_signup = await request(webapp).delete('/api/v1/users/notifications').send({
      "userId": "garbage0101010",
      "index":  0
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('GET /get notifications', () => {
  test('ensuring get notifications works', async () => {
    const response_signup = await request(webapp).get('/api/v1/users/notifications?id=62763c9ca8b638a6510fd9a3&dept=MATH&course_number_code=104').send({
      "id": "62763c9ca8b638a6510fd9a3",
      "dept": "MATH",
      "course_number_code": 104,
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("success");
  });
});

describe('GET /get notifications', () => {
  test('ensuring get notifications works', async () => {
    const response_signup = await request(webapp).get('/api/v1/users/notifications?dept=MATH&course_number_code=104').send({
      "dept": "MATH",
      "course_number_code": "104",
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('GET /get notifications', () => {
  test('ensuring get notifications works', async () => {
    const response_signup = await request(webapp).get('/api/v1/users/notifications?dept=MATH&course_number_code=104&id=garbage101010').send({
      "id": "garbage10101010",
      "dept": "MATH",
      "course_number_code": 104,
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('GET /get user', () => {
  test('ensuring get user works', async () => {
    const response_signup = await request(webapp).get('/api/v1/users/getUser?email=ranbir@gmail.com').send({
      "email": "ranbir@gmail.com"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.message).toBe("success found the user");
  });
});

describe('PATCH /update password security', () => {
  test('ensuring update password security works', async () => {
    const response_signup = await request(webapp).patch('/api/v1/users/updatePasswordS').send({
      "answer": "yes",
      "userId": "626b39db608ef44eed0353ac",
      "password": "password_new",
      "passwordConfirm": "password_new"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('PATCH /update password security', () => {
  test('ensuring update password security works', async () => {
    const response_signup = await request(webapp).patch('/api/v1/users/updatePasswordS').send({
      "answer": "yes",
      "userId": "6277063de0e30a6ad3defea9",
      "password": "password_new",
      "passwordConfirm": "password_new"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("success");
  });
});

// CONVERSATION CONTROLLER TESTS

describe('POST /create conversation', () => {
  test('ensuring create conversation works', async () => {
    const response_signup = await request(webapp).post('/api/v1/conversations/conversation').send({
      "user1":  "62763c9ca8b638a6510fd9a3",
      "user2": "626b39db608ef44eed0353ac",
      "sender": "true",
      "message": "hello",
      "user1Name": "bob",
      "user2Name": "alice"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("success");
  });
});

describe('GET /get convos', () => {
  test('ensuring get convos works', async () => {
    const response_signup = await request(webapp).get('/api/v1/conversations/conversations?user1=62763c9ca8b638a6510fd9a3').send({
      "user1": "62763c9ca8b638a6510fd9a3"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("success");
  });
});

describe('GET /get convo', () => {
  test('ensuring get convo works', async () => {
    const response_signup = await request(webapp).get('/api/v1/conversations/conversation?user1=62763c9ca8b638a6510fd9a3&user2=626b39db608ef44eed0353ac').send({
      "user1": "62763c9ca8b638a6510fd9a3",
      "user2": "626b39db608ef44eed0353ac"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("Success. Conversation retrieved.");
  });
});

describe('GET /get convo', () => {
  test('ensuring get convo works', async () => {
    const response_signup = await request(webapp).get('/api/v1/conversations/conversation?user1=asd&user2=asdasfas').send({
      "user1": "asdf",
      "user2": "asdasd"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('GET /get convo', () => {
  test('ensuring get convo works', async () => {
    const response_signup = await request(webapp).get('/api/v1/conversations/conversation?user1=asd&user2=asdasfas').send({
      "user1": "asdf",
      "user2": "asdasd"
    }).catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.status).toBe("error");
  });
});

describe('GET /analytics test', () => {
  test('ensuring analytics route', async () => {
    const response_signup = await request(webapp).get('/api/v1/users/stat').catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.soldPercentage).toBeGreaterThanOrEqual(0)
  });
});

describe('GET /aggregate test', () => {
  test('ensuring aggregate route', async () => {
    const response_signup = await request(webapp).get('/api/v1/textbooks/aggregate').catch((err) => console.log(err));
    console.log(response_signup._body)
    expect(response_signup._body.data.length).toBeGreaterThanOrEqual(3)
  });
});

// describe('POST /user', () => {
//   describe('given a username', () => {
//     test('should respond with a 201 status code if user is new else 200', async () => {
//       // await request(webapp).get('/user?username=username').catch((err) => console.log(err));
//       // console.log(response0)
//       const response = await request(webapp).post('/user').send({
//         username: 'username',
//       }).catch((err) => console.log(err));
//       if (response.statusCode === 200) {
//         expect(response._body.message).toBe('user succesfully logged in');
//       } else if (response.statusCode === 201) {
//         expect(response._body.message).toBe('user succesfully created');
//       }
//       expect(response._body.data.username).toBe('username');
//       expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     });
//   });
//   describe('when the username is missing', () => {
//     test('should respond with a status code of 400', async () => {
//       const response = await request(webapp).post('/user').send({}).catch((err) => console.log(err));
//       expect(response.statusCode).toBe(400);
//       expect(response._body.message).toBe('Bad request; username not provided.');
//     });
//   });
// });

// describe('PATCH /user', () => {
//   describe('given a username', () => {
//     test('should respond with a 200 status code', async () => {
//       const response = await request(webapp).patch('/user').send({
//         username: 'username',
//         role: 'admin',
//       }).catch((err) => console.log(err));
//       expect(response.statusCode).toBe(200);
//       expect(response._body.data.role).toBe('admin');
//       expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     });
//   });
// });

// describe('DELETE /user', () => {
//   describe('given a username', () => {
//     test('should respond with a 200 status code', async () => {
//       const dummy = await request(webapp).post('/user').send({
//         username: 'uasap',
//       }).catch((err) => console.log(err));
//       const response = await request(webapp).delete('/user').send({ username: dummy._body.data.username }).catch((err) => console.log(err));
//       expect(response.statusCode).toBe(200);
//       expect(response._body.message).toBe('user succesfully deleted');
//       expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     });
//   });
//   describe('when the username is missing', () => {
//     test('should respond with a status code of 400', async () => {
//       const response = await request(webapp).delete('/user').send({}).catch((err) => console.log(err));
//       expect(response.statusCode).toBe(400);
//       expect(response._body.message).toBe('Bad request; username not provided.');
//     });
//   });
// });

// describe('GET /user', () => {
//   describe('given a username', () => {
//     test('should respond with a 200 status code', async () => {
//       const response = await request(webapp).get('/user?username=username').catch((err) => console.log(err));
//       expect(response.statusCode).toBe(200);
//       expect(response._body.data[0].username).toBe('username');
//       expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     });
//   });
//   describe('when the username is non existing', () => {
//     test('should respond with a status code of 404', async () => {
//       const response = await request(webapp).get('/user?username=dhfiuwhgi').catch((err) => console.log(err));
//       expect(response.statusCode).toBe(404);
//     });
//   });
// });

// describe('GET /userOne', () => {
//   describe('given a username', () => {
//     test('should respond with a 200 status code', async () => {
//       const response = await request(webapp).get('/userOne?username=username').catch((err) => console.log(err));
//       expect(response.statusCode).toBe(200);
//       expect(response._body.data.username).toBe('username');
//       expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     });
//   });
//   describe('when the username is non existing', () => {
//     test('should respond with a status code of 404', async () => {
//       const response = await request(webapp).get('/user?username=dhfiuwhgi').catch((err) => console.log(err));
//       expect(response.statusCode).toBe(404);
//     });
//   });
// });

// describe('POST /celebrity', () => {
//   test('should respond with a 201 status code', async () => {
//     const response = await request(webapp).post('/celebrities').send({
//       photo: 'https://media.gq.com/photos/57b752fa1890ff58025997d1/16:9/w_2560%2Cc_limit/klay-thompson-gq-01.jpg',
//       name: 'Klay Thompson',
//       difficulty: 'easy',
//     }).catch((err) => console.log(err));
//     expect(response.statusCode).toBe(201);
//     expect(response._body.message).toBe('succeess');
//     expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//   });
// });

// describe('GET /questions', () => {
//   describe('given a username', () => {
//     test('should respond with a 200 status code', async () => {
//       // let promises = []
//       // for (let i =0; i < 4;i++) {
//       //     promises.push({
//       //     "photo": "https://media.gq.com/photos/57b752fa1890ff58025997d1/16:9/w_2560%2Cc_limit/klay-thompson-gq-01.jpg",
//       //     "name": `Klay Thompson_${i}`,
//       //     "difficulty": "easy"})
//       // }
//       // await Promise.all(promises)
//       const response = await request(webapp).get('/questions').catch((err) => console.log(err));
//       expect(response.statusCode).toBe(200);
//       expect(response._body.data.length).toBeGreaterThanOrEqual(5);
//       expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     });
//   });
// });

// describe('GET /question', () => {
//   describe('given a username', () => {
//     test('should respond with a 200 status code', async () => {
//       const response = await request(webapp).get('/question').catch((err) => console.log(err));
//       expect(response.statusCode).toBe(200);
//       expect(response._body.data.length).toBe(4);
//       expect(response._body.answer).toBeDefined();
//       expect(response._body.answer).toBeLessThan(4);
//       expect(response._body.answer).toBeGreaterThanOrEqual(0);
//       expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//     });
//   });
// });

// describe('PATCH /celebrity', () => {
//   test('should respond with a 200 status code', async () => {
//     const response = await request(webapp).patch('/celebrities').send({
//       id: '625c73236a9e5832e4a42c07',
//       photo: 'https://media.gq.com/photos/57b752fa1890ff58025997d1/16:9/w_2560%2Cc_limit/klay-thompson-gq-01.jpg',
//       name: 'yolo',
//       difficulty: 'easy',
//     }).catch((err) => console.log(err));
//     expect(response.statusCode).toBe(200);
//     expect(response._body.message).toBe('succeess');
//     expect(response._body.data.name).toBe('yolo');
//     expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//   });
// });

// describe('DELETE /celebrity', () => {
//   test('should respond with a 200 status code', async () => {
//     const celebret = await request(webapp).post('/celebrities').send({
//       photo: 'https://media.gq.com/photos/57b752fa1890ff58025997d1/16:9/w_2560%2Cc_limit/klay-thompson-gq-01.jpg',
//       name: 'Klay Thompson',
//       difficulty: 'easy',
//     });
//     console.log('celebrity 1', celebret._body.data);
//     const response = await request(webapp).delete('/celebrities').send({ id: celebret._body.data._id }).catch((err) => console.log(err));
//     expect(response.statusCode).toBe(200);
//     expect(response._body.message).toBe('succeess');
//     const celebro = await request(webapp).get(`/oneCeleb?id=${celebret._body.data._id}`);
//     console.log('celebrity 1', celebro._body.data);
//     expect(celebro._body.data).toBeUndefined();
//     expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
//   });
// });
