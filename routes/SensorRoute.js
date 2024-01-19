const express = require("express");
const router = express.Router();

const {
    getAllSensor,
    getSensor,
} = require("../controllers/SensorController")

router.route("/:id").get(getAllSensor);
router.route("/getById/:id").get(getSensor);

module.exports = router;