export interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  projectId: number | null;
  createdAt?: string; 
  updatedAt?: string; 
  project?: {
    id: number;
    name: string;
  };
}

export interface Project {
  id: number;
  projectName: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  startDate: string;
  endDate: string;
}

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  profileImageUrl?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: File | null;
}