import axios from "axios";

interface Quiz {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL environment variable is not defined");
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const register = async (username: string, password: string) => {
  const response = await api.post("/auth/register", { username, password });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Quiz API
export const getQuizzes = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  sort: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Quiz>> => {
  const response = await api.get("/quizzes", {
    params: {
      page,
      limit,
      search,
      sort,
    },
  });
  return response.data;
};

export const getQuiz = async (id: number) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

export const createQuiz = async (title: string, description: string) => {
  const response = await api.post("/quizzes", { title, description });
  return response.data;
};

export const updateQuiz = async (
  id: number,
  title: string,
  description: string
) => {
  const response = await api.put(`/quizzes/${id}`, { title, description });
  return response.data;
};

export const deleteQuiz = async (id: number) => {
  const response = await api.delete(`/quizzes/${id}`);
  return response.data;
};
