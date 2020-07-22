const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const Sequence = require("./sequence");
const path = require("path");
const app = express();
const router = express.Router();
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const dbRoute =  "mongodb://oliverdbuser:vWK482DYG9@ds155076.mlab.com:55076/heroku_v5mvh32q?retryWrites=true";

//connection with databse.

mongoose.connect(
  dbRoute,
  {useNewUrlParser: true}
);
let db = mongoose.connection;



db.once("open", () => console.log('connected to MongoDB Database'));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Logging, it is optional and can be used for debugging
//bodyParser, parses the request body to be a redable json format.
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

mongoose.set('useFindAndModify', false);

/**
 * Function to getData from the Task Data record.
 */
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    console.log('no data found');
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

/**
 * Function to get Task data by Id.
 */
router.get("/getTaskDataById", (req, res) => {
  const { _id }= req.query;
  Data.findOne({_id: _id},(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

/**
 * Function to get Task sequences form the Database.
 */
router.get("/getSequences", (req, res) => {
  Sequence.find({})
    .populate('task_id').sort({task_id: 1, updatedAt: 1})
    .exec((err, data) => {
        console.log('no data found');
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
      })

});
/**
 * Function to update Task Data in DB.
 */
router.post("/updateData", (req, res) => {
  const { _id, id, task, comment, created_date, submission_date, hourly_rate, task_status, background_color, total_time, time_start, currency } = req.body;
  let update = {
    id:id,
    task:task,
    comment:comment,
    created_date:created_date,
    submission_date:submission_date,
    hourly_rate:hourly_rate,
    task_status:task_status,
    background_color:background_color,
    total_time: total_time ? total_time: 0,
    currency: currency
    
  }
  Data.findOneAndUpdate({_id: _id}, update, {rawResult: true},(err, response ) => {
    if (err) return res.json({ success: false, error: err });

    update._id = _id;
    update.time_start = time_start ? time_start: 0
    return res.json({ success: true, data: update });
  });
});

/**
 * Function to update Task time in DB.
 */
router.post("/updateTaskTime", (req, res) => {
  const { _id, time, task_status } = req.body;
  let update = {
    total_time: time,
    task_status: task_status
  }
  Data.findOneAndUpdate({_id: _id}, update, {rawResult: true},(err, response ) => {
    if (err) return res.json({ success: false, error: err });
    update._id = _id;
    update.time = time;
    return res.json({ success: true, data: update });
  });
});
/**
 * Function to update Task Status as Complete in DB.
 */
router.post("/updateTaskComplete", (req, res) => {
  const { _id } = req.body;
  let update = {
    task_status: '3'
  }
  Data.findOneAndUpdate({_id: _id}, update, {rawResult: true},(err, response ) => {
    if (err) return res.json({ success: false, error: err });
    update._id = _id;
    return res.json({ success: true, data: update });
  });
});
/**
 * Function to update Task status as In Progress in DB.
 */
router.post("/updateTaskInprogress", (req, res) => {
  const { _id } = req.body;
  let update = {
    task_status: '2'
  }
  Data.findOneAndUpdate({_id: _id}, update, {rawResult: true},(err, response ) => {
    if (err) return res.json({ success: false, error: err });
    update._id = _id;
    return res.json({ success: true, data: update });
  });
});

/**
 * Function to Delete task and sequence data from DB.
 */
router.delete("/deleteData", (req, res) => {
  const { _id } = req.body;
  Data.findOneAndDelete({_id:_id}, err => {
      if (err) return res.send(err);
      
      Sequence.deleteMany({task_id: _id }, err => {
              if (err) return res.send(err);
      });
      return res.json({ success: true, _id: _id });
  });
  
});
/**
 * Function to delete all sequences, commented for now.
 */
// router.get("/deleteAllSequences", (req, res) => {
//   Sequence.deleteMany({}, err => {
//       if (err) return res.send(err);
//       return res.json({ success: true });
//   });
// });

/**
 * Function to add new task in Db.
 */
router.post("/putData", (req, res) => {
  let data = new Data();
  const { task, comment, created_date, submission_date, hourly_rate, task_status, background_color,total_time, currency } = req.body;
  if (!task)  {
    return res.json({
      success: false,
      error: 'INVALID PARAMS PROVIDED'
    });
  }
  data.task = task;
  data.comment = comment;
  data.created_date = created_date;
  data.submission_date = submission_date;
  data.hourly_rate = hourly_rate;
  data.task_status =  task_status;
  data.background_color = background_color;
  data.total_time = total_time ? total_time: 0;
  data.currency = currency;
  data.save( (err, response) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: response });
  });
});

/**
 * Function to put task Sequence in DB.
 */
router.post("/putSequence", (req, res) => {
  let sequence = new Sequence();
  const { task_id, seq_time, total_time,task_status } = req.body;
  if ((!task_id && task_id !== 0) || !seq_time || !total_time || !task_status)  {
    return res.json({
      success: false,
      error: 'INVALID PARAMS PROVIDED'
    });
  }
  sequence.task_id = task_id;
  sequence.total_time = total_time;
  sequence.seq_time = seq_time;
  sequence.task_status = task_status;
  
  sequence.save( (err, response) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: response });
  });
});

app.use("/api", router);

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Task list APP on ${port}`);
