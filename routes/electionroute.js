const express = require("express");
const Election = require("./../models/election");
const User=require("./../models/user")
const router = express.Router();
const { jwtauthmiddleware, generatetoken } = require("./../jwt");

 const checkAdminRole=async(userId)=>{
    try{
        const user=await User.findById(userId)
        if(user.role === 'admin'){
            return true
        }
    }catch(err){
        return false
    }
    }

router.get("/current",jwtauthmiddleware, async (req, res) => {
  

  try {
    const currentElection = await Election.findOne({ isActive: true });
    console.log(currentElection)
    if (!currentElection) {
      return res.status(404).json({ message: "No active election found" });
    }
    res.status(200).json(currentElection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/data", async (req, res) => {
  try {
    const electiondata = await Election.find();

    res.status(200).json(electiondata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/create", jwtauthmiddleware, async (req, res) => {
  

  try {
    const { name, startDate, endDate, description, isActive } = req.body;

    if (!name || !startDate || !endDate) {
      return res
        .status(404)
        .json({ message: "Name, startDate and endDate isActive are required" });
    }

    // Optional: you can set isActive here or default to false
    const newElection = new Election({
      name,
      startDate,
      endDate,
      description,
      isActive, // or true if you want this election active immediately
    });

    const savedElection = await newElection.save();

    res.status(201).json({
      message: "Election created successfully",
      election: savedElection,
    });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//DELETE the election bt id
router.delete("/deleteelection/:id", jwtauthmiddleware, async (req, res) => {
  

  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res
        .status(403)
        .json({ message: "User does not have admin privileges" });
    }
    const electionId = req.params.id;
    const response = await Election.findByIdAndDelete(electionId);

    if (!response) {
      return res.status(404).json({ error: "Election not found" });
    }

    console.log("Election deleted");
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PUT Update the election
    router.put('/update/:electionId',jwtauthmiddleware,async (req,res)=>{
      

        try{
    if(!(await checkAdminRole(req.user.id))){
                return res.status(404).json({message:"User Has Not Admin Role"});
            }
    const electionId=req.params.electionId
    const updateelectiondata=req.body
    const response=await Election.findByIdAndUpdate(electionId,updateelectiondata,{
        new:true,
        runValidators:true,
    })

    if(!response){
        return res.status(404).json({error:"Election not found"})
    }
    console.log(" Election data updated")
    res.status(200).json(response)
    
        }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'})
        }
    })


module.exports = router;
