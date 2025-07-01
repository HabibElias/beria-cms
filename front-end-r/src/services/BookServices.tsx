import { toast } from "sonner";
import apiClient from "./Apiclient";
import type BookSchema from "../models/BookSchema";
import type z from "zod";
import { useState } from "react";

interface CreateBookResponse {
  status: boolean;
  message: string;
}

type FormData = z.infer<typeof BookSchema>;

// adding a book
export const useAddBooks = async (data: FormData) => {
  const [isSuccess, setIsSuccess] = useState(false);

  try {
    const response = (await apiClient.post<CreateBookResponse>("/books", data))
      .data;

    toast.success(response.message);
    setIsSuccess(true);
  } catch (error: any) {
    if (error.response.data.errors) {
      for (const key in error.response.data.errors) {
        toast.error(
          error.response.data.errors[key][0] ?? "An unknown error occurred"
        );
      }
    } else {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  return { isSuccess };
};
