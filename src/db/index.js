// JDougDPVGwqLqZOg
// npm install mongodb

// mongodb+srv://ankitpatelfortwitter_db_user:JDougDPVGwqLqZOg@cluster0.qlbckmp.mongodb.net/?appName=Cluster0

// UXemNZpFJnLLZQQg

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n Connected to MongoDB !! DB HOST: ${connectionInstance.connection.host} `);
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1); 
    }
};

export default connectDB;