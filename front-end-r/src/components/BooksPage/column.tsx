import { type ColumnDef } from "@tanstack/react-table";
import type Book from "../../models/Book";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Edit, Eye, Loader2Icon, MoreHorizontal, Trash2 } from "lucide-react";
import useDeleteBook from "../../hooks/book/useDeleteBook";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { useState } from "react";

export const columns: ColumnDef<Book>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
      const { mutate: deleteBook, isPending } = useDeleteBook();
      const navigate = useNavigate();
      const [open, setOpen] = useState<boolean>(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={"icon"}
              className="h-8 cursor-pointer w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-[poppins]" align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/books/${book.id}`)}
              title="View details"
            >
              <Eye className="h-4 w-4" /> view
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/books/${book.id}/edit`)}
              title="Edit book"
            >
              <Edit className="h-4 w-4" /> edit
            </DropdownMenuItem>
            <DropdownMenuItem
              title="Delete book"
              onClick={(e) => e.preventDefault()}
            >
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(true)}
                    size="sm"
                    title="Delete book"
                  >
                    <Trash2 className="h-3 w-3" /> delete
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
                      <Button variant={"ghost"} disabled={isPending}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      variant={"destructive"}
                      disabled={isPending}
                      onClick={() => {
                        deleteBook({ id: book.id, path: book.book_path });
                        setOpen(false);
                      }}
                    >
                      {isPending ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "",
  },
  {
    accessorKey: "is_available",
    header: "Available",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "created_at",
    header: "Date Added",
    cell: ({ getValue }) => new Date(String(getValue())).toLocaleString(),
  },
  {
    accessorKey: "pages",
    header: "Pages",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
];
