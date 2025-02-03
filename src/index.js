import "dotenv/config"
import app from "./app.js"
import connectDB from "./db/db.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`SERVER is running at PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed", error);
  });