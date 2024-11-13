import mongoose from "mongoose";

// TODO: logic for saved songs -> view saved songs in dashboard
const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        clerkId: {
            type: String,
            required: true,
            unique: true
        },
    },
    {timestamps: true} // createdAt, updatedAt
);

export const User = mongoose.model("User", userSchema);