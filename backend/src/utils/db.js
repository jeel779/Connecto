import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
const connectDB=async()=>{
  try {
    let uri = process.env.MONGODB_URI;
    if (uri.includes('?')) {
      const [base, query] = uri.split('?');
      uri = base.endsWith('/') ? `${base}${DB_NAME}?${query}` : `${base}/${DB_NAME}?${query}`;
    } else {
      uri = uri.endsWith('/') ? `${uri}${DB_NAME}` : `${uri}/${DB_NAME}`;
    }
    const connectionInstance = await mongoose.connect(uri);
    console.log(`\n MognoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED:", error);
    process.exit(1);
  }
}
export default connectDB;