import apiClient from "./Apiclient";
import { toast } from "sonner";

interface DeleteResponse {
  status: boolean;
  message: string;
}

export const deleteBook = async (id: number) => {
  try {
    const response = await apiClient.delete<DeleteResponse>(`/books/${id}`);
    toast.success("Book deleted successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to delete the book. Please try again.");
    throw error;
  }
};
