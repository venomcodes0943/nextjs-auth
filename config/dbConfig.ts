import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_DB_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("DB Connected Successfully");
    });

    connection.off("error", (err) => {
      console.log("DB Connected Error make sure DB is up and running", err);
      process.exit();
    });
  } catch (error) {
    console.log(`Error while connecting DB:`, error);
  }
}
