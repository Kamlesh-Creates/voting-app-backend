const express = require('express');
const router = express.Router();
const {jwtauthmiddleware}=require('./../jwt')

const User=require('./../models/user')

// Check if user has voted in a specific election
router.get('/status/:electionId', jwtauthmiddleware, async (req, res) => {
  const { electionId } = req.params;
  const userId = req.user.id;

  try {
    // Fetch user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if votes array has an entry with this electionId
    const hasVoted = user.votes.some(vote => vote.electionId.toString() === electionId);

    return res.json({ hasVoted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
