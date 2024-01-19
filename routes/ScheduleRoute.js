const express = require("express");
const router = express.Router();

const {
    createSche,
    getScheUser,
    getScheAdmin,
    updateScheUser,
    updateScheAdmin,
    getAllSche,
    getAllScheAdmin,
    deleteSchedule
} = require("../controllers/ScheduleController.js")

router.route("/").get(getAllSche);
router.route("/getalladmin/:id").get(getAllScheAdmin);
router.route("/createsche").post(createSche);
router.route("/getbyadmin/:id").get(getScheAdmin);
router.route("/getbyuser/:id").get(getScheUser);
router.route("/updatebyadmin/:id").put(updateScheAdmin);
router.route("/updatebyuser/:id").put(updateScheUser);
router.route("/deleteschedule/:id").delete(deleteSchedule);

module.exports = router;