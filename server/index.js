const express = require("express");
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const listingRoute = require("./routes/listing");
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
dotenv.config();

connectDB();

//middleware (built-in middleware)
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

//routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/listing", listingRoute);

//error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
// listen
app.listen(process.env.PORT, () => {
  console.log("server is running");
});
