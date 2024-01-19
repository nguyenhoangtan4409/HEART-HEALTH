const express = require("express");
const router = express.Router();

const {
    getAllFeedback,
    createFeedback
} = require("../controllers/FeedbackController")

router.route("/").get(getAllFeedback);
router.route("/create/:id").post(createFeedback);

module.exports = router;