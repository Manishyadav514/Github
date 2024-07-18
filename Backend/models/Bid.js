const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  tenderId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  bidTime: Date,
  bidCost: Number,
});

module.exports = mongoose.model('Bid', bidSchema);