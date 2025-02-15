import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function CreateEditQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const fetchQuiz = useCallback(
    async (quizId: number) => {
      try {
        const data = await api.getQuiz(quizId);
        form.reset({
          title: data.title,
          description: data.description,
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch quiz");
        navigate("/dashboard");
      } finally {
        setIsFetching(false);
      }
    },
    [form, navigate]
  );

  useEffect(() => {
    if (isEditing && id) {
      fetchQuiz(parseInt(id));
    }
  }, [isEditing, id, fetchQuiz]);

  const onSubmit = useCallback(
    async (data: QuizFormValues) => {
      try {
        setIsLoading(true);
        if (isEditing && id) {
          await api.updateQuiz(parseInt(id), data.title, data.description);
          toast.success("Quiz updated successfully");
        } else {
          await api.createQuiz(data.title, data.description);
          toast.success("Quiz created successfully");
        }
        navigate("/dashboard");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to save quiz");
      } finally {
        setIsLoading(false);
      }
    },
    [id, isEditing, navigate]
  );

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-2xl px-4">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex justify-center items-center">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter quiz title"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter quiz description"
                          className="min-h-[150px]"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? isEditing
                        ? "Updating..."
                        : "Creating..."
                      : isEditing
                      ? "Update Quiz"
                      : "Create Quiz"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
