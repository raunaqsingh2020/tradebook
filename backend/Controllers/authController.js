const { promisify } = require("util");
// const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Model/userModel");
// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(
//   "176704683569-qc46nbriadugqt1a2k9nme5oph80jjgl.apps.googleusercontent.com"
// );



const errRes = (res, status, message, err) => {
  return res.status(status).json({
    status: "error",
    error: err,
    message: message,
  });
};

const signToken = (id, role) => {
  //console.log(`EXPIRE   : ${process.env.JWT_EXPIRES_IN}`);
  console.log("SIGN", id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 100000,
  });
};

// const createSendToken = (user, statusCode, req, res) => {
//   const token = signToken(user._id, user.role);
//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     // domain: process.env.NODE_ENV === "development" ? "localhost" : "tizaar.com",
//     httpOnly: true,
//     secure: req.secure || req.headers["x-forwarded-proto"] === "https", //only when we use https
//     // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //not a good idea best to do everything on heroku!
//   };
//   console.log(cookieOptions);
//   user.password = undefined;
//   res.cookie("jwt", token, cookieOptions);
//   res.status(statusCode).json({
//     status: "success",
//     token, //is this ok to do
//     data: {
//       user,
//     },
//   });
// };

exports.default_success = (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
};
exports.signup = async (req, res, next) => {
  try {
    let existing = await User.findOne({email: req.body.email})
    if (existing) { 
      return errRes(res, 400, "Can't use an existing registered email", null)
    }
    if (!req.body.password   || !req.body.email  || !req.body.passwordConfirm || !req.body.question || !req.body.answer) {
      return errRes(res, 400, "Please provide email, password and security question and answer", null);
      //   return next(new AppError("Please provide email and password!", 400));
    }
    const newUser = await User.create({
      email : req.body.email ,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      securityQuestion: req.body.question.toLowerCase(),
      securityQuestionAnswer: req.body.answer.toLowerCase()
    });
    // createSendToken(newUser, 201, req, res);
    newUser.password = undefined
    newUser.passwordConfirm = undefined
    res.status(201).json({
          status: "success",
          data: {
            newUser,
          },
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "failure",
      message: err,
      code: err.code, //condition on err code
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email , password } = req.body;
    //1) Check if email and password exist
    if (!email   || !password) {
      return errRes(res, 400, "Please provide email and password", null);
      //   return next(new AppError("Please provide email and password!", 400));
    }

    //2) Check if user exists && password is correct
    const user = await User.findOne({ email  }).select("+password +securityQuestion +securityQuestionAnswer +trials");
    //console.log(`${user}`);
    //3) If everything is ok send token to client and sign off. Not sure if you need await here. Not asynchronous.
    if (!user || !(await user.correctPassword(password, user.password))) {
      return errRes(res, 401, "Incorrect email or password", null);
      // return next(new AppError("Incorrect email or password", 401));
    }
    // createSendToken(user, 200, req, res);
    user.password = undefined
    user.passwordConfirm = undefined
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
  });
  } catch (err) {
    res.json({
      status: "error",
      message: err,
    });
  }
};

exports.addTrial = async (req, res, next) => { 
  try { 
    let userId = req.body.userId
    let user = await User.findById(userId).select('+trials')
    let trials = user.trials*1 + 1
    user = await User.findByIdAndUpdate(userId, {trials: trials}, {new: true}).select('+trials')
    return res.status(200).json({
      message: 'trials succesfully updated', 
      data: user
    })
  } catch (err) { 
    errRes(res, 400, "could not update trials", err)
  }
}

// exports.adminRole = async (req, res, next) => {
//   try {
//     const { user_id } = req.body;
//     //1) Check if email and password exist
//     if (!user_id) {
//       return errRes(res, 400, "Please provide email and password", null);
//       //   return next(new AppError("Please provide email and password!", 400));
//     }

//     //2) Check if user exists && password is correct
//     const user = await User.findById(user_id)
//     //console.log(`${user}`);
//     //3) If everything is ok send token to client and sign off. Not sure if you need await here. Not asynchronous.
//     if (!user) {
//       return errRes(res, 404, "Incorrect user_id and user not found", null);
//       // return next(new AppError("Incorrect email or password", 401));
//     }
//     // createSendToken(user, 200, req, res)
//     if (user.role === "admin") { 
//       next()
//     } else { 
//       return errRes(res, 400, "Not admin, not authorised to perform this action", null);
//     }
//   } catch (err) {
//     res.json({
//       status: "error",
//       message: err,
//     });
//   }
// };

exports.updatePassword = async (req, res, next) => {
  //1) Get user from collection
  try {
    const user = await User.findById(req.body.userId).select("+password");
    if (!user) return  errRes(res, 400, "Could not update since user not logged in", null);
    //2) Confirm posted password
    console.log(req.body)
    if (!req.body.bipass && !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return errRes(res, 401, "Your existing password is incorrect", null);
      //   return next(new AppError(`You're existing password is incorrect`), 401);
    }
    //3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    //console.log('Before SAVE!!!');
    await user.save();
    //console.log('After SAVE!!!');
    //4) Log user in, send JWT
    user.password = undefined
    user.passwordConfirm = undefined
    return res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.json({
      status: "error",
      error: error,
      message: "Error in update password",
    });
  }
};

exports.verifySecurityQuestion = async (req, res, next) => { 
  try { 
    let answer = req.body.answer.toLowerCase()
    let user_id = req.body.userId
    let user = await User.findById(user_id).select('securityQuestionAnswer');
    if (user.securityQuestionAnswer === answer) { 
      return res.status(200).json({
        message: "correct security question answer",
        data: true
      })
    } else { 
      return res.status(401).json({
        message: "incorrect security question answer",
        data: false
      })
    }
  } catch (err) { 
    return errRes(res, 401, "Not authorised", err)
  }
}