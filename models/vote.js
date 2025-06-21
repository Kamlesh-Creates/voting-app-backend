const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',     // Reference to your User model
    required: true,
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election', // Reference to your Election model
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate', // Reference to your Candidate (or Person) model
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
  }
});

// Prevent user from voting multiple times in the same election
voteSchema.index({ user: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
