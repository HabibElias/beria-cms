import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { PageHeader } from "../components/page-header";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import BookSchema from "../models/BookSchema";
import { toast } from "sonner";
import useAddBooks from "../hooks/useAddBooks";
import useCategories from "../hooks/useCategories";
import { Skeleton } from "../components/ui/skeleton";

type FormData = z.infer<typeof BookSchema>;

export default function AddBookPage() {
  // form
  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      condition: "excellent",
      category_id: 1,
    },
  });

  const condition = watch("condition");
  const category_id = watch("category_id");

  const { mutate, isPending } = useAddBooks();
  const { data: categories, isLoading: catIsLoading } = useCategories();

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        toast.success("Book added successfully!");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Book"
        description="Add a new book to your berea-cms collection"
      >
        <Button variant="outline" asChild>
          <Link to="/books">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="title">
                      Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter book title"
                      {...register("title")}
                    />
                    {errors.title && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.title.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="author">
                      Author <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="author"
                      placeholder="Enter author name"
                      {...register("author")}
                    />
                    {errors.author && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.author.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      placeholder="Publisher name"
                      {...register("publisher")}
                    />
                    {errors.publisher && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.publisher.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="publication-year">
                      Publication Year <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="publication-year"
                      placeholder="2025"
                      type="number"
                      {...register("published_year")}
                    />
                    {errors.published_year && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.published_year.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pages">
                      Pages <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="pages"
                      placeholder="Number of pages"
                      type="number"
                      {...register("pages")}
                    />
                    {errors.pages && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.pages.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="location">
                      Shelf Location <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., A-12, B-05"
                      {...register("location")}
                    />
                    {errors.location && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.location.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="condition">
                      Condition <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={condition}
                      onValueChange={(value) =>
                        setValue(
                          "condition",
                          value as "excellent" | "good" | "bad"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="bad">Bad</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.condition && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.condition.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category">
                      Category <span className="text-red-400">*</span>
                    </Label>
                    {!catIsLoading ? (
                      <Select
                        value={category_id?.toString()}
                        onValueChange={(value) =>
                          setValue("category_id", Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                        <Skeleton className="w-1/2 h-10 rounded-md" />
                    )}
                    {errors.category_id && (
                      <div className="text-xs mt-2 text-red-400">
                        <p>{errors.category_id.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the book (optional)"
                    rows={3}
                    {...register("description")}
                  />
                  {errors.description && (
                    <div className="text-xs mt-2 text-red-400">
                      <p>{errors.description.message}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any internal notes about the book (optional)"
                    rows={2}
                    {...register("notes")}
                  />
                  {errors.notes && (
                    <div className="text-xs mt-2 text-red-400">
                      <p>{errors.notes.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
                  <Button variant="outline" asChild>
                    <Link to="/books">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Book"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
