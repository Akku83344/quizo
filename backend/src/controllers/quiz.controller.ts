import { Request, Response } from "express";
import { db } from "../db";
import { quizzes } from "../db/schema";
import { eq, and, ilike, or, desc, sql, asc } from "drizzle-orm";
import { CreateQuizDto, UpdateQuizDto } from "../types";

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const search = (req.query.search as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) === "asc" ? "asc" : "desc";
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizzes)
      .where(
        and(
          eq(quizzes.teacherId, teacherId!),
          or(
            ilike(quizzes.title, `%${search}%`),
            ilike(quizzes.description, `%${search}%`)
          )
        )
      );

    const total = Number(countResult[0].count);

    // Get paginated results with sorting
    const result = await db
      .select()
      .from(quizzes)
      .where(
        and(
          eq(quizzes.teacherId, teacherId!),
          or(
            ilike(quizzes.title, `%${search}%`),
            ilike(quizzes.description, `%${search}%`)
          )
        )
      )
      .limit(limit)
      .offset(offset)
      .orderBy(
        sort === "asc" ? asc(quizzes.createdAt) : desc(quizzes.createdAt)
      );

    res.json({
      data: result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.id;

    const result = await db
      .select()
      .from(quizzes)
      .where(
        and(eq(quizzes.id, parseInt(id)), eq(quizzes.teacherId, teacherId!))
      )
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description }: CreateQuizDto = req.body;
    const teacherId = req.user?.id;

    const result = await db
      .insert(quizzes)
      .values({
        title,
        description,
        teacherId: teacherId!,
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description }: UpdateQuizDto = req.body;
    const teacherId = req.user?.id;

    const result = await db
      .update(quizzes)
      .set({
        title,
        description,
        updatedAt: new Date(),
      })
      .where(
        and(eq(quizzes.id, parseInt(id)), eq(quizzes.teacherId, teacherId!))
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.id;

    const result = await db
      .delete(quizzes)
      .where(
        and(eq(quizzes.id, parseInt(id)), eq(quizzes.teacherId, teacherId!))
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
