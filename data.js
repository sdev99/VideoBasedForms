/**
 * Task data schema: mongo db.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

const DataSchema = new Schema(
  {
    id: Number,
    task: String,
    comment: String,
    created_date: String,
    submission_date: String,
    hourly_rate: String,
    task_status: String,
    background_color: String,
    total_time: String,
    currency: String
  },
  { timestamps: true }
);

/**
 * Add the auto increnment id for new task before save.
 */
DataSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'tasks'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.id = counter.seq;
        next();
    });
});



module.exports = mongoose.model("Data", DataSchema);
