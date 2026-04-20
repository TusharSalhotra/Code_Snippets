export interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}
