const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();
const colors = require("colors");
const connectDB = require("./db");
const uploadModel = require("./uploadModel");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cron = require("node-cron");

const PORT = process.env.PORT || 8080;

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

connectDB();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

cron.schedule("*/5 * * * *", async () => {
  console.log("running a task every two minutes");
  var host2 = [
    "100.20.92.101",
    "44.225.181.72",
    "44.227.217.144",
    "216.24.57.3",
  ];

  var frequency = 1000; //1 second

  host2.forEach(function (host) {
    // setInterval(function () {
    ping.sys.probe(host, function (active) {
      var info = active
        ? "IP " + host + " = Active"
        : "IP " + host + " = Non-Active";
      console.log(info);
    });
    // }, frequency);
  });
  var fetch_res = await fetch(
    `https://kurta-backend.onrender.com/`
  );
  var fetch_data = await fetch_res.json();
  console.log("fetch_data", fetch_data);
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 10 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },

  // mypic is the name of file attribute
});

app.get("/", function (req, res) {
  res.send("Backend is working");
});

app.post(
  "/uploadProfilePicture",
  upload.array("image"),
  async function (req, res, next) {
    console.log("req.files", req.files);

    try {
      const uploading = await uploadModel.create({
        images: req.files,
        title: req.body.title,
      });

      if (uploading) {
        res.send({
          success: true,
          message: "Successfully uploaded picture",
        });
        return;
      }

      res.send({
        success: false,
        message: "Error while uploading images",
      });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  }
);

app.get("/getImages", async (req, res, next) => {
  try {
    const getData = await uploadModel.find({}).lean().exec();

    res.send({ success: true, data: getData });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

app.get("/delete", async (req, res, next) => {
  try {
    
    const deleteData = await uploadModel.findByIdAndDelete({_id: req.query.id}).exec();
    
    if(deleteData){
      res.send({ success: true, message: 'deleted' });
      return
    }
    res.send({ success: false, data: 'Error' });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// Take any port number of your choice which
// is not taken by any other process
app.listen(PORT, function (error) {
  if (error) throw error;
  console.log("Server created Successfully on PORT" + PORT);
});
