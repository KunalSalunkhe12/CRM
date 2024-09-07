import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("MISSING MOGODB_URL");
  }

  if (isConnected) {
    return;
  }

  // we have a url and we are not connected
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "sample_sale",
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    isConnected = true;
    console.log("mongodb is connected.");
  } catch (error) {
    console.log("Couldn't connect to mongodb ", error);
  }
};
