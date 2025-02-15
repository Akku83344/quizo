export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  teacherId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateQuizDto {
  title: string;
  description: string;
}

export interface UpdateQuizDto {
  title?: string;
  description?: string;
}
