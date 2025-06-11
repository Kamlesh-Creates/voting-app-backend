const express=require("express")
const db=require('./DB')

require('dotenv').config();
const app=express()
const createAdmin=require('./admin')


const bodyParser=require('body-parser')
app.use(bodyParser.json());



const userroutes=require('./routes/userroutes')
const candidateroutes=require('./routes/candidateroutes')
app.use('/user',userroutes)
app.use('/candidate',candidateroutes)

app.get('/', (req, res) => {
  res.send('Hello World');
});


const startServer = async () => {
  try {
    await createAdmin();  
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
  }
};
startServer()
