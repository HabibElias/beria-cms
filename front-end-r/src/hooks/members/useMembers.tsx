import { useQuery } from "@tanstack/react-query";
import { fetchAllPages } from "../../services/paginated";
import type Member from "../../models/Member";

const useMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: () => fetchAllPages<Member>("/members", "perPage"),
  });
};

export default useMembers;
