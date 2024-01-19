const asyncHandler = require("../middlewares/async");
const FeedbackModel = require("../models/FeedbackModel");
const UserModel = require("../models/UserModel");

//Get all feedback
exports.getAllFeedback = asyncHandler(async (req, res, next) => {
    try {
        const feedback = await FeedbackModel.find();

        if (!feedback || feedback.length === 0) {
            return res.status(404).json({ success: false, message: 'Không có feedback nào' });
        }

        res.json(feedback)

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

exports.createFeedback = asyncHandler(async (req, res, next) => {
    try {
        const user = await UserModel.find({ username: req.params.id });
        if(user)
        {
            const newFeedback = new FeedbackModel({
                username: user.username,
                name:  req.body.name,
                content: req.body.content,
                time: req.body.time,
                UrlImg: req.body.UrlImg,
            });
            const savedUser = await newFeedback.save();

            // Trả về phản hồi thành công
            res.status(201).json({
                success: true
            });
        }
    } catch (err) {
        // Trả về phản hồi lỗi nếu có lỗi xảy ra
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
})