import { Router } from "express";
import {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quiz.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getQuizzes);
router.get("/:id", getQuiz);
router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;
