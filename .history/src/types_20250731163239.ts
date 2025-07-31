export interface Task {
  id: number;
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  projectId: number | null;
  projectName?: string; // Proje adı opsiyonel, sadece detaylarda gösterilecek
  createdAt?: string; 
  updatedAt?: string; 
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