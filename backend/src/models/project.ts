export interface Project {
    id: string;
    name: string;
    client: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
    workerIds: string[];
}

export interface CreateProjectInput {
    name: string;
    client: string;
    startDate: string;
    endDate: string;
}