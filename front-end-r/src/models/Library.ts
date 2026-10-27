export interface CatalogueBook {
  id: number;
  title: string;
  author: string;
  description: string;
  publisher: string | null;
  published_year: number | null;
  pages: number;
  is_available: boolean;
  book_img: string | null;
  category: { id: number; name: string } | null;
}

export interface PageResult<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export type RequestStatus = "pending" | "approved" | "declined" | "cancelled";

export interface LoanRequest {
  id: number;
  status: RequestStatus;
  message: string | null;
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
  book: CatalogueBook;
  checkout: { id: number; return_date: string; renewal_number: number } | null;
  user?: { id: number; name: string; email: string; phone: string };
}

export interface ReaderLoan {
  id: number;
  book: CatalogueBook;
  return_date: string;
  renewal_number: number;
}
