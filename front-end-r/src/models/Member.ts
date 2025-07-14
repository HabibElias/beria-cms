export default interface Member {
  id: number;
  name: string;
  phone: string;
  books_checked_out: number;
  email: string;
  role: "admin" | "librarian" | "user";
  created_at: string;
  updated_at: string;
  checkouts: [];
}
