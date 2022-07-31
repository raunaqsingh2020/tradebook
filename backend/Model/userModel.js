const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const timeTableCheck = (timeTable) => {
  let bool = true;
  timeTable.forEach((time, i) => {
    bool = bool && (time === i + 10 || time === null);
  });
  return bool;
};


const notifications = new mongoose.Schema({
  course_number_code: { 
    type: Number
  },
  dept: {
    type: String
  },
  textbook_name: {
    type: String
  }
});


const userSchema = new mongoose.Schema(
  {
    // _id: Schema.Types.ObjectId,
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
      //   select: false,
    },
    textbooks: [{
        type: mongoose.Schema.ObjectId,
        ref: "Textbook",
        // default: [],
      }],
    password: {
        type: String,
        required: [true, "A password is required"],
        minlength: 8,
        select: false,
      },
    passwordConfirm: {
        type: String,
        minlength: 8,
        required: [true, "Must confirm your password"],
        select: false,
        validate: {
          //This only works on CREATE & SAVE!!!
          validator: function (val) {
            return val === this.password;
          },
          message: "The password must match the confirmed password",
        },
      },
      email: { 
        type: String,
        required: [true, "An email is required"],
        unique: true 
      },
      passwordChangedAt: {
          type: Date
      },
      trials: { 
        type: Number,
        // select: false, //so hacker cannot auto update
        default: 0
      },
      securityQuestion: { 
        type: String, 
        // select: false
      },
      securityQuestionAnswer: { 
        type: String, 
        select: false,
        default: 0
      },
      notifications: [notifications]
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



// userSchema.virtual("orders", {
//   ref: "Textbook",
//   foreignField: "users.user",
//   localField: "_id",
// });

userSchema.pre(/^find/, function (next) {
//   console.log("HELLO", this.getQuery());
  return next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("I am at preSave crypting password");
  this.password = await bcrypt.hash(this.password, 12); //store password plaintext in password
  this.passwordConfirm = undefined; //not hashed
  return next();
});

//CHANGE PASSWORD LOGIC--> saving sometimes slower than creating new JWT token. TO ensure new JWT is issued AFTER password change.
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

// userSchema.pre(/^find^/, function (next) {
//   this.populate("dishes");
// });

//INSTANCE METHODS

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//Check if user changed passwords after the JWT token was issued

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //in inst. method this --> current doc
  /*
  var date = new Date( parseInt("1479203274") * 1000 ) instead of "147..." JWTTimemestamp then comp with passwordChangeAt direct. 
  */
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(this.passwordChangedAt, jwtTimeCreationStamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //10 minutes after, token will expire
  //store encrypted token in the database.
  //Provide non encrypted token to the client.
  //Client then cross checks upon switching.
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
