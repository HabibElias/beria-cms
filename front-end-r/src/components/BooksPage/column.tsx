import BookActions from "./BookActions";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type Book from "../../models/Book";
import { BookCover } from "../book-cover";

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: "Book",
    cell: ({ row }) => (
      <Link
        to={`/books/${row.original.id}`}
        className="flex items-center gap-3"
      >
        <BookCover book={row.original} small />
        <span>
          <strong className="block font-bold">{row.original.title}</strong>
          <span className="text-muted-foreground mt-1 block text-xs">
            {row.original.author}
          </span>
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "—",
  },
  { accessorKey: "location", header: "Shelf" },
  {
    accessorKey: "is_available",
    header: "Availability",
    cell: ({ getValue }) => (
      <span className={`status-label ${getValue() ? "" : "gold"}`}>
        {getValue() ? "Available" : "On loan"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <BookActions book={row.original} />,
  },
];
