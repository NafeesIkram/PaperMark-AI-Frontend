// =========================================================
// API CONFIG
// =========================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://192.168.0.101:8000";


// =========================================================
// GENERIC API FETCH
// =========================================================

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const headers = new Headers(
    options.headers
  );

  if (
    options.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,

        credentials: "include",

        headers,
      }
    );

  const data =
    await response
      .json()
      .catch(() => null);

  if (!response.ok) {

    throw new Error(
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}.`
    );

  }

  return data as T;
}


// =========================================================
// USER
// =========================================================

export type User = {

  id: number;

  name: string;

  email: string;

};


// =========================================================
// REGISTER
// =========================================================

export async function register(

  name: string,

  email: string,

  password: string

) {

  return apiFetch<User>(
    "/auth/register",
    {

      method: "POST",

      body: JSON.stringify({
        name,
        email,
        password,
      }),

    }
  );

}


// =========================================================
// LOGIN
// =========================================================

export async function login(

  email: string,

  password: string

) {

  return apiFetch<{
    message: string;
  }>(
    "/auth/login",
    {

      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),

    }
  );

}


// =========================================================
// LOGOUT
// =========================================================

export async function logout() {

  return apiFetch<{
    message: string;
  }>(
    "/auth/logout",
    {
      method: "POST",
    }
  );

}


// =========================================================
// CURRENT USER
// =========================================================

export async function getCurrentUser() {

  return apiFetch<User>(
    "/auth/me"
  );

}


// =========================================================
// EVALUATIONS
// =========================================================

export type EvaluationListItem = {

  id: number;

  title: string;

  course: string | null;

  total_marks: number;

  status: string;

  questions: number;

  submissions: number;

  evaluated: number;

  created_at: string;

};


// =========================================================
// GET EVALUATIONS
// =========================================================

export async function getEvaluations() {

  return apiFetch<
    EvaluationListItem[]
  >(
    "/evaluations"
  );

}


// =========================================================
// CREATE EVALUATION
// =========================================================

export type CreateEvaluationResponse = {

  id: number;

  title: string;

  course: string | null;

  total_marks: number;

  status: string;

  students: number;

  questions: number;

};


export async function createEvaluation(

  payload: unknown

) {

  return apiFetch<
    CreateEvaluationResponse
  >(
    "/evaluations",
    {

      method: "POST",

      body: JSON.stringify(
        payload
      ),

    }
  );

}


// =========================================================
// STUDENT LIST
// =========================================================

export type StudentListItem = {

  student_id: string;

  name: string | null;

  submissions: number;

  evaluated: number;

  status: string;

};


// =========================================================
// GET STUDENTS
// =========================================================
//
// We build the student directory from the existing
// evaluation APIs so we do NOT need to break the
// existing backend with a new /students route.
//

export async function getStudents() {

  const evaluations =
    await getEvaluations();


  const studentMap =
    new Map<
      string,
      StudentListItem
    >();


  for (
    const evaluation of evaluations
  ) {

    try {

      const detail =
        await apiFetch<{
          id: number;

          title: string;

          course: string | null;

          total_marks: number;

          status: string;

          questions: unknown[];

          students: {
            id: number;

            student_id: string;

            name: string | null;
          }[];

        }>(
          `/evaluations/${evaluation.id}`
        );


      const students =
        detail.students || [];


      for (
        const student of students
      ) {

        const studentId =
          String(
            student.student_id || ""
          ).trim();


        if (!studentId) {
          continue;
        }


        const existing =
          studentMap.get(
            studentId
          );


        if (existing) {

          existing.submissions += 1;


          if (
            detail.status &&
            detail.status.toLowerCase() ===
              "completed"
          ) {

            existing.evaluated += 1;

          }


          if (
            detail.status
          ) {

            existing.status =
              detail.status;

          }

        } else {

          studentMap.set(
            studentId,
            {

              student_id:
                studentId,

              name:
                student.name || null,

              submissions:
                1,

              evaluated:
                detail.status &&
                detail.status.toLowerCase() ===
                  "completed"
                  ? 1
                  : 0,

              status:
                detail.status ||
                "Active",

            }
          );

        }

      }

    } catch (error) {

      console.warn(
        `Could not load students for evaluation ${evaluation.id}:`,
        error
      );

    }

  }


  return Array.from(
    studentMap.values()
  );

}


// =========================================================
// STUDENT QUESTION RESULT
// =========================================================

export type StudentQuestionResult = {

  id: number;

  question: string;

  expected_answer:
    | string
    | null;

  student_answer:
    | string
    | null;

  max_marks: number;

  marks_awarded: number;

  match_percentage: number;

  matched_concepts: string[];

  missing_concepts: string[];

  incorrect_concepts: string[];

  feedback: string;

  what_should_have_been_included?:
    string[];

  what_was_missing?:
    string[];

  what_was_incorrect?:
    string[];

  what_was_done_well?:
    string[];

  positive_comment?:
    string;

  evaluation_method?:
    string;

};


// =========================================================
// STUDENT RESULT SUMMARY
// =========================================================

export type StudentResultSummary = {

  obtained_marks: number;

  total_marks: number;

  percentage: number;

  question_results:
    StudentQuestionResult[];

};


// =========================================================
// STUDENT RESULT RESPONSE
// =========================================================

export type StudentResultResponse = {

  evaluation: {

    id: number;

    title: string;

  };

  student: {

    id: number;

    student_id: string;

    name: string | null;

  };

  result:
    StudentResultSummary;

};


// =========================================================
// GET STUDENT RESULT
// =========================================================

export async function getStudentResult(

  evaluationId: number,

  studentId: number | string

) {

  return apiFetch<
    StudentResultResponse
  >(
    `/evaluations/${evaluationId}/students/${studentId}/result`
  );

}


// =========================================================
// STREAM EVENTS
// =========================================================

export type StreamStartEvent = {

  type: "start";

  totalStudents?: number;

  totalMarks?: number;

  total?: number;

};


export type StreamStudentStartEvent = {

  type: "student_start";

  index: number;

  totalStudents: number;

  studentId: string;

  studentName: string;

};


export type StreamStudentCompleteEvent = {

  type: "student_complete";

  index: number;

  totalStudents: number;

  studentId: string;

  studentName: string;

  obtainedMarks: number;

  totalMarks: number;

  percentage: number;

  questionResults:
    StudentQuestionResult[];

};


export type StreamStudentErrorEvent = {

  type: "student_error";

  index: number;

  totalStudents: number;

  studentId: string;

  studentName: string;

  error: string;

};


export type StreamCompleteEvent = {

  type: "complete";

  completed: number;

  totalStudents: number;

  totalMarks: number;

  averagePercentage: number;

};


// =========================================================
// STREAM EVENT UNION
// =========================================================

export type StreamEvaluationEvent =

  | StreamStartEvent

  | StreamStudentStartEvent

  | StreamStudentCompleteEvent

  | StreamStudentErrorEvent

  | StreamCompleteEvent;


// =========================================================
// STREAM EVALUATION
// =========================================================

export async function streamEvaluate(

  evaluationId: number,

  onEvent: (
    event: StreamEvaluationEvent
  ) => void

): Promise<void> {

  const response =
    await fetch(

      `${API_URL}/evaluations/${evaluationId}/evaluate-stream`,

      {

        method: "POST",

        credentials: "include",

        headers: {

          Accept:
            "application/x-ndjson",

        },

      }

    );


  if (!response.ok) {

    const data =
      await response
        .json()
        .catch(() => null);


    throw new Error(

      data?.detail ||
      data?.message ||
      `Evaluation failed with status ${response.status}.`

    );

  }


  if (!response.body) {

    throw new Error(
      "Streaming is not supported by this browser."
    );

  }


  const reader =
    response.body.getReader();


  const decoder =
    new TextDecoder(
      "utf-8"
    );


  let buffer = "";


  while (true) {

    const {
      value,
      done,
    } =
      await reader.read();


    if (done) {

      break;

    }


    buffer +=
      decoder.decode(
        value,
        {
          stream: true,
        }
      );


    const lines =
      buffer.split(
        "\n"
      );


    buffer =
      lines.pop() || "";


    for (
      const line of lines
    ) {

      const trimmed =
        line.trim();


      if (!trimmed) {

        continue;

      }


      try {

        const event =
          JSON.parse(
            trimmed
          ) as StreamEvaluationEvent;


        onEvent(
          event
        );


      } catch (error) {

        console.warn(
          "PaperMark AI: Invalid stream event:",
          trimmed,
          error
        );

      }

    }

  }


  buffer +=
    decoder.decode();


  const finalLine =
    buffer.trim();


  if (finalLine) {

    try {

      const event =
        JSON.parse(
          finalLine
        ) as StreamEvaluationEvent;


      onEvent(
        event
      );


    } catch (error) {

      console.warn(
        "PaperMark AI: Invalid final stream event:",
        finalLine,
        error
      );

    }

  }

}


// =========================================================
// ANALYTICS
// =========================================================

export type AnalyticsPerformanceItem = {

  label: string;

  value: number;

};


export type AnalyticsDistributionItem = {

  label: string;

  value: number;

  percentage: number;

};


export type AnalyticsResponse = {

  evaluations: number;

  students: number;

  submissions: number;

  evaluated: number;

  average_score: number;

  performance:
    AnalyticsPerformanceItem[];

  distribution:
    AnalyticsDistributionItem[];

};


// =========================================================
// GET ANALYTICS
// =========================================================

export async function getAnalytics() {

  return apiFetch<AnalyticsResponse>(
    "/analytics"
  );

}