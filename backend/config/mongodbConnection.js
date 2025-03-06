import mongoose from "mongoose";

const mongoConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGODBCONNECTION_URL, {
      connectTimeoutMS: 30000, 
    });
    console.log(`MONGODB CONNECTED: ${connected.connection.host}:${connected.connection.port}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);  
  }
};

export default mongoConnect;