const asyncHandler = require("../middlewares/async")

const ScheduleModel = require("../models/ScheduleModel");
const UserModel = require("../models/UserModel");

//Create user
exports.createSche = asyncHandler(async (req, res, next) => {
    try {
        // Kiểm tra xem đã tồn tại username hay chưa
        var conditions = {};
        if (req.body.idPatient) {
            conditions.username = req.body.idPatient;
        }
        const existingUser = await UserModel.findOne(conditions);
        // Nếu đã tồn tại, trả về lỗi
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }

        // Nếu không có username tồn tại, tiếp tục tạo người dùng mới
        const newSche = new ScheduleModel({
            nameDoctor: req.body.nameDoctor,
            idPatient: req.body.idPatient,
            namePatient: req.body.namePatient,
            genderPatient: req.body.genderPatient,
            imgPatient: req.body.imgPatient,
            email: req.body.email,
            date: req.body.date,
            time: req.body.time,
            content: req.body.content,
            status: 2
        });

        // Lưu người dùng mới vào cơ sở dữ liệu
        const savedSche = await newSche.save();

        // Trả về phản hồi thành công
        res.status(201).json({
            success: true
        });
    } catch (err) {
        // Trả về phản hồi lỗi nếu có lỗi xảy ra
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
})

//Get sche by username of user
exports.getScheUser = asyncHandler(async (req, res, next) => {
    let scheUser;
    try {
        scheUser = await ScheduleModel.findOne({ idPatient: req.params.id });

        if (!scheUser) {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        } else {
            res.status(200).json({
                success: true,
                data: scheUser
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Không thể tìm thấy người dùng' });
    } 
});
//Get sche by username of admin
exports.getScheAdmin = asyncHandler(async (req, res, next) => {
    let scheAdmin;
    try {
        scheAdmin = await ScheduleModel.findOne({ nameDoctor: req.params.id });

        if (!scheAdmin) {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        } else {
            res.status(200).json({
                success: true,
                data: scheAdmin
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Không thể tìm thấy người dùng' });
    } 
});

//Update sche by username of user
exports.updateScheUser = asyncHandler(async (req, res, next) => {
    let scheUser;
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
    }
    try {
        // Cập nhật truy vấn dựa trên việc đó có phải là số điện thoại hay email không
        scheUser = await ScheduleModel.findOne({ idPatient: req.params.id });

        if (scheUser) {
            await ScheduleModel.updateOne({ _id: scheUser._id }, { $set: updateFields });
            const updatedScheUser = await ScheduleModel.findById(scheUser._id);
            res.status(200).json({ success: true, data: updatedScheUser });
        } else {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        }
        
    } catch (err) {
        res.status(400).json({ success: false, data: err.message });
    }
});

//Update sche by id of admin
exports.updateScheAdmin = asyncHandler(async (req, res, next) => {
    let scheAdmin;
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
    }
    try {
        // Cập nhật truy vấn dựa trên việc đó có phải là số điện thoại hay email không
        scheAdmin = await ScheduleModel.findOne({ _id: req.params.id });

        if (scheAdmin) {
            await ScheduleModel.updateOne({ _id: scheAdmin._id }, { $set: updateFields });
            const updatedScheAdmin = await ScheduleModel.findById(scheAdmin._id);
            res.status(200).json({ success: true, data: updatedScheAdmin });
        } else {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        }
        
    } catch (err) {
        res.status(400).json({ success: false, data: err.message });
    }
});

//Get all Sche
exports.getAllSche = asyncHandler(async (req, res, next) => {
    try {
        const schedules = await ScheduleModel.find();
        res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

//get all schedule by admin
exports.getAllScheAdmin = asyncHandler(async (req, res, next) => {
    let scheAdmin;
    try {
        scheAdmin = await ScheduleModel.find({ nameDoctor: req.params.id });

        if (!scheAdmin) {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        } else {
            res.status(200).json({
                success: true,
                data: scheAdmin
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Không thể tìm thấy người dùng' });
    } 
});


//delete user by username of doctor
exports.deleteSchedule = asyncHandler(async (req, res, next) => {
    try {
        // Kiểm tra xem username có được cung cấp hay không
        const nameDoctor = req.params.id;

        // Tìm người dùng theo username
        const sche = await ScheduleModel.findOne({ _id: req.params.id });

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (!sche) {
            return res.status(404).json({
                success: false,
                message: 'Không thể tìm thấy username'
            });
        } else {
            // Xóa người dùng từ cơ sở dữ liệu
            await ScheduleModel.deleteOne({ _id: sche._id });

            // Trả về phản hồi thành công
            res.status(200).json({
                success: true,
                message: 'Xóa thánh công'
            });
        }
    } catch (err) {
        // Trả về phản hồi lỗi nếu có lỗi xảy ra
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa người dùng'
        });
    }
});




