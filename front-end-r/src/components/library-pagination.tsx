import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import type { PageResult } from "../models/Library";

export function LibraryPagination({
  meta,
  onPage,
}: {
  meta: PageResult<unknown>["meta"];
  onPage: (page: number) => void;
}) {
  if (meta.last_page <= 1) return null;
  return (
    <nav className="pagination" aria-label="Page navigation">
      <p>
        Page {meta.current_page} of {meta.last_page}
      </p>
      <div>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.current_page <= 1}
          onClick={() => onPage(meta.current_page - 1)}
        >
          <ChevronLeft size={15} />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPage(meta.current_page + 1)}
        >
          Next
          <ChevronRight size={15} />
        </Button>
      </div>
    </nav>
  );
}
