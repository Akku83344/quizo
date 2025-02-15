import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import * as api from "@/lib/api";
import SearchInput from "@/components/SearchInput";

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sort = (searchParams.get("sort") || "desc") as "asc" | "desc";

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuizzes = useCallback(async () => {
    try {
      const response = await api.getQuizzes(page, 6, search, sort);
      setQuizzes(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch quizzes");
    }
  }, [page, search, sort]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      await api.deleteQuiz(id);
      toast.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete quiz");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      const current = new URLSearchParams(searchParams);
      current.set("page", newPage.toString());
      setSearchParams(current);
    },
    [searchParams, setSearchParams]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const current = new URLSearchParams(searchParams);
      current.set("sort", value);
      setSearchParams(current);
    },
    [searchParams, setSearchParams]
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
            <p className="text-muted-foreground">Manage your quizzes</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none" onClick={() => navigate("/quiz/create")}>
              Create New Quiz
            </Button>
            <Button className="flex-1 sm:flex-none" variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput />
          </div>
          <Select defaultValue={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle className="break-words">{quiz.title}</CardTitle>
                <CardDescription>
                  Created on {new Date(quiz.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 break-words">
                  {quiz.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1" variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the quiz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(quiz.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {quizzes.length === 0 && (
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4 text-center">
                {search
                  ? "No quizzes found matching your search"
                  : "No quizzes found"}
              </p>
              <Button onClick={() => navigate("/quiz/create")}>
                Create Your First Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {totalPages > 1 && (
          <div className="mt-6 overflow-x-auto">
            <Pagination className="min-w-full flex justify-center">
              <PaginationContent className="flex flex-wrap justify-center gap-2">
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    ←
                  </Button>
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={page === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    →
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
