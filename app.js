//dependencies
const http = require("http");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./utilites/db");
const check_auth = require("./middleWares/check_authentication");
const app = express();

//router

const AuthRouter = require("./routers/AuthRouter");
const RolesRouter = require("./routers/RolesRouter");
const server = http.createServer(app);
//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join("images")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", AuthRouter);
app.use("/roles", RolesRouter);
server.listen(process.env.PORT || 3000);
