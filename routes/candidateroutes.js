    const express=require('express')
    const router=express.Router();
    const Candidate=require('./../models/candidate')
    const {jwtauthmiddleware,generatetoken}=require('./../jwt')
    const User=require('./../models/user')

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



    //POST route to add new candidate   
    router.post('/addcandidate',jwtauthmiddleware,async (req,res)=>{
        

        try{
            // if(! await checkAdminRole(req.user.id)){
            //     return res.status(404).json({message:"User not allowed"});
            // }else{
            //     console.log('admin found')
            // }
        const data=req.body
        const newCandidate=new Candidate(data);
        const response= await newCandidate.save();
        console.log("data saved")
        
        res.status(200).json({response:response});
        }
        
    catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'})
    }
    })


    //PUT route to update the candidate
    router.put('/:candidateId',jwtauthmiddleware,async (req,res)=>{
        

        try{
    if(!(await checkAdminRole(req.user.id))){
                return res.status(404).json({message:"User Has Not Admin Role"});
            }
    const candidateId=req.params.candidateId
    const updatecandidatedata=req.body
    const response=await Candidate.findByIdAndUpdate(candidateId,updatecandidatedata,{
        new:true,
        runValidators:true,
    })

    if(!response){
        return res.status(404).json({error:"candidate not found"})
    }
    console.log(" candidate data updated")
    res.status(200).json(response)


    
        }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'})
        }
    })


    // DELETE the candidate by admin
    router.delete('/deletecandidate/:id', jwtauthmiddleware, async (req, res) => {
        


        
    try {

        if (!(await checkAdminRole(req.user.id))) {
    return res.status(403).json({ message: "User does not have admin privileges" });
    }
        const candidateId = req.params.id;
        const response = await Candidate.findByIdAndDelete(candidateId);

        if (!response) {
        return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log("Candidate deleted");
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });


    //POST for vote the candidate through Id
    router.post('/vote/:candidateId', jwtauthmiddleware, async (req, res) => {
        

  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  const { electionId } = req.body;

  if (!electionId) {
    return res.status(400).json({ message: "Election ID is required" });
  }

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: "Admin not allowed to vote" });
    }

    // Check if user already voted in this election
    const alreadyVoted = user.votes.some(vote => vote.electionId.toString() === electionId);
    if (alreadyVoted) {
      return res.status(400).json({ message: "User has already voted in this election" });
    }

    // Update candidate votes - optionally you can check if candidate belongs to this election too
    candidate.votecount++;
    await candidate.save();

    // Add vote to user's votes array
    user.votes.push({ electionId, candidateId });
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

    //vote count

    router.get('/vote/count',jwtauthmiddleware,async(req,res)=>{
        try{
        const candidate = await Candidate.find().sort({ votecount: -1 }).lean();
        const voterecord=candidate.map((data)=>{
            return{
                party:data.party,
                count:data.votecount
            }
        });
        return res.status(200).json(voterecord)
        }catch(err){
            console.log(err)
            res.status(500).json({error:'internal server error'})
        }
    })
    //GET for check candidate list
        router.get('/candidates',jwtauthmiddleware,async(req,res)=>{
        try {
            const candidate=await Candidate.find()
            const candidaterecord=candidate.map((data)=>{
                return{
                    name:data.name,
                    age:data.age,
                    party:data.party,
                    symbolURL:data.symbolURL,
                    photoURL:data.photoURL,
                    constituency:data.constituency,
                    votecount:data.votecount,
                    _id: data._id, 
                    
                
                }
            });
            return res.status(200).json(candidaterecord)
            
        } catch (error) {
            console.log(error)
        }
        })





    module.exports=router
    //comment add for Testing Purpose V.2.0