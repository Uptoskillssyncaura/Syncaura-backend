import mongoose from "mongoose";

const connectDB = async () => {
  const tryConnect = async (uri) => {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log("Connected DB:", mongoose.connection.name);
    return conn;
  };

  try {
    await tryConnect(process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);

    // If SRV DNS lookup is refused (querySrv EREFUSED) and a fallback is provided, try it
    if ((error.code === 'EREFUSED' || (error.message && error.message.includes('querySrv'))) && process.env.MONGO_URI_FALLBACK) {
      console.log("SRV DNS lookup failed; attempting non-SRV fallback from MONGO_URI_FALLBACK...");
      try {
        await tryConnect(process.env.MONGO_URI_FALLBACK);
        return; // success
      } catch (fallbackError) {
        console.error("Fallback connection failed:", fallbackError);
      }
    }

    console.error("Unable to connect to MongoDB. Tips: check network/DNS, disable VPN/firewall, or set a non-SRV 'MONGO_URI_FALLBACK' in your .env.");
    process.exit(1);
  }
};

export default connectDB;
