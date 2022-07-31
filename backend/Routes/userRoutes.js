
const express = require("express");
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");
const router = express.Router();


router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/updatePassword").patch(authController.updatePassword);

router.route("/notifications")
    .post(userController.createNotification)
    .get(userController.getNotifications)
    .delete(userController.deleteNotification);

router.route("/verify").post(authController.verifySecurityQuestion)
router.route("/trials").patch(authController.addTrial)
router.route("/getUser").get(userController.getUser)
router.route("/updatePasswordS").patch(userController.updatePasswordSecurity)

router.route("/getUserById").get(userController.getUserById)
router.route('/stat').get(userController.statTests)


module.exports = router;

