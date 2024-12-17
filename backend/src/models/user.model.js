import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// If we name the collection User, Mongo will save it as users in the database
const User = mongoose.model("User", userSchema);

export default User;