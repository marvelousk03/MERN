import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Todo", todoSchema);
