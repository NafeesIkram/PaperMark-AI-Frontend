export type EvaluationRule = {
  type: string;
  description: string;
  marks?: number;
};

export type EvaluationRequest = {
  question: string;
  expected_answer: string;
  student_answer: string;
  max_score: number;
  rules: EvaluationRule[];
};

export type EvaluationResult = {
  score: number;
  max_score: number;
  conceptual_understanding_percent: number;
  requirements: Array<{
    description: string;
    type: string;
    status: string;
    marks_possible: number;
    marks_awarded: number;
    reason: string;
    evidence: string;
  }>;
  missing_concepts: string[];
  errors: Array<{
    description: string;
    evidence: string;
    severity: string;
  }>;
  feedback: string;
};