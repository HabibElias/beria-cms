import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import apiClient from "../services/Apiclient";
import type {
  CatalogueBook,
  LoanRequest,
  PageResult,
  ReaderLoan,
} from "../models/Library";

export function responseMessage(error: unknown) {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    const validation = Object.values(data?.errors ?? {})
      .flat()
      .find((value) => typeof value === "string");
    if (typeof validation === "string") return validation;
    if (typeof data?.message === "string") return data.message;
    if (!error.response)
      return "We couldn’t reach the library. Please try again.";
  }
  return "We couldn’t complete that request. Please try again.";
}

export function useCatalogue(params: URLSearchParams) {
  const query = params.toString();
  return useQuery({
    queryKey: ["catalogue", query],
    queryFn: () =>
      apiClient
        .get<PageResult<CatalogueBook>>(`/catalogue/books?${query}`)
        .then((r) => r.data),
  });
}

export function useCatalogueBook(id: string) {
  return useQuery({
    queryKey: ["catalogue-book", id],
    queryFn: () =>
      apiClient
        .get<{ data: CatalogueBook }>(`/catalogue/books/${id}`)
        .then((r) => r.data.data),
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: () =>
      apiClient
        .get<{
          data: { id: number; name: string; book_count: number }[];
        }>("/catalogue/categories")
        .then((r) => r.data.data),
  });
}

export function useLoanRequests({
  admin = false,
  params = new URLSearchParams(),
  enabled = true,
}: { admin?: boolean; params?: URLSearchParams; enabled?: boolean } = {}) {
  const query = params.toString();
  return useQuery({
    queryKey: [admin ? "admin-loan-requests" : "my-requests", query],
    enabled,
    refetchInterval: 30_000,
    queryFn: () =>
      apiClient
        .get<
          PageResult<LoanRequest>
        >(`${admin ? "/admin" : ""}/loan-requests?${query}`)
        .then((r) => r.data),
  });
}

export function useReaderLoans() {
  return useQuery({
    queryKey: ["my-loans"],
    refetchInterval: 30_000,
    queryFn: () =>
      apiClient
        .get<{ data: ReaderLoan[] }>("/my-loans")
        .then((r) => r.data.data),
  });
}

export function useLoanAction() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      path,
      method = "post",
      data,
      success,
    }: {
      path: string;
      method?: "post" | "delete";
      data?: Record<string, unknown>;
      success: string;
    }) => {
      const response = await apiClient.request({ method, url: path, data });
      return { response: response.data, success };
    },
    onSuccess: ({ success }) => {
      toast.success(success);
      for (const key of [
        "catalogue",
        "catalogue-book",
        "my-requests",
        "my-loans",
        "admin-loan-requests",
        "books",
        "book",
        "checkouts",
        "analytics",
        "members",
      ])
        void client.invalidateQueries({ queryKey: [key] });
    },
    onError: (error) => toast.error(responseMessage(error)),
  });
}
