import { useQuery } from "@tanstack/react-query";
import type Checkout from "../../models/Checkout";
import { fetchAllPages } from "../../services/paginated";

const useCheckouts = () => {
  return useQuery({
    queryFn: () => fetchAllPages<Checkout>("/checkouts"),
    queryKey: ["checkouts"],
  });
};

export default useCheckouts;
