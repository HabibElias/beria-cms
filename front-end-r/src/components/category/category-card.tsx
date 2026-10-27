import { ArrowUpRight, Edit, Loader2, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import useDeleteCategory from "../../hooks/category/useDeleteCategory";
import type Category from "../../models/Category";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CategoryUpdateDialog from "./category-update-dialog";

type LibraryCategory = Category & { book_count: number };

export default function CategoryCard({ cat }: { cat: LibraryCategory }) {
  return (
    <article className="category-card">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/books?category_id=${cat.id}`} className="category-name">
          {cat.name}
          <ArrowUpRight size={16} />
        </Link>
        <div className="flex">
          <CategoryUpdateDialog
            cat={cat}
            childButton={
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={`Edit ${cat.name}`}
              >
                <Edit size={14} />
              </Button>
            }
          />
          <CategoryDeleteDialog
            cat={cat}
            childButton={
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={`Delete ${cat.name}`}
              >
                <Trash2 size={14} />
              </Button>
            }
          />
        </div>
      </div>
      <p>{cat.description || "A little room for books to belong."}</p>
      <Link className="category-count" to={`/books?category_id=${cat.id}`}>
        <span>{cat.book_count ?? 0}</span>{" "}
        {(cat.book_count ?? 0) === 1 ? "book" : "books"}
        <ArrowUpRight size={14} />
      </Link>
    </article>
  );
}

export function CategoryDeleteDialog({
  cat,
  childButton,
}: {
  cat: LibraryCategory;
  childButton?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteCategory();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {childButton ?? <Button variant="outline">Delete category</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete “{cat.name}”?</DialogTitle>
          <DialogDescription>
            This permanently deletes the category and its {cat.book_count ?? 0}{" "}
            {(cat.book_count ?? 0) === 1 ? "book" : "books"}. Move any books you
            want to keep to another category first. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Keep category
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              mutate({ id: cat.id }, { onSuccess: () => setOpen(false) })
            }
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Delete category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
