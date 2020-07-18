const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const customErrorHandler = require("./middleware/customErorHandler");

dotenv.config({
  path: "./config/config.env",
});

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

//Route
app.use("/api", routes);
//

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected Succesfuly");
});
mongoose.connection.on("error", (err) => {
  console.log("Not Connected" + err);
});

app.use(customErrorHandler);

// Static file

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
