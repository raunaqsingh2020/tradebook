const userController = require('./userController')
const authController = require('./authController')
const Textbook = require('../Model/textbookModel')
const User = require('../Model/userModel')


const errRes = (res, status, message, err) => {
    console.log(err);
    return res.status(status).json({
      status: "error",
      error: err,
      message: message,
    });
  };

exports.createNotification = async (req, res, next) => {
    let dept = req.body.dept;
    let course_number_code = req.body.course_number_code;
    let textbook_name = req.body.textbook_name.toLowerCase();
    let user_id = req.body.userId;
    if (!course_number_code || !dept || !user_id) { 
        return errRes(res, 400, "Need to input user id, dept, course code, and textbook name", null)
    }
    try { 
        let user = await User.findById(user_id)
        console.log(user)
        let notifications = Array.from(user.notifications)
        notifications.unshift({textbook_name: textbook_name, dept: dept, course_number_code: course_number_code*1})
        user = await User.findByIdAndUpdate(user_id, {notifications: notifications}, {new: true})
        return res.status(200).json({
            notifications: notifications,
            message: 'success',
            data: user
        })
    } catch (err) { 
        errRes(res, 404, "Cannot find user or textbook id associated with that", err)
    }
}


exports.statTests = async (req, res, next) => { 
  try {  
      let textbookCount =  await User.aggregate([{$project: { count: { $size:"$textbooks" }}}, 
      { $sort: { count: -1}}])    
     let sum = 0;
     Array.from(textbookCount).forEach(txt => { 
         sum = sum + txt.count
     })
     let avg = sum / Array.from(textbookCount).length   
     let soldCount = await Textbook.find({sold: true}) 
     let total = await Textbook.find({})
     soldPercentage = soldCount.length / total.length 
    return res.status(200).json({
        textbookCount: textbookCount,
        avgTextbooks: avg,
        soldPercentage: soldPercentage
    }) 
} catch (err) { 
    errRes(res, 400, "bad req", err)
}
}

//notifications by course_tag
exports.getNotifications = async (req, res, next) => {
    let user_id = req.query.id;

    console.log('I AM HERE', user_id)
    if (!user_id) { 
        return errRes(res, 400, "Need to input user_id to read notifications", null)
    }
    try { 
        let user = await User.findById(user_id)
        let notifications = Array.from(user.notifications)
        let promises = []
        notifications.forEach(notification => { 
            promises.push(Textbook.find({name: notification.textbook_name, course_number_code: notification.course_number_code, dept: notification.dept, sold: false}))
        })
        let results = await Promise.all(promises)
        console.log('notifs', notifications);
        console.log('results', results);
        let updatedResults = []
        let updatedResultsIndex = []
        results.forEach((arr, i) => {
            const ignoreOwnTextbooks = arr.filter(a => a.user != user_id)
            if (ignoreOwnTextbooks.length > 0) { 
                updatedResults.push(results[i])
                updatedResultsIndex.push(i)
            }
        })
        // user = await User.findByIdAndUpdate(user_id, {notifications: updatedResults}, {new: true})
        return res.status(200).json({
            subscriptions: notifications,
            foundNotificationsResults: updatedResults,
            message: 'success',
            foundNotificationsIndex: updatedResultsIndex
        })
    } catch (err) { 
        errRes(res, 404, "Cannot find user associated with that id")
    }
}


//Add checkmark to indicate read then call this method 
exports.deleteNotification = async (req, res, next) => {
    let user_id = req.body.userId
    let index = req.body.index
    if (!user_id || (index === undefined || index === null)) { 
        return errRes(res, 400, "Need to input user_id and textbook_id to delete notifications", null)
    }
    try { 
        let user = await User.findById(user_id)
        let notifications = Array.from(user.notifications)
        let arr = []
        notifications.forEach((notification, i) => { 
            if (i != index) { 
                arr.push(notification)
            }
        })
        user = await User.findByIdAndUpdate(user_id, {notifications: arr}, {new: true})
        return res.status(200).json({
            notifications: arr,
            message: 'success',
            user: user
        })
    } catch (err) { 
        errRes(res, 404, "Cannot find user associated with that id or update failed", err)
    }
}


exports.getUser = async (req, res, next) => {
    try { 
        let query = { $or: [ 
            {_id: req.query.id},
            {email: req.query.email}, 
            ]}
        let user = await User.findOne(query)
        if (user) { 
            return res.status(200).json({
                message: 'success found the user', 
                user: user
            })
        } else { 
            return  errRes(res, 404, "could not find the user", null)
        }
    } catch (err) { 
        errRes(res, 400, "error in getting the user", err)
    }

}

exports.updatePasswordSecurity = async (req, res, next) => {
    try { 
    let answer = req.body.answer.toLowerCase()
    let user_id = req.body.userId
    let user = await User.findById(user_id).select('securityQuestionAnswer');
    if (user.securityQuestionAnswer === answer) { 
        req.body.bipass = true
        return authController.updatePassword(req, res, next)
    } else { 
        errRes(res, 400, "error in updating password security")
    }
 } catch (err) { 
        errRes(res, 400, "could not update password", err)
    }

}

exports.getUserById = async (req, res, next) => { 
    try { 
        let user = await User.findById(req.query.id)
        res.status(200).json({
            data: user,
            message: 'success'
        })
    } catch (err) { 
        errRes(res, 400, "Couldn't get user", err)
    }
}
