const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
    new_note: { type: Boolean, default: true },
    email: { type: String, required: true },
  },
  {
    collection: "Notes",
  }
);

module.exports = mongoose.model("Note", noteSchema);
