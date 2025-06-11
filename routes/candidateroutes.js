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
router.post('/',jwtauthmiddleware,async (req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id)){
            return res.status(404).json({message:"User not allowed"});
        }else{
            console.log('admin found')
        }
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

//DELETE the candidate by admin
router.delete('/:candidateId',jwtauthmiddleware,async (req,res)=>{
    try{
if(!(await checkAdminRole(req.user.id))){
            return res.status(403).json({message:"User Has Not Admin Role"});
        }
const candidateId=req.params.candidateId
const updatecandidatedata=req.body
const response=await Candidate.findByIdAndDelete(candidateId);

if(!response){
    return res.status(404).json({error:"candidate not found"})
}
console.log(" candidate deleted")
res.status(200).json(response)


  
    }catch(err){
console.log(err);
res.status(501).json({error:'internal server error'})
    }
})

//POST for vote the candidate through Id
router.post('/vote/:candidateId',jwtauthmiddleware,async(req,res)=>{
    candidateId=req.params.candidateId;
    userId=req.user.id;

    try{
     const candidate=await Candidate.findById(candidateId)
     if(!candidate){
        return res.status(404).json({message:"candidate not found"})
     }

     const user = await User.findById(userId)
     if(!user){
        return res.status(404).json({message:"user not found"})
     }

     if(user.isvoted){
       return res.status(400).json({message:"User is Already Voted"})
     }
     if(user.role=='admin'){
       return res.status(403).json({message:"Admin Not Allowed to Vote"})
     }
// update the candidate document
     candidate.votes.push({user:userId})
     candidate.votecount++;
     await candidate.save()

     // update the user document
     user.isvoted=true
     await user.save();
     res.status(200).json({message:"Vote Recorded Successfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'})
    }
})

//vote count

router.get('/vote/count',async(req,res)=>{
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
router.get('/candidates',async(req,res)=>{
try {
    const candidate=await Candidate.find()
    const candidaterecord=candidate.map((data)=>{
        return{
            name:data.name,
            age:data.age,
            party:data.party
           
        }
    });
    return res.status(200).json(candidaterecord)
    
} catch (error) {
    console.log(error)
}
})


module.exports=router
//comment add for Testing Purpose V.2.0