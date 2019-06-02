//dependencies
const http = require("http");
const path = require("path");
const cors = require("cors");
const express = require("express");
const db = require("./utilites/db");
const dbPool = require("./utilites/dbPool");
const bodyParser = require("body-parser");
const check_auth = require("./middleWares/check_authentication");
const app = express();

//router

const AuthRouter = require("./routers/AuthRouter");
const RolesRouter = require("./routers/RolesRouter");
const privilegesRouter = require("./routers/PrivilegesRouter");
const locationRouter = require("./routers/locationRouter");
const clinicsRouter = require("./routers/clinicsRouter");
const travelAgent = require("./routers/travelAgencyRouter");
const generalRouter = require("./routers/crudRouter");
const server = http.createServer(app);

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join("images")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", AuthRouter);
app.use("/roles", RolesRouter);
app.use("/privileges", privilegesRouter);
app.use("/general", generalRouter);
app.use("/location", locationRouter);
app.use("/clinics", clinicsRouter);
app.use("/travelAgency", travelAgent);

server.listen(process.env.PORT || 3000);
