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
  startDate: string;
  endDate: string;
}