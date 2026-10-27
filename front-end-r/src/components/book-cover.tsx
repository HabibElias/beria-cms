import { useState } from "react";
import { cn } from "../lib/utils";
import { BookOpen } from "lucide-react";

export function BookCover({
  book,
  small = false,
  className,
}: {
  book: { id: number; title: string; author: string; book_img?: string | null };
  small?: boolean;
  className?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const classes = cn("book-cover", small && "small", className);
  if (book.book_img && book.book_img !== failedUrl)
    return (
      <img
        className={classes}
        src={book.book_img}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={() => setFailedUrl(book.book_img || null)}
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
