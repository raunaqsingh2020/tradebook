const express = require("express");
const textbookController = require("../Controllers/textbookController");
const authController = require('../Controllers/authController')


const router = express.Router();


// router
//     .route("/singleTextbooks")
//     .get(textbookController.getTextbook)


router
    .route("/textbook")
    .get(textbookController.getTextbook)
    .post(textbookController.createTextbook)
    .patch(textbookController.updateTextbook)
    .delete(textbookController.deleteTextbook)

router.route('/updateMarketPrice').patch(textbookController.updateMarketPrice)

router.route('/aggregate').get(textbookController.groupTextbooks)


module.exports = router;