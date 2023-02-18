const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb://mansi35:V8NuYq5MCsEGEuz@teams-clone-shard-00-00.iaugd.mongodb.net:27017,teams-clone-shard-00-01.iaugd.mongodb.net:27017,teams-clone-shard-00-02.iaugd.mongodb.net:27017/testAuth?authSource=admin&retryWrites=true&ssl=true",
    {
      useUnifiedTopology: true,
    }
  );

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
