require('dotenv').config();
const app = require('./index');
const dbConnect =require('./config/database');
const { verifyConnection } = require('./config/redis');

async function startServer(){
    
   try{
     dbConnect();

     verifyConnection();

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}
)
   }catch(eroor){
    console.error("❌ Failed to start the server:", error.message);
   }

}

startServer();