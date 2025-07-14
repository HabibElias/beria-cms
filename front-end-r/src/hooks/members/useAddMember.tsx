import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../../services/Apiclient";
import type { MemberFormData } from "../../models/MemberSchema";

const useAddMember = () => {
  return useMutation<unknown, Error, MemberFormData>({
    mutationFn: async (data: MemberFormData) => {
      const response = await apiClient.post("/members", data);
      return response.data;
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Error Occurred Try again");
    },
  });
};

export default useAddMember;
