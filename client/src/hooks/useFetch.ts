import { useQuery } from "@tanstack/react-query";

export const useFetch = (key: any, fn: any) => {
  return useQuery({ queryKey: key, queryFn: fn });
};
