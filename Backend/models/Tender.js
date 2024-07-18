const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  name: String,
  description: String,
  startTime: Date,
  endTime: Date,
  bufferTime: Number,
});

module.exports = mongoose.model('Tender', tenderSchema);