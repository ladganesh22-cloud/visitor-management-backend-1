// connect express js
const express = require("express");
// Cross-Origin Resource Sharing then browser allow to fronend to access this backend
const cors = require("cors");
// this dotenv used for load variables from .env file into process.env
const dotenv = require("dotenv");
// this app used for create backend server instance
const app = express();
// connect database connection function
const connectDatabase = require("./databaseConnect");

dotenv.config();

// connect database to mongodb database
connectDatabase();

// required the visitor app list router
// routes of all visitor app
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const visitorRoutes = require('./routes/visitor-routes');
const appointmentRoutes = require('./routes/appointment-routes');
const passRoutes = require('./routes/pass-routes');
const checklogRoutes = require('./routes/checklog-routes');
const not404Found = require("./middlewares/not404found");


// Request json
app.use(require("express").json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/visitor', visitorRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/pass', passRoutes)
app.use('/api/checklog', checklogRoutes)

// sample route
app.get("/", (req, res) => {
  res.send('Visitor Management Backend is running!!!!!!!!')
});

app.use(not404Found);

// use PORT from .env
const PORT = process.env.PORT || 5000

// start the backend server
app.listen(PORT, () => {
  console.log(`Visitor Management Backend is running with listening on port http://localhost:${PORT}`);
});
