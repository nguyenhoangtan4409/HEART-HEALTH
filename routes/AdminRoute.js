const express = require("express");
const router = express.Router();

const {
    getAllAdmin,
    getAdmin,
    updateAdmin,
    createAdmin
} = require("../controllers/AdminController")

router.route("/").get(getAllAdmin);
router.route("/createadmin").post(createAdmin);
router.route("/getadmin/:id").get(getAdmin);
router.route("/updateadmin/:id").put(updateAdmin);

module.exports = router;