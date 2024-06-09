import mongoose from "mongoose";
const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "PORTFOLIO",
    })
    .then(() => {
      console.log(`Connected to Database`);
    })
    .catch((error) => {
      console.log(`Error while connecting to database: ${error}`);
    });
};

export default dbConnection;
