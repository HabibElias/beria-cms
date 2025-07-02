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
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import useDeleteBook from "../../hooks/useDeleteBook";

export const columns: ColumnDef<Book>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
      const { mutate: deleteBook } = useDeleteBook();

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
            <DropdownMenuItem title="View details">
              <Eye className="h-4 w-4" /> view
            </DropdownMenuItem>
            <DropdownMenuItem title="Edit book">
              <Edit className="h-4 w-4" /> edit
            </DropdownMenuItem>
            <DropdownMenuItem
              title="Delete book"
              onClick={() => deleteBook(book.id)}
            >
              <Trash2 className="h-4 w-4" /> delete
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
