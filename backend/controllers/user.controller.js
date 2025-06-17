import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js"

export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById({ _id: req.user._id }).select("connections");

        // find users who are not already connected, and also do not recomment our own profile
        const suggestedUsers = await User.find({
            _id: { $ne: currentUser._id, $nin: currentUser.connections },
        }).select("name username profilePicture headline").limit(3);

        res.json(suggestedUsers)
    } catch (error) {
        console.error("Error in getSuggestedConnections controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = ["name", "username", "profilePicture", "bannerImg", "headline", "location", "about", "skills", "experience", "education"];

        const updatedData = {};

        for (const field of allowedFields) {
            if (req.body[field]) {
                updatedData[field] = req.body[field];
            }
        }

        if (req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture)
            updatedData.profilePicture = result.secure_url;
        }

        if (req.body.bannerImg) {
            const result = await cloudinary.uploader.upload(req.body.bannerImg)
            updatedData.bannerImg = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select("-password");

        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}