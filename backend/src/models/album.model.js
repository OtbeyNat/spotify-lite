import mongoose from "mongoose";

// TODO: logic to view albums in dashboard for a user
// TODO: replace artist with description
const albumSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		artist: { type: String, required: true },
		imageUrl: { type: String, required: true },
		releaseYear: { type: Number, required: true },
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
		userId: {type: String, required: true},
	},
	{ timestamps: true } //  createdAt, updatedAt
); 

export const Album = mongoose.model("Album", albumSchema);