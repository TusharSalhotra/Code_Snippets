export type UserStatus = 'active' | 'pending' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: UserStatus;
  skillScore: number;
  avatar?: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  manager?: string;
  sendInvite?: boolean;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}
