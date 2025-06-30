import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/Apiclient";

interface Category {
  id: number;
  name: string;
}

interface FetchCategoriesResponse {
  status: boolean;
  data?: Category[];
  message: string;
}

const useCategories = () => {
  const fetchTodos = () =>
    apiClient
      .get<FetchCategoriesResponse>("/categories")
      .then((res) => res.data.data);

  return useQuery<Category[] | undefined, Error>({
    queryKey: ["categories"],
    queryFn: fetchTodos,
  });
};

export default useCategories;
