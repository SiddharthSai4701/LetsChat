import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        // Renaming the id field that we destructure to userToChatId
        const { id: userToChatId } = req.params;

        // Current User ID
        const myId = req.user._id;

        // Find all messages where the current user is the sender and the provider user ID (from params) is the receiver or vice versa
        const messages = await Message.find(
            {
                $or: [
                    {
                        senderId: myId,
                        receiverId: userToChatId
                    },
                    {
                        senderId: userToChatId,
                        receiverId: myId
                    }
                ]
            }
        );

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ error: "internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl

        });

        await newMessage.save();

        // TODO: Implement real time functionality using socket io
        const receiverSocketId = getReceiverSocketId(receiverId);

        // If the user is online, send message in real time
        if(receiverSocketId) {
            // Message will be sent only to the receiver
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "internal server error" })
    }
}