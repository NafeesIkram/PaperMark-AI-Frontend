import { Assignment } from "@/types/app";

const KEY = "papermark_assignments";

const defaults: Assignment[] = [
  {
    id: "a1",
    title: "Organizational Culture & Diversity",
    course: "MGT 201",
    questions: 8,
    submissions: 31,
    evaluated: 31,
    status: "Completed",
    createdAt: "Today",
  },
  {
    id: "a2",
    title: "Flexible Budget Analysis",
    course: "ACC 302",
    questions: 6,
    submissions: 18,
    evaluated: 12,
    status: "Processing",
    createdAt: "Yesterday",
  },
  {
    id: "a3",
    title: "Research Methodology",
    course: "RES 401",
    questions: 10,
    submissions: 18,
    evaluated: 0,
    status: "Draft",
    createdAt: "Sep 14",
  },
];

export function getAssignments(): Assignment[] {
  if (typeof window === "undefined") return defaults;
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(defaults));
    return defaults;
  }
  try { return JSON.parse(raw); } catch { return defaults; }
}

export function saveAssignments(items: Assignment[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}