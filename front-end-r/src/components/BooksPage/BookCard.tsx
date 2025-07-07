import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDeleteBook from "../../hooks/useDeleteBook";
import type Book from "../../models/Book";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

export const BookSkeleton = () => {
  return (
    <div className="bg-card rounded-xl space-y-4 pt-0 px-4 pb-4 hover:shadow-lg transition-shadow">
      <div>
        <Skeleton className="aspect-[3/4] h-40  w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-full rounded" />
        <Skeleton className="h-8 w-3/4 rounded" />
      </div>
    </div>
  );
};

const BookCard = ({ book }: { book: Book }) => {
  const navigate = useNavigate();
  const { mutate: deleteBook } = useDeleteBook();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card className="overflow-hidden pt-0 hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] relative bg-gray-100">
        <img
          src={book.book_img || "/placeholder.svg"}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={book.is_available ? "default" : "secondary"}>
            {book.is_available ? "Available" : "CheckedOut"}
          </Badge>
        </div>
      </div>
      <CardContent className="px-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600">by {book.author}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{book.category.name}</span>
            <span>{book.pages} pages</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Location: {book.location}</span>
            <Badge
              variant="outline"
              className={
                book.condition === "excellent"
                  ? "text-green-700 border-green-200 dark:text-green-400 dark:border-green-800"
                  : book.condition === "good"
                  ? "text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800"
                  : book.condition === "bad"
                  ? "text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800"
                  : "text-red-700 border-red-200 dark:text-red-400 dark:border-red-800"
              }
            >
              {book.condition}
            </Badge>
          </div>

          {book.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-2">
              {book.description}
            </p>
          )}
        </div>

        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            title="View details"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button variant="ghost" size="sm" title="Edit book">
            <Edit className="h-3 w-3" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                onClick={() => setOpen(true)}
                size="sm"
                title="Delete book"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="font-[poppins]">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your book data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose
                  onClick={() => {
                    setOpen(false);
                  }}
                  asChild
                >
                  <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setOpen(false);
                    deleteBook({ id: book.id, path: book.book_path });
                  }}
                >
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
