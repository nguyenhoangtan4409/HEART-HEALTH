const asyncHandler = require("../middlewares/async")

const AdminModel = require("../models/AdminModel");

//Create admin
exports.createAdmin = asyncHandler(async (req, res, next) => {
    try {
        // Kiểm tra xem đã tồn tại username hay chưa
        var conditions = {};
        if (req.body.username) {
            conditions.username = req.body.username;
        }
        const existingAdmin = await AdminModel.findOne(conditions);
        // Nếu đã tồn tại, trả về lỗi
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Username đã tồn tại'
            });
        }

        // Nếu không có username tồn tại, tiếp tục tạo người dùng mới
        const newAdmin = new AdminModel({
            name: req.body.name,
            hospital: req.body.hospital,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            username: req.body.username,
            pass: req.body.pass,
            dayOfBirth: req.body.dayOfBirth,
            gender: req.body.gender,
            male: req.body.male,
            female: req.body.female,
            city: req.body.city,
            country: req.body.country,
            urlAvatar: req.body.urlAvatar,
            role: "doctor",
        });

        // Lưu người dùng mới vào cơ sở dữ liệu
        const savedAdmin = await newAdmin.save();

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

//Get admin by phone number or email or username
exports.getAdmin = asyncHandler(async (req, res, next) => {
    let admin;
    try {
        // Kiểm tra xem ID được cung cấp có phải là số điện thoại hay email không
        const isPhoneNumber = req.params.id.match(/^\d+$/); // Kiểm tra xem ID có phải là số không

        // Cập nhật truy vấn dựa trên việc đó có phải là số điện thoại hay email không
        if (isPhoneNumber) {
            admin = await AdminModel.findOne({ phoneNumber: req.params.id });
        } else {
            admin = await AdminModel.findOne({ email: req.params.id });

            if (!admin) {
                admin = await AdminModel.findOne({ username: req.params.id });
            }
        }

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        } else {
            res.status(200).json({
                success: true,
                data: admin
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Không thể tìm thấy người dùng' });
    } 
});

//Update admin
exports.updateAdmin = asyncHandler(async (req, res, next) => {
    let admin;
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
    }
    try {
        const isPhoneNumber = req.params.id.match(/^\d+$/); // Kiểm tra xem ID có phải là số không

        // Cập nhật truy vấn dựa trên việc đó có phải là số điện thoại hay email không
        if (isPhoneNumber) {
            admin = await AdminModel.findOne({ phoneNumber: req.params.id });
        } else {
            admin = await AdminModel.findOne({ email: req.params.id });

            if (!admin) {
                admin = await AdminModel.findOne({ username: req.params.id });
            }
        }
        if (admin) {
            await AdminModel.updateOne({ _id: admin._id }, { $set: updateFields });
            const updatedAdmin = await AdminModel.findById(admin._id);
            res.status(200).json({ success: true, data: updatedAdmin });
        } else {
            return res.status(404).json({ success: false, message: 'Không thể tìm thấy người dùng' });
        }
        
    } catch (err) {
        res.status(400).json({ success: false, data: err.message });
    }
});

//Get all admin
exports.getAllAdmin = asyncHandler(async (req, res, next) => {
    try {
        const admins = await AdminModel.find();
        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



