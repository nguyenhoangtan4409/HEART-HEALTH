const asyncHandler = require("../middlewares/async");
const SensorModel = require("../models/SensorModel");

//Get user by phone number/email/username
exports.getSensor = asyncHandler(async (req, res, next) => {
    try {
        const sensors = await SensorModel.find({ idUser: req.params.id });

        if (!sensors || sensors.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sensor' });
        }

        // Tìm sensor có thời gian lớn nhất
        const latestSensor = sensors.reduce((max, sensor) => (sensor.timing > max.timing ? sensor : max));

        // const latestData = await SensorModel.findOne({ _id: latestSensor._id })
        //     .select('spo2 heartRate timing')
        //     .lean();

        return res.status(200).json({
            success: true,
            sensor: latestSensor
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});


//Get all sensor
exports.getAllSensor = asyncHandler(async (req, res, next) => {
    try {
        const sensors = await SensorModel.find({ idUser: req.params.id });

        if (!sensors || sensors.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sensor' });
        }

        res.json(sensors)

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});
