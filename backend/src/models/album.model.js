import mongoose from "mongoose";
import { artistSchema } from "./song.model.js";

export const copyrightSchema = new mongoose.Schema({
	text: {type: String, required: true},
	type: {type: String, required: true},
});

const albumSchema = new mongoose.Schema(
	{
		id: {
            type: String,
            required: true,
            unique: true
        },
		title: { type: String, required: true },
		albumType: { type: String, required: true },
		artists: { type:[artistSchema], required: true},
		imageUrl: { type: String, required: true },
		albumUrl: { type: String, required: true },
		totalTracks: { type: Number, required: false },
		releaseDate: { type: String, required: true, },
		copyrights: { type:[copyrightSchema], required: false},
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
	},
	{ timestamps: true } //  createdAt, updatedAt
); 

export const Album = mongoose.model("Album", albumSchema);