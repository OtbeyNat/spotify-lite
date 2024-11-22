import mongoose from "mongoose";
import { artistSchema } from "./song.model.js";

const albumSchema = new mongoose.Schema(
	{
		id: {
            type: String,
            required: true,
            unique: true
        },
		title: { type: String, required: true },
		artists: [artistSchema],
		imageUrl: { type: String, required: true },
		totalTracks: { type: Number, required: false },
		releaseDate: { type: String, required: true, },
		releaseYear: { type: Number, required: true, },
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
	},
	{ timestamps: true } //  createdAt, updatedAt
); 

export const Album = mongoose.model("Album", albumSchema);