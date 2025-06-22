const express=require("express")
const db=require('./DB')
const cors = require('cors');

require('dotenv').config();
const app=express()
const createAdmin=require('./admin')
const verifyAdmin = require('./verifyadmin');

const corsOptions = {
  origin:"https://voting-app-frontend-psi.vercel.app",
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
const bodyParser=require('body-parser')
app.use(bodyParser.json());
app.use(cors(corsOptions))


app.get('/admin/dashboard', verifyAdmin, (req, res) => {
  console.log("adminfound")
  res.json({ message: 'Welcome admin!' });
});


const userroutes=require('./routes/userroutes')
const candidateroutes=require('./routes/candidateroutes');
const electionroutes=require("./routes/electionroute");
const voteroute=require("./routes/voteroute")

const { jwtauthmiddleware } = require("./jwt");
app.use('/user',userroutes)
app.use('/candidate',candidateroutes)
app.use('/election',electionroutes)
app.use('/vote',voteroute)


app.get('/verify',jwtauthmiddleware, (req, res) => {
  res.send('voting app backend side');
});


const startServer = async () => {
  try {
    await createAdmin();  
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
  }
};
startServer()
