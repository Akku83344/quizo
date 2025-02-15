import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateEditQuiz from "./pages/CreateEditQuiz";

interface User {
  username: string;
  isAuthenticated: boolean;
}

function App() {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : { username: "", isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = (username: string) => {
    setUser({ username, isAuthenticated: true });
  };

  const logout = () => {
    setUser({ username: "", isAuthenticated: false });
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/login"
            element={
              user.isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={login} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user.isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user.isAuthenticated ? (
                <Dashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/quiz/create"
            element={
              user.isAuthenticated ? (
                <CreateEditQuiz />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/quiz/edit/:id"
            element={
              user.isAuthenticated ? (
                <CreateEditQuiz />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
