export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  owner: User;
  assignees: User[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
}