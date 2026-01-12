// connect express js
const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");

const app = express();

// connect database connection function
const connectDatabase = require("./databaseConnect");

dotenv.config();

// connect database to mongodb database
connectDatabase();

const PORT = process.env.PORT || 5000

// Request json
app.use(require("express").json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(require('express').json())

// required the visitor app list router
// routes of all visitor app
const userRoutes = require('./routes/user-routes')
const authRoutes = require('./routes/auth-routes')
const visitorRoutes = require('./routes/visitor-routes')
const appointmentRoutes = require('./routes/appointment-routes')
const passRoutes = require('./routes/pass-routes')
const checklogRoutes = require('./routes/checklog-routes')

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

// start the server
app.listen(PORT, () => {
  console.log(`Visitor Management Backend is running with listening on port http://localhost:${PORT}`);
});
