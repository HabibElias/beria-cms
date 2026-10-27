import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type Checkout from "../../models/Checkout";
import useUpdateCheckout from "../../hooks/checkout/useUpdateCheckout";
import { BookCover } from "../book-cover";
import { Button } from "../ui/button";
import DeleteCheckout from "./DeleteCheckout";

export default function CheckoutCard({ checkout }: { checkout: Checkout }) {
  const renewal = useUpdateCheckout();
  const days = Math.ceil(
    (new Date(checkout.return_date).getTime() - Date.now()) / 86_400_000,
  );
  return (
    <article className="checkout-card">
      <div className="flex items-start gap-4">
        <BookCover book={checkout.book} small />
        <div className="min-w-0">
          <Link to={`/admin/books/${checkout.book.id}`} className="font-bold">
            {checkout.book.title}
          </Link>
          <p className="text-muted-foreground mt-1 text-xs">
            {checkout.user.name}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          Due{" "}
          {new Date(checkout.return_date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
        <span className={`status-label ${days <= 0 ? "red" : ""}`}>
          {days < 0 ? "Overdue" : days === 0 ? "Due today" : "On loan"}
        </span>
      </div>
      <div className="mt-5 flex gap-2 border-t pt-4">
        <DeleteCheckout checkout={checkout} isOnMenu />
        <Button
          variant="ghost"
          size="sm"
          disabled={
            renewal.isPending || checkout.renewal_number >= 3 || days > 0
          }
          onClick={() => renewal.mutate({ id: checkout.id })}
          title={
            days > 0
              ? "Renewal is available on the due date"
              : "Renew for another week"
          }
        >
          {renewal.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            "Renew"
          )}
        </Button>
      </div>
    </article>
  );
}
