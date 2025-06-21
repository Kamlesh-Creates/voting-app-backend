const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  name: String,
  description:String,
  startDate: Date,
  endDate: Date,
  isActive: Boolean
});

module.exports = mongoose.model('Election', ElectionSchema);
