const express=require('express')
const router=express.Router();
const User=require('./../models/user')
const {jwtauthmiddleware,generatetoken}=require('./../jwt')

router.post('/signup',async (req,res)=>{
    try{
    const data=req.body
    const newUser=new User(data);
    const response= await newUser.save();
    console.log("data saved")

    const payload={
        id:response.id
        
    }

    const token=generatetoken(payload)
    
    res.status(200).json({response:response,token:token});
    }
    
catch(err){
console.log(err);

}
})


router.post('/login',async(req,res)=>{
    try {
        //extract the username and password
        const{aadharnumber,password}=req.body;
        //find user in database
        const user=await User.findOne({aadharnumber:aadharnumber})
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:"invalid username or password"})
        }

        //generate token
        const payload={
            id:user.id,
            role: user.role,
            isvoted:user.isvoted

        }
        const token=generatetoken(payload);

        res.json({token,role: user.role ,isvoted:user.isvoted})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
})

router.get('/profile',jwtauthmiddleware,async(req,res)=>{
    try {
        const userdata=req.user;
        const userid=userdata.id;
        const user = await User.findById(userid)
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
})

//PUT for update the user password
router.put('/profile/password',jwtauthmiddleware,async (req,res)=>{
    try{
  const userId=req.user
  const {currentPassword,newPassword}=req.body
  const user=await User.findById(userId)

  //if password does not match return error
  if(!(await user.comparePassword(currentPassword))){
    return res.status(401).json({error:"invalid username or password"})
  }
  user.password=newPassword
  await user.save()
  console.log("password updated")
  res.status(200).json({message:"Password Updated"})
    }catch(err){
console.log(err);
res.status(500).json({error:'internal server error'})
    }
})

// get to get vote status
  // GET /api/vote/status/:electionId
router.get('/status/:electionId', jwtauthmiddleware, async (req, res) => {
  const { electionId } = req.params;
  const userId = req.user.id;

  try {
    const vote = await Vote.findOne({ user: userId, election: electionId });
    if (vote) {
      return res.json({ hasVoted: true });
    }
    return res.json({ hasVoted: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports=router
