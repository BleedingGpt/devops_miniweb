import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔌 Connect MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 👤 User Schema
const userSchema = new mongoose.Schema({
  username: String,
});

const User = mongoose.model("User", userSchema);

// 🔐 Login Route
app.post("/login", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username required" });
  }

  try {
    let user = await User.findOne({ username });

    if (!user) {
      user = await User.create({ username });
    }

    return res.json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
