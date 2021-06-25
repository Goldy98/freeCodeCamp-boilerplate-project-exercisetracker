import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ username: String, exercices: [{ description: String, duration: Number, date: String }] });

export const Users = mongoose.model('Users', userSchema);