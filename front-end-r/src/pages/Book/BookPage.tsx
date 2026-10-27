import { ArrowLeft, Edit } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BookCover } from "../../components/book-cover";
import { LoadError } from "../../components/empty-state";
import { PageHeader } from "../../components/page-header";
import { CheckoutBookDialog } from "../../components/sidebar";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import DeleteBook from "../../components/BooksPage/DeleteBook";
import useBook from "../../hooks/book/useBook";
import { useAuth } from "../../provider/AuthProvider";

export default function BookPage() {
  const { id = "" } = useParams();
  const { data: book, isLoading, isError, refetch } = useBook(id);
  const { user } = useAuth();
  if (isLoading)
    return (
      <div className="page">
        <PageHeader title="On the bookshelf…" />
        <div className="page-content">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  if (isError || !book)
    return (
      <div className="page">
        <PageHeader title="We couldn’t find that book">
          <Button asChild variant="outline">
            <Link to="/books">
              <ArrowLeft size={16} />
              Back to books
            </Link>
          </Button>
        </PageHeader>
        <div className="page-content">
          <LoadError onRetry={() => void refetch()} />
        </div>
      </div>
    );
  const details = [
    ["Category", book.category?.name],
    ["Shelf location", book.location],
    ["Publisher", book.publisher],
    ["Published", book.published_year],
    ["Pages", book.pages],
    ["Condition", book.condition],
  ];
  return (
    <div className="page">
      <PageHeader title={book.title} description={`by ${book.author}`}>
        <Button variant="outline" asChild>
          <Link to="/books">
            <ArrowLeft size={16} />
            Back to collection
          </Link>
        </Button>
      </PageHeader>
      <div className="page-content">
        <div className="book-detail">
          <div className="book-detail-art">
            <BookCover book={book} />
          </div>
          <div className="book-detail-info">
            <span className={`status-label ${book.is_available ? "" : "gold"}`}>
              {book.is_available
                ? "Available for a reader"
                : "Currently on loan"}
            </span>
            <h2>A place in the collection</h2>
            <dl className="book-details">
              {details.map(([name, value]) => (
                <div key={String(name)}>
                  <dt>{name}</dt>
                  <dd>{value || "—"}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {book.is_available && (
                <CheckoutBookDialog
                  book={book}
                  childButton={<Button>Check out this book</Button>}
                />
              )}
              {user?.role === "admin" && (
                <>
                  <Button asChild variant="outline">
                    <Link to={`/books/${book.id}/edit`}>
                      <Edit size={15} />
                      Edit details
                    </Link>
                  </Button>
                  <DeleteBook book={book} isOnMenu />
                </>
              )}
            </div>
          </div>
        </div>
        <section className="book-description">
          <h2>About this book</h2>
          <p>
            {book.description ||
              "There’s no description yet. Add a few words to help the next reader find this book."}
          </p>
          {book.notes && (
            <>
              <h2>Library notes</h2>
              <p>{book.notes}</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
