import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String, // 'Male', 'Female', 'Other'
    preference: String, // 'Male', 'Female', 'Both'
    interests: [String],
    profileImage: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("Users", userSchema);

export default User;