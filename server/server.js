require('dotenv').config();
const app = require('./index');
const dbConnect =require('./config/database');
const { verifyConnection } = require('./config/redis');
const PORT = process.env.PORT || 3000

async function startServer(){
    
   try{
     dbConnect();

     verifyConnection();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}
)
   }catch(eroor){
    console.error("❌ Failed to start the server:", error.message);
   }

}

startServer();