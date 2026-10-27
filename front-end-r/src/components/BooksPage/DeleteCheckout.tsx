import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import type Checkout from "../../models/Checkout";
import useDeleteCheckout from "../../hooks/checkout/useDeleteCheckout";
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

export default function DeleteCheckout({
  checkout,
  isOnMenu,
}: {
  checkout: Checkout;
  isOnMenu?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteCheckout();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Return ${checkout.book.title}`}
          title="Record book return"
        >
          <Check size={14} />
          {isOnMenu && "Return"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome this book home?</DialogTitle>
          <DialogDescription>
            Confirm that {checkout.user.name} has returned “
            {checkout.book.title}”. It will become available for the next
            reader.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Not yet
          </Button>
          <Button
            disabled={isPending}
            onClick={() =>
              mutate({ id: checkout.id }, { onSuccess: () => setOpen(false) })
            }
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Confirm return"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
