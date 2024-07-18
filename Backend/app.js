const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tenderRoutes = require('./routes/tenderRoutes');
const bidRoutes = require('./routes/bidRoutes');
const authenRoutes = require('./routes/authenRoutes');
const moment = require('moment')

const app = express();

// Middleware
// app.use(bodyParser.json());
// Add middleware to set Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Routes
app.use('/api/tenders', tenderRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/auth', authenRoutes);

const PORT = process.env.PORT || 5000;

app.get('/date', (req, res) => {
  let date = moment().format()
  let momentDate = moment().add(2, 'hours').format()
  res.json({
    momentDate: momentDate,
    curr: date
  })
})

// MongoDB Connection
mongoose.connect('mongodb+srv://user:user1234@cluster0.xvkmelf.mongodb.net/tenderManagement', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
