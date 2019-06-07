//dependencies
const http = require("http");
const path = require("path");
const cors = require("cors");
const express = require("express");
const db = require("./utilites/db");
const dbPool = require('./utilites/dbPool');
const connection = require('./utilites/db2')
const bodyParser = require("body-parser");
const check_auth = require("./middleWares/check_authentication");
const multer = require('multer');
const addImage = require('./models/addImages');
const app = express();

//router

const AuthRouter = require("./routers/AuthRouter");
const RolesRouter = require("./routers/RolesRouter");
const privilegesRouter = require("./routers/PrivilegesRouter");
const locationRouter = require("./routers/locationRouter");
const clinicsRouter = require("./routers/clinicsRouter");
const travelAgent = require("./routers/travelAgencyRouter");
const server = http.createServer(app);

// app.use((req, res, next) => {
//     db.execute(
//         `insert into images (image_path, image_type, clinics_id, travel_agency_id) values (?, ?, ?, ?)`,
//         ['asdfsdafa', 0, -1,  -1]
//     );

// })

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join("images")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", AuthRouter);
app.use("/roles", RolesRouter);
app.use("/privileges", privilegesRouter);
// tested
app.use("/location", locationRouter);
// tested
app.use("/clinics", clinicsRouter);
app.use("/travelAgency", travelAgent);


server.listen(process.env.PORT || 3000);