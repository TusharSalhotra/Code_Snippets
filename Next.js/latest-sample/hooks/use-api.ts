import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/src/lib/api-client'

/**
 * Custom hook for GET requests
 */
export function useApiQuery<T>(queryKey: (string | number)[], endpoint: string) {
  return useQuery({
    queryKey,
    queryFn: () => apiGet<T>(endpoint),
  })
}

/**
 * Custom hook for POST requests
 */
export function useApiMutation<TData, TResponse>(endpoint: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TData) => apiPost<TResponse>(endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

/**
 * Custom hook for PUT requests
 */
export function useApiUpdateMutation<TData, TResponse>(endpoint: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TData) => apiPut<TResponse>(endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

/**
 * Custom hook for PATCH requests
 */
export function useApiPatchMutation<TData, TResponse>(endpoint: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TData) => apiPatch<TResponse>(endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

/**
 * Custom hook for DELETE requests
 */
export function useApiDeleteMutation<TResponse>(endpoint: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiDelete<TResponse>(endpoint),
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
