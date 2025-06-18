import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { sendConnectionAcceptedEmail } from "../emails/emailHandlers.js";

export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        const senderId = req.user._id;

        if (senderId.toString() === userId) {
            return res.status(400).json({ message: "You cannot send a connection request to yourself." });
        }

        if (req.user.connections.includes(userId)) {
            return res.status(400).json({ message: "You are already connected." });
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            recipient: userId,
            status: "pending"
        })

        if (existingRequest) {
            return res.status(400).json({ message: "A connection request already exists." });
        }

        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId,
        })

        await newRequest.save();

        res.status(201).json({ message: "Connection request sent successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await ConnectionRequest.findById(requestId).populate("sender", "name email username").populate("recipient", "name username");

        if (!request) {
            return res.status(404).json({ message: "Connection request not found." });
        }

        // check if the request is for the current user
        if (request.recipient._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this request." });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "This request has already been processed." });
        }

        request.status = "accepted";
        await request.save();

        // if I'm your friend, then ur also my friend
        await User.findByIdAndUpdate(request.sender._id, { $addToSet: { connections: request.userId } })
        await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } })

        const notification = new Notification({
            recipient: request.sender._id,
            type: "connectionAccepted",
            relatedUser: userId,
        })
        await notification.save();

        res.json({ message: "Connection request accepted successfully." });

        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = `${process.env.CLIENT_URL}/profile/${request.recipient.username}`;

        try {
            await sendConnectionAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);
        } catch (error) {
            console.error("Error sending connection accepted email:", error);
        }
    } catch (error) {
        console.error("Error accepting connection request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const rejectConnectionRequest = async (req, res) => { }

export const getConnectionRequests = async (req, res) => { }

export const getUserConnections = async (req, res) => { }

export const removeConnection = async (req, res) => { }

export const getConnectionStatus = async (req, res) => { }

