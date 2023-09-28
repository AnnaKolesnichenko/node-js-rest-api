import app from "./app.js";
import mongoose from "mongoose";

const {DB_HOST, PORT = 3000} = process.env;

//const DB_HOST = "mongodb+srv://AnnaK:appletea333@cluster0.kue2rm6.mongodb.net/my-contacts?retryWrites=true&w=majority";
mongoose.connect(DB_HOST)
.then(() => {
  app.listen(PORT, () => {
  console.log("Database connection successful")
})
})
.catch(error => {
  console.log(error.message);
  process.exit(1);
})


