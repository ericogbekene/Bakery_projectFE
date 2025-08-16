/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";

type HttpMethod = "GET" | "POST";

interface QueryConfig<TData>
  extends Omit<
    UseQueryOptions<TData, AxiosError, TData>,
    "queryKey" | "queryFn"
  > {
  url: string;
  method?: HttpMethod;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  data?: any;
}

function useQueryAction<TData>({
  url,
  method = "GET",
  params,
  headers,
  data,
  enabled = true,
  retry = false,
  staleTime = 1000 * 60 * 5, // 5 minutes
  gcTime = 1000 * 60 * 30, // 30 minutes
  key,
  ...options
}: QueryConfig<TData> & {
  key?:
    | string
    | {
        [key: string]: any;
      }
    | undefined[];
}) {
  const queryKey = useMemo(
    () =>
      Array.isArray(key)
        ? key
        : key
          ? [key]
          : [url, params, method, data ? JSON.stringify(data) : undefined],
    [key, url, params, method, data],
  );

  return useQuery<TData, AxiosError, TData>({
    queryKey,
    queryFn: async () => {
      if (method === "POST") {
        const response = await api.post<TData>(url, data, { params, headers });
        return response.data;
      } else {
        const response = await api.get<TData>(url, { params, headers });
        return response.data;
      }
    },
    enabled,
    retry,
    staleTime,
    gcTime,
    ...options,
  });
}

export default useQueryAction;
