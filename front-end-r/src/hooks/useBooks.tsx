import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/Apiclient";

interface Book {
  id: number;
  title: string;
  author: string;
  category: Category;
  is_available: boolean;
  location: string;
  dateAdded: string;
  description: string;
  pages: number;
  publisher: string;
  condition: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
}

interface FetchBooksResponse {
  current_page: number;
  data: Book[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const useBooks = (page = 1, perPage = 10) => {
  const fetchBooks = () =>
    apiClient
      .get<FetchBooksResponse>(`/books?page=${page}&perPage=${perPage}`)
      .then((res) => {
        return res.data;
      });

  return useQuery<FetchBooksResponse | undefined, Error>({
    queryKey: ["books", page, perPage],
    queryFn: fetchBooks,
  });
};

export default useBooks;
