# Quizo - Quiz Management System

## Overview
Quizo is a **Quiz Management System** designed for teachers to create, manage, and view their quizzes efficiently. The platform provides an intuitive interface for teachers to log in, create quizzes, edit existing quizzes, and delete them as needed.

## Features
- **User Authentication**: Secure login system for teachers.
- **Quiz Management**:
  - Create quizzes with multiple questions.
  - Edit and update existing quizzes.
  - Delete quizzes when no longer needed.
  - View all quizzes in a structured dashboard.
- **Responsive Design**: Built using **ShadCN UI components** for a clean and modern user experience.
- **SQL Database**: Uses **PostgreSQL** to store user credentials and quiz data.

## Tech Stack
### **Frontend:**
- **React.js** (for UI development)
- **ShadCN UI** (for modern and accessible components)
- **Tailwind CSS** (for styling)
- **TypeScript** (for type safety and scalability)

### **Backend:**
- **Node.js with Express.js** (for API development)
- **TypeScript** (for backend logic)
- **JWT Authentication** (for secure user login)
- **PostgreSQL Database** (hosted on Neon.tech for data storage)

## Installation & Setup
### Prerequisites:
- **Node.js** (>= 16.x)
- **npm** or **yarn**
- **PostgreSQL** installed and configured

### Steps:
1. **Clone the repository**:
   ```sh
   git clone https://github.com/Akku83344/quizo.git
   cd quizo
   ```
2. **Install dependencies**:
   ```sh
   # For frontend
   cd frontend
   npm install   # or yarn install
   ```
   ```sh
   # For backend
   cd backend
   npm install   # or yarn install
   ```
3. **Configure Environment Variables**:
   - Create a `.env` file in the backend directory.
   - Add database credentials, JWT secret, and other configurations:
     ```env
     PORT=8000
     DATABASE_URL=your_postgresql_database_url_here
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRES_IN=24h
     ```
   - Create a `.env` file in the frontend directory:
     ```env
     VITE_API_URL=http://localhost:8000/api
     ```
4. **Run the Backend**:
   ```sh
   cd backend
   npm run dev  # or yarn dev
   ```
5. **Run the Frontend**:
   ```sh
   cd frontend
   npm run dev  # or yarn dev
   ```
6. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Contribution
Feel free to contribute to **Quizo** by submitting issues and pull requests.

## License
This project is licensed under the **MIT License**.

---

🚀 **Happy Coding!**

