/**
 * Task Sequence schema: mongo db
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SequenceSchema = new Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Data'
    },
    seq_time: String,
    total_time: String,
    task_status: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Sequence", SequenceSchema);
