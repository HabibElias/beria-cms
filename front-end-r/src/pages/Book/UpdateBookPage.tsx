import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2Icon, Plus } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import NotFound from "../../components/not-found";
import { BookCover } from "../../components/book-cover";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Textarea } from "../../components/ui/textarea";
import { uploadBookImage } from "../../services/bookImages";
import useBook from "../../hooks/book/useBook";
import useUpdateBook from "../../hooks/book/useUpdateBook";
import useCategories from "../../hooks/category/useCategories";
import BookSchema from "../../models/BookSchema";

type FormData = z.infer<typeof BookSchema>;

export default function UpdateBookPage() {
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
  });

  const { id } = useParams();

  const navigate = useNavigate();

  // getting the book from the db
  const { data: book, isLoading } = useBook(id ?? "");

  const condition = watch("condition") ?? book?.condition;
  const category_id =
    watch("category_id") ??
    (book?.category?.id ? String(book.category.id) : "");
  const [bookImg, setBookImg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [bookImgFile, setBookImgFile] = useState<File | null>(null);
  const { mutate, isPending: storeIsPending } = useUpdateBook();
  const { data: categories, isLoading: catIsLoading } = useCategories();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBookImgFile(file);
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBookImg(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setBookImg(null);
      }
    } else {
      setBookImgFile(null);
      setBookImg(null);
    }
  };
  const onSubmit = async (data: FormData) => {
    if (isPending || storeIsPending) return; // Prevent double submit
    if (bookImgFile) {
      setIsPending(true);
      try {
        const image = await uploadBookImage(bookImgFile);
        data.book_img = image.book_img;
        data.book_path = image.book_path;
      } catch {
        toast.error("Failed to upload image. Please try again.");
        return;
      } finally {
        setIsPending(false);
      }
    }
    mutate(
      { id: book?.id?.toString() ?? "", data: data },
      {
        onSuccess: () => {
          reset();
          setBookImg(null);
          setBookImgFile(null);

          toast.success("Book updated successfully!");
          navigate(`/admin/books/${book?.id}`);
        },
      },
    );
  };

  useLayoutEffect(() => {
    if (book) {
      const fields = {
        condition: book.condition,
        category_id: book.category.id,
        book_img: book.book_img,
        book_path: book.book_path ?? "",
        title: book.title,
        author: book.author,
        publisher: book.publisher ?? "",
        published_year: book.published_year ?? "",
        pages: book.pages,
        location: book.location,
        description: book.description,
        notes: book.notes,
      };
      (Object.keys(fields) as Array<keyof typeof fields>).forEach((key) => {
        if (fields[key]) setValue(key, fields[key]);
      });
    }
  }, [book, setValue]);

  if (!id) return <NotFound />;

  if (isLoading || catIsLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  if (!book) return <NotFound />;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Update a book"
        description="Keep the details ready for the next reader."
      >
        <Button variant="outline" asChild>
          <Link to="/admin/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label htmlFor="book-img">Book Image</Label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    name="book-img"
                    id="book-img"
                  />
                  <div className="mt-4 flex items-center gap-4">
                    <BookCover
                      key={bookImg || book.book_img || "no-cover"}
                      book={{ ...book, book_img: bookImg || book.book_img }}
                    />
                    <p className="text-muted-foreground max-w-56 text-sm">
                      {bookImg
                        ? "New cover preview. Save the book to upload it."
                        : "Choose a cover image, or keep the title-led jacket."}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter book title"
                      {...register("title")}
                    />
                    {errors.title && (
                      <div className="text-destructive mt-2 text-xs">
                        <p>{errors.title.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="author">
                      Author <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="author"
                      placeholder="Enter author name"
                      {...register("author")}
                    />
                    {errors.author && (
                      <div className="text-destructive mt-2 text-xs">
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
                      <div className="text-destructive mt-2 text-xs">
                        <p>{errors.publisher.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="publication-year">
                      Publication Year{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="publication-year"
                      placeholder="2025"
                      type="number"
                      {...register("published_year")}
                    />
                    {errors.published_year && (
                      <div className="text-destructive mt-2 text-xs">
                        <p>{errors.published_year.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pages">
                      Pages <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pages"
                      placeholder="Number of pages"
                      type="number"
                      {...register("pages")}
                    />
                    {errors.pages && (
                      <div className="text-destructive mt-2 text-xs">
                        <p>{errors.pages.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="location">
                      Shelf Location <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., A-12, B-05"
                      {...register("location")}
                    />
                    {errors.location && (
                      <div className="text-destructive mt-2 text-xs">
                        <p>{errors.location.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="condition">
                      Condition <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={condition}
                      onValueChange={(value) =>
                        setValue(
                          "condition",
                          value as "excellent" | "good" | "bad",
                        )
                      }
                    >
                      <SelectTrigger id="condition">
                        <SelectValue
                          id="condition"
                          placeholder="Select condition"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="bad">Bad</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.condition && (
                      <div className="text-destructive mt-2 text-xs">
                        <p>{errors.condition.message}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    {!catIsLoading ? (
                      categories?.length == 0 ? (
                        <Button className="mt-3 cursor-pointer" type="button">
                          <Plus />
                          Add Category
                        </Button>
                      ) : (
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
                      )
                    ) : (
                      <Skeleton className="h-10 w-1/2 rounded-md" />
                    )}
                    {errors.category_id && (
                      <div className="text-destructive mt-2 text-xs">
                        <p>{errors.category_id.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="A few words to help the next reader."
                    rows={3}
                    {...register("description")}
                  />
                  {errors.description && (
                    <div className="text-destructive mt-2 text-xs">
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
                    <div className="text-destructive mt-2 text-xs">
                      <p>{errors.notes.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" asChild>
                    <Link to="/admin/books">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={storeIsPending || isPending}>
                    {isPending || storeIsPending ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Update"
                    )}
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
