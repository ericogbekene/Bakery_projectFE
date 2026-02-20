import {
  type UseMutationOptions,
  type Mutation,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError, type AxiosResponse } from "axios";
import { useCallback, useMemo } from "react";
import api from "../lib/axios";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationConfig<TData, TVariables>
  extends Omit<
    UseMutationOptions<TData, AxiosError, TVariables>,
    "mutationFn"
  > {
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  invalidateQueries?: string[];
}

function useMutationAction<TData = unknown, TVariables = unknown>({
  url,
  method = "POST",
  headers,
  invalidateQueries = [],
  onSuccess,
  onError,
  ...options
}: MutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    async (variables: TVariables) => {
      const response: AxiosResponse<TData> = await api.request({
        url,
        method,
        data: variables,
        headers,
      });

      return response.data;
    },
    [url, method, headers],
  );

  const mutationOptions = useMemo(
    () => ({
      onSuccess: async (
        data: TData,
        variables: TVariables,
        context: unknown,
        mutation: Parameters<NonNullable<UseMutationOptions<TData, AxiosError, TVariables>["onSuccess"]>>[3],
      ) => {
        if (invalidateQueries.length > 0) {
          await Promise.all(
            invalidateQueries.map((query) =>
              queryClient.invalidateQueries({ queryKey: [query] }),
            ),
          );
        }
        // Call the provided onSuccess callback if it exists
        if (onSuccess) {
          onSuccess(data, variables, context, mutation);
        }

        //onSuccess?.(data, variables, context);
      },
      onError: (error: AxiosError, variables: TVariables, context: unknown, mutation: Parameters<NonNullable<UseMutationOptions<TData, AxiosError, TVariables>["onError"]>>[3],) => {
        onError?.(error, variables, context, mutation);
      },
      ...options,
    }),
    [queryClient, invalidateQueries, onSuccess, onError, options],
  );

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn,
    ...mutationOptions,
  });
}

export type MutationResult<TData> =
  | {
    data: TData;
    error: null;
  }
  | {
    data: null;
    error: AxiosError;
  };

export default useMutationAction;
