const mongoose = require("mongoose");
const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_SSL,
  MONGO_DATABASE,
  MONGO_USER,
  MONGO_SECRET,
  MONGO_SET,
} = process.env;
let connection = null;

const connect = () => {
  if(!connection){
    connection = mongoose.connect(MONGO_HOST, {
      port: MONGO_PORT,
      dbName: MONGO_DATABASE,
      ssl: !!MONGO_SSL,
      user: MONGO_USER,
      pass: MONGO_SECRET,
      replicaSet: MONGO_SET,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
  return connection 
};

const destroy = () => {
  connection = null
  return mongoose.connection.close();
};

const isConnected = () => {
  return mongoose.isConnected();
};

module.exports = {
  connect,
  destroy,
  isConnected,
};
