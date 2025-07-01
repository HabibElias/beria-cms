import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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
import apiClient from "../services/Apiclient";

const BookSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(3, { message: "Title must be between 3 and 100 characters" })
    .max(100),
  author: z
    .string({ message: "Author is required" })
    .min(3, { message: "Author must be between 3 and 100 characters" })
    .max(100),
  category_id: z
    .number({ message: "Category is required" })
    .positive({ message: "Category must be a valid ID" }),
  publisher: z.string().optional(),
  published_year: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, {
      message: "Published Year must be a positive number",
    })
    .transform((val) => Number(val)),
  pages: z
    .union([z.string(), z.number()])
    .refine((val) => Number(val) > 0, {
      message: "Pages must be a positive number",
    })
    .transform((val) => Number(val)),
  location: z
    .string({ message: "Location is required" })
    .min(1, { message: "Location must be at least 1 character" })
    .max(10, { message: "Location must be at most 10 characters" }),
  condition: z.enum(["excellent", "good", "bad"], {
    message: "Condition is required",
  }),
  description: z
    .string({ message: "Description is required" })
    .min(3, { message: "Description must be between 3 and 400 characters" })
    .max(400),
  notes: z.string().optional(),
});

interface CreateBookResponse {
  status: boolean;
  message: string;
}

type FormData = z.infer<typeof BookSchema>;

export default function AddBookPage() {
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

  const onSubmit = async (data: FormData) => {
    console.log(data);

    try {
      const response = (
        await apiClient.post<CreateBookResponse>("/books", data)
      ).data;

      toast.success(response.message);

      reset();
    } catch (error: any) {
      console.error(error);
      if (error.response.data.errors) {
        for (const key in error.response.data.errors) {
          toast.error(
            error.response.data.errors[key][0] ?? "An unknown error occurred"
          );
        }
      }
    }
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
                    <Select
                      value={category_id?.toString()}
                      onValueChange={(value) =>
                        setValue("category_id", Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Christian Living</SelectItem>
                        <SelectItem value="2">Devotional</SelectItem>
                        <SelectItem value="3">Apologetics</SelectItem>
                        <SelectItem value="4">Theology</SelectItem>
                        <SelectItem value="5">Biography</SelectItem>
                        <SelectItem value="6">Youth</SelectItem>
                        <SelectItem value="7">Children</SelectItem>
                        <SelectItem value="8">Marriage & Family</SelectItem>
                        <SelectItem value="9">Leadership</SelectItem>
                        <SelectItem value="10">Bible Study</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Button type="submit">Add Book</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
