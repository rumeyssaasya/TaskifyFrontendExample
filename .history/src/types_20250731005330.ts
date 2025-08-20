export interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  projectId: number | null;
  project?: {
    id: number;
    name: string;
  };
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}