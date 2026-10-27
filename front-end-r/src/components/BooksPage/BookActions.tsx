import { Edit } from "lucide-react";
import { Link } from "react-router-dom";
import type Book from "../../models/Book";
import { useAuth } from "../../provider/AuthProvider";
import { Button } from "../ui/button";
import { CheckoutBookDialog } from "./BookCard";

export default function BookActions({ book }: { book: Book }) {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-end gap-1">
      <CheckoutBookDialog book={book} />
      {user?.role === "admin" && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          aria-label={`Edit ${book.title}`}
        >
          <Link to={`/books/${book.id}/edit`}>
            <Edit size={15} />
          </Link>
        </Button>
      )}
    </div>
  );
}
