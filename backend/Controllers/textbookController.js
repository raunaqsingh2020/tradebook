const userController = require('./userController')
const authController = require('./authController')
const Textbook = require('../Model/textbookModel')
const User = require('../Model/userModel')
let ObjectId = require('mongoose').Types.ObjectId;


const errRes = (res, status, message, err) => {
    console.log(err);
    return res.status(status).json({
      status: "error",
      error: err,
      message: message,
    });
  };

  exports.groupTextbooks = async (req, res, next) => { 
    try { 
      let grouping = await Textbook.aggregate([
          {
              '$group': {
                  '_id': {
                      'textbookName': '$name', 
                      'textbookDept': '$dept', 
                      'textbookCourseCode': '$course_number_code'
                  }, 
                  'users': {
                      '$addToSet': '$user'
                  }
              }
          }
        ])
      res.status(200).json({
        data: grouping,
        message: 'succcess'
      })
} catch (err) { 
  errRes(res, 400, "cannot group", err)
}
 }

  exports.updateMarketPrice = async (req, res, next) => { 
    try { 
    let query = { $or: [ 
      {_id: req.query.id},
      {name: req.query.name}, 
      {$and: [{dept: [req.query.dept]}, {course_number_code: req.query.course_number_code ? req.query.course_number_code*1 : req.query.course_number_code}] } ]}
    let textbook = await Textbook.updateMany(query, {marketPrice: req.body.marketPrice}, {new: true})
      return res.status(200).json({
        message: "succesfull update",
        data: textbook
      })
    } catch (err) { 
      errRes(res, 400, "error in updating marketPrice", err)
    }
  }


  //Must be logged in to create a textbook (C ka CRUD)
  exports.createTextbook = async (req, res, next) => {
    let user = await User.findById(req.body.userId)
    if (!user) return  errRes(res, 400, "Could not create since user not logged in or existing", null);
    // req.user; //comes from auth controller
    try {
    //Check if textbook is already existing 
      req.body.name  = req.body.name ? req.body.name.toLowerCase() : null
      Array.from(req.body.dept).forEach(dept => { 
        dept.toLowerCase()
      })
      let obj = {...req.body}
      if (!obj.name || !obj.dept || !obj.course_number_code || !obj.userId || !obj.price) { 
        return errRes(res, 400, "Forgot to include necessary elements in body", null)
      }
      // delete obj.price
        // delete obj.note
        obj.user = obj.userId
        delete obj.userId
        newTextbook = await Textbook.create(obj);
    //   const existing = await Textbook.findOne(
    //       { $or: [ 
    //           {name: req.body.name}, 
    //           {$and: [{dept: req.body.dept}, {course_number_code: req.body.course_number_code}] }
    //    ]})
    //   let newTextbook;
    //   if (existing) { 
    //       let users = existing.users;
    //       if (users) { 
    //           users.push({user: user._id, price: req.body.price, note: req.body.note})
    //       } else { 
    //           users = []
    //           users.push({user: user._id, price: req.body.price, note: req.body.note})
    //       }
    //     newTextbook = await Textbook.findByIdAndUpdate(existing._id, {users}, {new: true})
    //   } else { 
    //     req.body.users = []
    //     req.body.users.push({user: user._id, price: req.body.price, note: req.body.note})
    //     let obj = {...req.body}
    //     delete obj.price
    //     delete obj.note
    //     delete obj.userId
    //     newTextbook = await Textbook.create(obj);
    //   }
    // //   USER UPDATE
      let textbooks = user.textbooks ? user.textbooks : []
    //   if (checkIncludes(textbooks, newTextbook._id)) { 
    //     return res.status(200).json({
    //       status: "success",
    //       data: newTextbook,
    //       user_same: user
    //     });
    //   }
      textbooks.push(newTextbook._id)
      const dummy = await User.findByIdAndUpdate(user._id, {textbooks: textbooks}, {new: true})
      // console.log(newTextbook);
      return res.status(200).json({
        status: "success",
        data: newTextbook,
        user_new: dummy
      });
    } catch (err) {
      errRes(res, 404, "Textbook could not be created", err);
    }
  };

  // checkIncludes = (arr, element) => { 
  //   console.log(arr, element)
  //   let truth = false
  //   Array.from(arr).forEach(e => { 
  //     console.log(e, element, e.equals(element))
  //     if (e.equals(element)) { 
  //       console.log("I'M HEREE")
  //       truth = true
  //     }
  //   })
  //   return truth
  // }


  exports.getTextbook = async (req, res, next) => {
    try {
    //Check if textbook is already existing 
      req.query.name  = req.query.name ? req.query.name.toLowerCase() : null
      // let textbookCheck = await Textbook.find({$and: [{dept: [req.query.dept]}, {course_number_code: req.query.course_number_code*1}] })
      // console.log(textbookCheck)
      const existing = await Textbook.find(
          { $or: [ 
              {_id: req.query.id},
              {name: req.query.name}, 
              {$and: [{dept: [req.query.dept]}, {course_number_code: req.query.course_number_code ? req.query.course_number_code*1 : req.query.course_number_code}] }
       ]})
      // console.log(existing)
      if (existing && Array.from(existing).length > 0) { 
        console.log(existing);
        return res.status(200).json({
            status: "success",
            data: existing
          });

      } else { 
          return res.status(404).json({
              status: 'error',
              message: "Could not find the requested book. Please ensure filters are correct."
          })
      }
          
   
    } catch (err) {
      errRes(res, 404, "Dish could not be created", err);
    }
  };


  exports.updateTextbook = async (req, res, next) => {
    try {  let id = req.body.id
      // let user = await User.findById(req.body.userId)
      //if (user.role === "admin") //??
      let obj = {...req.body}
      if (obj.marketPrice) { 
        obj.marketPrice = null
      }
      delete obj.id
      let updatedBook = await Textbook.findByIdAndUpdate(id, obj, {new: true});
      res.status(200).json({
          status: 'success',
          data: updatedBook
      })
    } catch (err) { 
      errRes(res, 400, "Error in updating book", err)
    }
  }

  exports.deleteTextbook = async (req, res, next) => {
    try { 
      console.log(req.body);
      let textbook = await Textbook.findById(req.body.id)
      console.log(textbook)
      // req.body.userId = textbook.user
      let user = await User.findById(req.body.userId) //error handle for if this doesnn't existing
      if (!user) return errRes(res, 400, "Could not be deleted since user not found", null);
      let textbooks = user.textbooks ? user.textbooks : [];
      let newTextbooks = []
      Array.from(textbooks).forEach(e => { 
          if (!e.equals(req.body.id)) { 
              newTextbooks.push(e)
          }
      })
        let updated = await User.findByIdAndUpdate(req.body.userId, {textbooks: newTextbooks}, {new: true})
        await Textbook.findByIdAndDelete(req.body.id)
        // let owners = textbook.users
        // let newUsers = []
        // Array.from(owners).forEach(e => { 
        //     if (e.user != user._id) { 
        //         newUsers.push(e)
        //     }
        // })
        // let newTextbook = await Textbook.findByIdAndUpdate(req.body.id, {users: newUsers}, {new: true})
        res.status(200).json({
            message: 'success', 
            newUser: updated
        })
    } catch(err) { 
      errRes(res, 404, "Could not be deleted", err);
    }
  };
