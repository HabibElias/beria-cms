import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../main";
import apiClient from "../services/Apiclient";
import { supabase } from "../config/supabase";

interface DeleteResponse {
  status: boolean;
  message: string;
}

const useDeleteBook = () => {
  return useMutation<DeleteResponse, Error, { id: number; path: string }>({
    mutationFn: async ({ id, path }) => {
      if (path)
        await supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET)
          .remove([path])
          .then((res) => {
            console.log(res.data);
          });

      const response = await apiClient.delete<DeleteResponse>(`/books/${id}`);
      return response.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["books"] });

      const previousBooks = queryClient.getQueryData<{ data: any[] }>([
        "books",
      ]);

      if (previousBooks && previousBooks.data) {
        queryClient.setQueryData(
          ["books"],
          (old: { data: any[] } | undefined) => {
            return {
              ...old,
              data: old?.data.filter((book: any) => book.id !== id),
            };
          }
        );
      }

      return { previousBooks };
    },
    onError: (_error, _variables, context) => {
      console.error(_error);

      toast.error("Failed to delete the book. Please try again." + _error.name);
      if (
        context &&
        (context as { previousBooks: { data: any[] } }).previousBooks
      ) {
        queryClient.setQueryData(
          ["books"],
          (context as { previousBooks: { data: any[] } }).previousBooks
        );
      }
    },
    onSuccess: () => {
      toast.success("Book deleted successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export default useDeleteBook;
