import { ArrowRight, Edit, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import type Book from "../../models/Book";
import { useAuth } from "../../provider/AuthProvider";
import { BookCover } from "../book-cover";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CheckoutForm } from "./CheckoutForm";
import DeleteBook from "./DeleteBook";

export const BookSkeleton = () => (
  <div className="book-card">
    <Skeleton className="h-[195px] w-full rounded-none" />
    <div className="space-y-4 p-5">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

export default function BookCard({ book }: { book: Book }) {
  const { user } = useAuth();
  return (
    <article className="book-card">
      <div className="book-card-art">
        <BookCover book={book} />
        <span className={`status-label ${book.is_available ? "" : "gold"}`}>
          {book.is_available ? "Available" : "On loan"}
        </span>
      </div>
      <div className="book-card-body">
        <Link to={`/books/${book.id}`}>{book.title}</Link>
        <p className="book-author">{book.author}</p>
        <div className="book-meta">
          <span>{book.category?.name ?? "Uncategorized"}</span>
          <span>
            {book.location ? `Shelf ${book.location}` : "No shelf assigned"}
          </span>
        </div>
        <div className="book-card-actions">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-primary px-0"
          >
            <Link to={`/books/${book.id}`}>
              View book
              <ArrowRight size={13} />
            </Link>
          </Button>
          <div>
            <CheckoutBookDialog book={book} />
            {user?.role === "admin" && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  title={`Edit ${book.title}`}
                  aria-label={`Edit ${book.title}`}
                >
                  <Link to={`/books/${book.id}/edit`}>
                    <Edit size={14} />
                  </Link>
                </Button>
                <DeleteBook book={book} />
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function CheckoutBookDialog({
  book,
  isOnMenu,
}: {
  book?: Book;
  isOnMenu?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={!book?.is_available}
          title={
            book?.is_available
              ? "Check out book"
              : "This book is already on loan"
          }
          aria-label={`Check out ${book?.title ?? "book"}`}
          className={isOnMenu ? "w-full justify-start" : ""}
        >
          <ShoppingBag size={15} />
          {isOnMenu && "Check out"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>A new chapter for this book</DialogTitle>
          <DialogDescription>
            Record who is borrowing {book?.title ?? "this book"} and when it
            should return.
          </DialogDescription>
        </DialogHeader>
        <CheckoutForm
          bookId={book?.id}
          bookTittle={book?.title}
          userId={user?.id}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
