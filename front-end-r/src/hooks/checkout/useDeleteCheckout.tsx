import { useMutation } from "@tanstack/react-query";
import apiClient from "../../services/Apiclient";
import type { AxiosError } from "axios";
import { queryClient } from "../../main";
import { toast } from "sonner";
import type Checkout from "../../models/Checkout";

const useDeleteCheckout = () => {
  return useMutation<unknown, AxiosError, { id: number }>({
    mutationFn: async ({ id }) =>
      (await apiClient.delete(`/checkouts/${id}`)).data,
    mutationKey: ["deleteCheckout"],
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["checkouts"] });

      const previousCheckouts = queryClient.getQueryData<{ data: Checkout[] }>([
        "checkouts",
      ]);

      if (previousCheckouts && previousCheckouts.data) {
        queryClient.setQueryData(
          ["checkouts"],
          (old: { data: Checkout[] } | undefined) => {
            return {
              ...old,
              data: old?.data.filter(
                (checkout: Checkout) => checkout.id !== id,
              ),
            };
          },
        );
      }

      return { previousCheckouts };
    },
    onError: (error: any, _variables, context) => {
      console.error(error);

      if (error.response?.data?.message)
        toast.error(error.response?.data?.message);
      else if (error.response?.data?.errors) {
        for (const key in error.response?.data?.errors) {
          toast.error(error.response?.data?.errors[key][0]);
        }
      } else toast.error("Error Occurred Try again");
      if (
        context &&
        (context as { previousCheckouts: { data: any[] } }).previousCheckouts
      ) {
        queryClient.setQueryData(
          ["Checkouts"],
          (context as { previousCheckouts: { data: any[] } }).previousCheckouts,
        );
      }
    },
    onSuccess: () => {
      toast.success("Book returned. Ready for its next reader.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      for (const key of [
        "catalogue",
        "catalogue-book",
        "my-loans",
        "my-requests",
        "admin-loan-requests",
      ])
        void queryClient.invalidateQueries({ queryKey: [key] });
      queryClient.invalidateQueries({ queryKey: ["checkouts"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export default useDeleteCheckout;
