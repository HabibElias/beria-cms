import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type Checkout from "../../models/Checkout";
import useUpdateCheckout from "../../hooks/checkout/useUpdateCheckout";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import DeleteCheckout from "../BooksPage/DeleteCheckout";

export default function CheckoutRow({
  checkout,
  daysRemaining,
}: {
  checkout: Checkout;
  daysRemaining: number;
}) {
  const renewal = useUpdateCheckout();
  return (
    <TableRow>
      <TableCell>
        <p className="font-bold">{checkout.user.name}</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {checkout.user.email}
        </p>
      </TableCell>
      <TableCell>
        <Link
          className="hover:text-primary font-bold"
          to={`/admin/books/${checkout.book.id}`}
        >
          {checkout.book.title}
        </Link>
        <p className="text-muted-foreground mt-1 text-xs">
          {checkout.book.author}
        </p>
      </TableCell>
      <TableCell>
        <p>
          {new Date(checkout.return_date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          {daysRemaining < 0
            ? `${Math.abs(daysRemaining)} days overdue`
            : daysRemaining === 0
              ? "Due today"
              : `${daysRemaining} days left`}
        </p>
      </TableCell>
      <TableCell>
        <span className={`status-label ${daysRemaining <= 0 ? "red" : ""}`}>
          {daysRemaining < 0
            ? "Overdue"
            : daysRemaining === 0
              ? "Due today"
              : "On loan"}
        </span>
      </TableCell>
      <TableCell className="hidden text-right tabular-nums lg:table-cell">
        {checkout.renewal_number}/3
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <DeleteCheckout checkout={checkout} isOnMenu />
          <Button
            variant="ghost"
            size="sm"
            disabled={
              renewal.isPending ||
              checkout.renewal_number >= 3 ||
              daysRemaining > 0
            }
            title={
              daysRemaining > 0
                ? "Renewal is available on the due date"
                : checkout.renewal_number >= 3
                  ? "This loan has reached its renewal limit"
                  : "Renew for another week"
            }
            onClick={() => renewal.mutate({ id: checkout.id })}
          >
            {renewal.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Renew"
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
