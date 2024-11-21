import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    artist_name: {type: String, required: true},
    artist_link: {type: String, required: true},
})

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        // can be multiple artists
        artists: [artistSchema],
        imageUrl: {
            type: String,
            required: true,
        },
        audioUrl: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, // seconds
            required: true,
        },
        // TODO: album logic might have to change
        // TODO: include saved playlist id
        albumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
            required: false,
        },
        trackUrl: {
            type: String,
            required: true,
        },
        popularity: {
            type: Number, // 0-100,
            required: true,
        },
        releaseDate: {
            type: String,
            required: true,
        }
    },
    {timestamps: true} // createdAt, updatedAt
);

export const Song = mongoose.model("Song", songSchema);