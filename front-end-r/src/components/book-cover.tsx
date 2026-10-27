import { useState } from "react";
import type Book from "../models/Book";
import { cn } from "../lib/utils";
import { BookOpen } from "lucide-react";

export function BookCover({
  book,
  small = false,
  className,
}: {
  book: Pick<Book, "title" | "author" | "book_img" | "id">;
  small?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const classes = cn("book-cover", small && "small", className);
  if (book.book_img && !failed)
    return (
      <img
        className={classes}
        src={book.book_img}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  return (
    <div
      className={cn(classes, "book-jacket")}
      data-tone={book.id % 3}
      role="img"
      aria-label={`No cover image for ${book.title}`}
    >
      {small ? (
        <BookOpen size={19} strokeWidth={1.4} aria-hidden="true" />
      ) : (
        <>
          <strong>{book.title}</strong>
          <small>{book.author}</small>
        </>
      )}
    </div>
  );
}
