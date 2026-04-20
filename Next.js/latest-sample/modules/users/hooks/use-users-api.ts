/**
 * Users API Service
 * Centralized API calls for user operations using TanStack Query
 */

import { useApiQuery, useApiMutation, useApiUpdateMutation, useApiDeleteMutation } from '@/src/hooks/use-api'
import type { User, CreateUserInput } from '@/src/modules/users/types'

/**
 * Fetch all users
 */
export const useFetchUsers = () => {
  return useApiQuery<User[]>(
    ['users'],
    '/users'
  )
}

/**
 * Fetch single user
 */
export const useFetchUser = (userId: string) => {
  return useApiQuery<User>(
    ['users', userId],
    `/users/${userId}`
  )
}

/**
 * Create user
 */
export const useCreateUser = () => {
  return useApiMutation<CreateUserInput, User>('/users')
}

/**
 * Update user
 */
export const useUpdateUser = (userId: string) => {
  return useApiUpdateMutation<Partial<User>, User>(`/users/${userId}`)
}

/**
 * Delete user
 */
export const useDeleteUser = (userId: string) => {
  return useApiDeleteMutation<void>(`/users/${userId}`)
}
