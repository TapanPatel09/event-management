const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const userroutes = require("./routes/user.routes");
const eventroutes = require("./routes/event.routes.js");
const paymnetroutes = require("./routes/payment.routes.js");
const participanteroutes = require("./routes/participate.routes.js");
const volunteerroutes = require("./routes/volunteer.routes.js");
const analyticsroutes = require("./routes/analytics.routes.js");
const aicall = require("./routes/aicall.routes.js");
const indexroutes = require("./routes/index.routes");
const ConnectTODB = require("./config/db.ts");
const cookieparser = require("cookie-parser");

ConnectTODB();

app.set("view engine", "ejs");
app.use(
  cors({
    origin: ["https://easeevents-cb281.web.app", "http://localhost:5173"],
    credentials: true,
  })
);





app.use(express.static("public"));
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/", indexroutes);
app.use("/user", userroutes);
app.use("/payment", paymnetroutes);
app.use("/event", eventroutes);
app.use("/participant", participanteroutes);
app.use("/volunteer", volunteerroutes);
app.use("/anal", analyticsroutes);
app.use("/ai", aicall);

const http = require("http");
const socket = require("./socket");

const server = http.createServer(app);
socket.init(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} use it`));
