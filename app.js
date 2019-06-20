//dependencies
const fs = require('fs');
const http = require("http");
const path = require("path");
const cors = require("cors");
const express = require("express");
const db = require("./utilites/db");
const dbPool = require("./utilites/dbPool");
const connection = require("./utilites/db2");
const bodyParser = require("body-parser");
const check_auth = require("./middleWares/check_authentication");
const multer = require('multer');
const app = express();
const createFolders = require('./utilites/folders');
const contorller = require('./controllers/clinicsController');
const procedureModel = require("./models/procedureModel");
//router

const AuthRouter = require("./routers/AuthRouter");
const RolesRouter = require("./routers/RolesRouter");
const privilegesRouter = require("./routers/PrivilegesRouter");
const locationRouter = require("./routers/locationRouter");
const clinicsRouter = require("./routers/clinicsRouter");
const travelAgent = require("./routers/travelAgencyRouter");
const trips = require("./routers/trips");
const generalRouter = require("./routers/crudRouter");

const procedureRouter = require("./routers/procedureRouter");

const server = http.createServer(app);

createFolders.createFolders();


//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join("upload/images")));
console.log(path.join('images'))
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());



app.use("/auth", AuthRouter);
app.use("/roles", RolesRouter);
app.use("/privileges", privilegesRouter);
// tested
app.use("/general", generalRouter);
app.use("/location", locationRouter);
// tested
app.use("/clinics", clinicsRouter);
app.use("/travelAgency", travelAgent);
app.use("/trips", trips);


app.use("/procedure", procedureRouter);



app.use('/', (req, res, next) => {
    res.status(404).json({
        message: 'http Not found!!'
    });
});


server.listen(process.env.PORT || 3000);