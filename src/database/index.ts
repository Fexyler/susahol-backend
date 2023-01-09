import mongoose, { ConnectOptions } from "mongoose";
import config from '../config'
import User from './models/User';

const options: ConnectOptions = {
  dbName: 'su-sahol',
};

type MongooseError = {
  message: string;
};

const initialDbUrl: string = config.mongoDbConnectionUri as string;

const dbConnection = () => {
  try {
    mongoose.connect(initialDbUrl, options as ConnectOptions).then(() => {
      console.log("MongoDB ready to use");
    });

    mongoose.connection.on("connected", () => {
      console.log("Connected to the MongoDB...");
    });

    mongoose.connection.on("error", (err: MongooseError) => {
      console.log(`MongoDB connection error : ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Connection between Express and MongoDB is dead now.");
    });
  } catch (err) {
    console.log(err);
  }
};

export {
  User,
  dbConnection,
};
