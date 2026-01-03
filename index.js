const express = require('express')

const app = express()

const cors = require('cors')

const mongoose = require('mongoose')

require('dotenv').config()

// Rounts
const userRoutes = require('./routes/user-routes')
const authRoutes = require('./routes/auth-routes')
const visitorRoutes = require('./routes/visitor-routes')
const appointmentRoutes = require('./routes/appointment-routes')
const passRoutes = require('./routes/pass-routes')
const checklogRoutes = require('./routes/checklog-routes')


// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(require('express').json())


// Sample Route
app.get('/', (req, res) => {
  res.send('Visitor Management Backend is running')
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/visitor', visitorRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/pass', passRoutes)
app.use('/api/checklog', checklogRoutes)

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Start Server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} and connected to MongoDB`)
    })

  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  })



