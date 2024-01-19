const asyncHandler = require("../middlewares/async")

const UserModel = require("../models/NotiModel");

//Create noti
exports.createUser = asyncHandler(async (req, res, next) => {
    try {
        // Kiểm tra xem đã tồn tại username hay chưa
        var conditions = {};
        if (req.body.username) {
            conditions.username = req.body.username;
        }
        const existingUser = await UserModel.findOne(conditions);
        // Nếu đã tồn tại, trả về lỗi
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username đã tồn tại'
            });
        }

        // Nếu không có username tồn tại, tiếp tục tạo người dùng mới
        const newUser = new UserModel({
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            username: req.body.username,
            pass: req.body.pass,
            name: req.body.name,
            address: req.body.address,
            dayOfBirth: req.body.dayOfBirth,
            idDevice: req.body.idDevice,
            role: "user",
        });

        // Lưu người dùng mới vào cơ sở dữ liệu
        const savedUser = await newUser.save();

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

//Get user by phone number/email/username
exports.getUser = asyncHandler(async (req, res, next) => {
    let user;
    try {
        // Kiểm tra xem ID được cung cấp có phải là số điện thoại hay email không
        const isPhoneNumber = req.params.id.match(/^\d+$/); // Kiểm tra xem ID có phải là số không

        // Cập nhật truy vấn dựa trên việc đó có phải là số điện thoại hay email không
        if (isPhoneNumber) {
            user = await UserModel.findOne({ phoneNumber: req.params.id });
        } else {
            user = await UserModel.findOne({ email: req.params.id });

            if (!user) {
                user = await UserModel.findOne({ username: req.params.id });
            }
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        } else {
            res.status(200).json({
                success: true,
                data: user
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Không thể tìm thấy người dùng' });
    } 
});

//Update 1 user by phone number/email/username
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user;
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
    }
    try {
        const isPhoneNumber = req.params.id.match(/^\d+$/); // Kiểm tra xem ID có phải là số không

        // Cập nhật truy vấn dựa trên việc đó có phải là số điện thoại hay email không
        if (isPhoneNumber) {
            user = await UserModel.findOne({ phoneNumber: req.params.id });
        } else {
            user = await UserModel.findOne({ email: req.params.id });
        }
        if (user) {
            await UserModel.updateOne({ _id: user._id }, { $set: updateFields });
            const updatedUser = await UserModel.findById(user._id);
            res.status(200).json({ success: true, data: updatedUser });
        } else {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        }
        
    } catch (err) {
        res.status(400).json({ success: false, data: err.message });
    }
});

//Get all user
exports.getAllUser = asyncHandler(async (req, res, next) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



