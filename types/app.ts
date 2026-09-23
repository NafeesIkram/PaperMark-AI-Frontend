export type AssignmentStatus = "Draft" | "Processing" | "Completed";

export type Assignment = {
  id: string;
  title: string;
  course: string;
  questions: number;
  submissions: number;
  evaluated: number;
  status: AssignmentStatus;
  createdAt: string;
};

export type RubricRule = {
  id: string;
  type: string;
  description: string;
  marks: number;
};