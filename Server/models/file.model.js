import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  uploadDate: { type: Date, default: Date.now }
});

export default File = mongoose.model('File', fileSchema);