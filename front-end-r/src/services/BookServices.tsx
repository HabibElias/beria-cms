import type Book from "../models/Book";
import apiClient from "./Apiclient";

interface DeleteResponse {
  status: boolean;
  message: string;
}

interface GetBookResponse {
  status: boolean;
  message: string;
  data: Book;
}

export const deleteBook = async (id: number) =>
  await apiClient.delete<DeleteResponse>(`/books/${id}`);

export const getBook = async (id: string) =>
  (await apiClient.get<GetBookResponse>(`/books/${id}`)).data;
