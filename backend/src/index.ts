import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import quizRoutes from "./routes/quiz.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
