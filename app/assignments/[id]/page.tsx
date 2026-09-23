"use client";

import {
  ArrowLeft,
  Check,
  Circle,
  Download,
  Eye,
  Loader2,
  Play,
  X,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import AppShell from "@/components/layout/AppShell";

import {
  apiFetch,
  streamEvaluate,
  StreamEvaluationEvent,
} from "@/lib/api";

import styles from "./assignment-details.module.css";


// =========================================================
// TYPES
// =========================================================

type Question = {
  id: number;
  question: string;
  marks: number;
  expected_answer?: string | null;
  evaluation_method: string;
};


type Student = {
  id: number;
  student_id: string;
  name?: string | null;
};


type Evaluation = {
  id: number;
  title: string;
  course?: string | null;
  total_marks: number;
  status: string;
  questions: Question[];
  students: Student[];
};


// =========================================================
// QUESTION RESULT
// =========================================================

type QuestionResult = {
  questionId?: number | null;

  question: string;

  expectedAnswer: string | null;

  studentAnswer: string | null;

  maxMarks: number;

  marksAwarded: number;

  matchPercentage: number;

  evaluationMethod?: string;

  matchedConcepts: string[];

  missingConcepts: string[];

  incorrectConcepts: string[];

  whatShouldHaveBeenIncluded: string[];

  whatWasMissing: string[];

  whatWasIncorrect: string[];

  whatWasDoneWell: string[];

  positiveComment: string;

  feedback: string;
};


// =========================================================
// STUDENT RESULT
// =========================================================

type StudentResult = {
  studentId: string;

  studentName: string;

  obtainedMarks: number;

  totalMarks: number;

  percentage: number;

  status:
    | "waiting"
    | "evaluating"
    | "completed"
    | "error";

  error?: string;

  questionResults: QuestionResult[];
};


// =========================================================
// SAFE NUMBER
// =========================================================

function safeNumber(
  value: unknown,
  fallback = 0
): number {

  const number =
    Number(value);

  if (
    Number.isFinite(number)
  ) {
    return number;
  }

  return fallback;
}


// =========================================================
// SAFE STRING
// =========================================================

function safeString(
  value: unknown,
  fallback = ""
): string {

  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value);
}


// =========================================================
// SAFE STRING ARRAY
// =========================================================

function safeStringArray(
  value: unknown
): string[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .map(
      (item) =>
        String(item)
    )
    .filter(
      (item) =>
        item.trim().length > 0
    );
}


// =========================================================
// CONVERT QUESTION RESULTS
// =========================================================

function convertQuestionResults(
  value: unknown
): QuestionResult[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }


  return value.map(
    (
      item: any,
      index: number
    ): QuestionResult => {

      return {

        questionId:
          item?.questionId ??
          item?.question_id ??
          item?.id ??
          index,

        question:
          safeString(
            item?.question
          ),

        expectedAnswer:
          item?.expectedAnswer ??
          item?.expected_answer ??
          null,

        studentAnswer:
          item?.studentAnswer ??
          item?.student_answer ??
          null,

        maxMarks:
          safeNumber(
            item?.maxMarks ??
            item?.max_marks
          ),

        marksAwarded:
          safeNumber(
            item?.marksAwarded ??
            item?.marks_awarded
          ),

        matchPercentage:
          safeNumber(
            item?.matchPercentage ??
            item?.match_percentage
          ),

        evaluationMethod:
          item?.evaluationMethod ??
          item?.evaluation_method ??
          undefined,

        matchedConcepts:
          safeStringArray(
            item?.matchedConcepts ??
            item?.matched_concepts
          ),

        missingConcepts:
          safeStringArray(
            item?.missingConcepts ??
            item?.missing_concepts
          ),

        incorrectConcepts:
          safeStringArray(
            item?.incorrectConcepts ??
            item?.incorrect_concepts
          ),

        whatShouldHaveBeenIncluded:
          safeStringArray(
            item?.whatShouldHaveBeenIncluded ??
            item?.what_should_have_been_included
          ),

        whatWasMissing:
          safeStringArray(
            item?.whatWasMissing ??
            item?.what_was_missing
          ),

        whatWasIncorrect:
          safeStringArray(
            item?.whatWasIncorrect ??
            item?.what_was_incorrect
          ),

        whatWasDoneWell:
          safeStringArray(
            item?.whatWasDoneWell ??
            item?.what_was_done_well
          ),

        positiveComment:
          safeString(
            item?.positiveComment ??
            item?.positive_comment
          ),

        feedback:
          safeString(
            item?.feedback
          ),
      };
    }
  );
}


// =========================================================
// CREATE INITIAL STUDENT RESULTS
// =========================================================

function createInitialResults(
  students: Student[],
  totalMarks: number
): StudentResult[] {

  return students.map(
    (student): StudentResult => ({

      studentId:
        String(
          student.student_id
        ),

      studentName:
        student.name || "",

      obtainedMarks:
        0,

      totalMarks:
        safeNumber(
          totalMarks
        ),

      percentage:
        0,

      status:
        "waiting",

      error:
        undefined,

      questionResults:
        [],
    })
  );
}


// =========================================================
// PAGE
// =========================================================

export default function EvaluationDetailsPage() {

  const params =
    useParams();


  const id =
    Number(params.id);


  // =======================================================
  // STATE
  // =======================================================

  const [
    evaluation,
    setEvaluation,
  ] = useState<Evaluation | null>(
    null
  );


  const [
    results,
    setResults,
  ] = useState<StudentResult[]>(
    []
  );


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isEvaluating,
    setIsEvaluating,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    average,
    setAverage,
  ] = useState(0);


  const [
    completedCount,
    setCompletedCount,
  ] = useState(0);


  const [
    currentStudent,
    setCurrentStudent,
  ] = useState("");


  const [
    selectedStudent,
    setSelectedStudent,
  ] = useState<string | null>(
    null
  );


  // =======================================================
  // LOAD EVALUATION
  // =======================================================

  useEffect(() => {

    if (
      !id ||
      Number.isNaN(id)
    ) {
      return;
    }


    async function loadEvaluation() {

      try {

        setIsLoading(true);

        setError("");


        const data =
          await apiFetch<Evaluation>(
            `/evaluations/${id}`
          );


        setEvaluation(
          data
        );


        const initialResults:
          StudentResult[] =
          createInitialResults(
            data.students,
            data.total_marks
          );


        setResults(
          initialResults
        );


      } catch (
        err
      ) {

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load evaluation."
        );


      } finally {

        setIsLoading(
          false
        );

      }

    }


    loadEvaluation();

  }, [id]);


  // =======================================================
  // TOTAL STUDENTS
  // =======================================================

  const totalStudents =
    evaluation?.students.length ||
    0;


  // =======================================================
  // HANDLE EVALUATE
  // =======================================================

  async function handleEvaluate() {

    if (
      !evaluation ||
      isEvaluating
    ) {
      return;
    }


    // -----------------------------------------------------
    // RESET
    // -----------------------------------------------------

    setError("");

    setIsEvaluating(
      true
    );

    setCompletedCount(
      0
    );

    setAverage(
      0
    );

    setCurrentStudent(
      ""
    );


    // -----------------------------------------------------
    // RESET RESULTS
    // -----------------------------------------------------

    const initialResults:
      StudentResult[] =
      createInitialResults(
        evaluation.students,
        evaluation.total_marks
      );


    setResults(
      initialResults
    );


    // -----------------------------------------------------
    // START STREAM
    // -----------------------------------------------------

    try {

      await streamEvaluate(

        evaluation.id,

        (
          event:
            StreamEvaluationEvent
        ) => {


          // =================================================
          // START
          // =================================================

          if (
            event.type ===
            "start"
          ) {

            setCompletedCount(
              0
            );

            setAverage(
              0
            );

            setCurrentStudent(
              ""
            );

            return;
          }


          // =================================================
          // STUDENT START
          // =================================================

          if (
            event.type ===
            "student_start"
          ) {

            const index =
              safeNumber(
                event.index,
                -1
              );


            const studentName =
              event.studentName ||
              String(
                event.studentId ||
                ""
              );


            setCurrentStudent(
              studentName
            );


            setResults(
              (
                previous
              ): StudentResult[] => {

                // -----------------------------------------
                // PRIMARY: INDEX
                // -----------------------------------------

                if (
                  index >= 0 &&
                  index <
                    previous.length
                ) {

                  return previous.map(
                    (
                      student,
                      studentIndex
                    ): StudentResult => {

                      if (
                        studentIndex !==
                        index
                      ) {

                        return student;

                      }


                      return {

                        ...student,

                        status:
                          "evaluating",

                        error:
                          undefined,

                      };

                    }
                  );

                }


                // -----------------------------------------
                // FALLBACK: STUDENT ID
                // -----------------------------------------

                return previous.map(
                  (
                    student
                  ): StudentResult => {

                    if (
                      String(
                        student.studentId
                      ) !==
                      String(
                        event.studentId
                      )
                    ) {

                      return student;

                    }


                    return {

                      ...student,

                      status:
                        "evaluating",

                      error:
                        undefined,

                    };

                  }
                );

              }
            );


            return;
          }


          // =================================================
          // STUDENT COMPLETE
          // =================================================

          if (
            event.type ===
            "student_complete"
          ) {

            const index =
              safeNumber(
                event.index,
                -1
              );


            // -----------------------------------------
            // QUESTION RESULTS
            // -----------------------------------------

            const questionResults =
              convertQuestionResults(
                event.questionResults
              );


            // -----------------------------------------
            // TOTAL MARKS
            // -----------------------------------------

            const totalMarks =
              safeNumber(
                event.totalMarks,
                evaluation.total_marks
              );


            // -----------------------------------------
            // BACKEND OBTAINED MARKS
            // -----------------------------------------

            const backendMarks =
              safeNumber(
                event.obtainedMarks,
                0
              );


            // -----------------------------------------
            // QUESTION-LEVEL MARKS
            // -----------------------------------------

            const questionMarks =
              questionResults.reduce(
                (
                  total,
                  question
                ) => {

                  return (
                    total +
                    safeNumber(
                      question.marksAwarded
                    )
                  );

                },
                0
              );


            // -----------------------------------------
            // BACKEND PERCENTAGE
            // -----------------------------------------

            const backendPercentage =
              safeNumber(
                event.percentage,
                0
              );


            // -----------------------------------------
            // FINAL OBTAINED MARKS
            // -----------------------------------------

            let obtainedMarks =
              backendMarks;


            // If backend sends 0,
            // but question marks exist,
            // use question marks.

            if (
              obtainedMarks === 0 &&
              questionMarks > 0
            ) {

              obtainedMarks =
                questionMarks;

            }


            // If still 0,
            // calculate from percentage.

            if (
              obtainedMarks === 0 &&
              backendPercentage > 0 &&
              totalMarks > 0
            ) {

              obtainedMarks =
                (
                  backendPercentage /
                  100
                ) *
                totalMarks;

            }


            // -----------------------------------------
            // FINAL PERCENTAGE
            // -----------------------------------------

            let percentage =
              backendPercentage;


            // Calculate percentage from marks
            // if backend did not provide one.

            if (
              percentage === 0 &&
              obtainedMarks > 0 &&
              totalMarks > 0
            ) {

              percentage =
                (
                  obtainedMarks /
                  totalMarks
                ) *
                100;

            }


            // -----------------------------------------
            // UPDATE STUDENT RESULT
            // -----------------------------------------

            setResults(
              (
                previous
              ): StudentResult[] => {

                const updated:
                  StudentResult[] =
                  [...previous];


                // =======================================
                // PRIMARY: INDEX
                // =======================================

                if (
                  index >= 0 &&
                  index <
                    updated.length
                ) {

                  const oldStudent =
                    updated[index];


                  updated[index] = {

                    ...oldStudent,

                    obtainedMarks:
                      Number(
                        obtainedMarks.toFixed(2)
                      ),

                    totalMarks:
                      Number(
                        totalMarks.toFixed(2)
                      ),

                    percentage:
                      Number(
                        percentage.toFixed(2)
                      ),

                    questionResults,

                    status:
                      "completed",

                    error:
                      undefined,

                  };

                }


                // =======================================
                // FALLBACK: STUDENT ID
                // =======================================

                else {

                  return previous.map(
                    (
                      student
                    ): StudentResult => {

                      if (
                        String(
                          student.studentId
                        ) !==
                        String(
                          event.studentId
                        )
                      ) {

                        return student;

                      }


                      return {

                        ...student,

                        obtainedMarks:
                          Number(
                            obtainedMarks.toFixed(2)
                          ),

                        totalMarks:
                          Number(
                            totalMarks.toFixed(2)
                          ),

                        percentage:
                          Number(
                            percentage.toFixed(2)
                          ),

                        questionResults,

                        status:
                          "completed",

                        error:
                          undefined,

                      };

                    }
                  );

                }


                // =======================================
                // LIVE AVERAGE
                // =======================================

                const completed =
                  updated.filter(
                    (
                      student
                    ) =>
                      student.status ===
                      "completed"
                  );


                if (
                  completed.length > 0
                ) {

                  const totalPercentage =
                    completed.reduce(
                      (
                        sum,
                        student
                      ) => {

                        return (
                          sum +
                          safeNumber(
                            student.percentage
                          )
                        );

                      },
                      0
                    );


                  const liveAverage =
                    totalPercentage /
                    completed.length;


                  setAverage(
                    Number(
                      liveAverage.toFixed(2)
                    )
                  );

                }


                return updated;

              }
            );


            // -----------------------------------------
            // PROGRESS
            // -----------------------------------------

            setCompletedCount(
              Math.min(
                safeNumber(
                  event.index,
                  0
                ) + 1,

                totalStudents
              )
            );


            return;
          }


          // =================================================
          // STUDENT ERROR
          // =================================================

          if (
            event.type ===
            "student_error"
          ) {

            const index =
              safeNumber(
                event.index,
                -1
              );


            setResults(
              (
                previous
              ): StudentResult[] => {

                // -----------------------------------------
                // INDEX
                // -----------------------------------------

                if (
                  index >= 0 &&
                  index <
                    previous.length
                ) {

                  return previous.map(
                    (
                      student,
                      studentIndex
                    ): StudentResult => {

                      if (
                        studentIndex !==
                        index
                      ) {

                        return student;

                      }


                      return {

                        ...student,

                        status:
                          "error",

                        error:
                          event.error,

                      };

                    }
                  );

                }


                // -----------------------------------------
                // ID FALLBACK
                // -----------------------------------------

                return previous.map(
                  (
                    student
                  ): StudentResult => {

                    if (
                      String(
                        student.studentId
                      ) !==
                      String(
                        event.studentId
                      )
                    ) {

                      return student;

                    }


                    return {

                      ...student,

                      status:
                        "error",

                      error:
                        event.error,

                    };

                  }
                );

              }
            );


            setCompletedCount(
              Math.min(
                safeNumber(
                  event.index,
                  0
                ) + 1,

                totalStudents
              )
            );


            return;
          }


          // =================================================
          // COMPLETE
          // =================================================

          if (
            event.type ===
            "complete"
          ) {

            const completed =
              Math.min(
                safeNumber(
                  event.completed,
                  totalStudents
                ),

                totalStudents
              );


            setCompletedCount(
              completed
            );


            const backendAverage =
              safeNumber(
                event.averagePercentage,
                0
              );


            // Don't overwrite valid live
            // average with zero.

            if (
              backendAverage > 0
            ) {

              setAverage(
                Number(
                  backendAverage.toFixed(2)
                )
              );

            }


            setCurrentStudent(
              ""
            );


            setIsEvaluating(
              false
            );


            return;
          }

        }
      );


      // -----------------------------------------------------
      // STREAM FINISHED
      // -----------------------------------------------------

      setCurrentStudent(
        ""
      );

      setIsEvaluating(
        false
      );


    } catch (
      err
    ) {

      console.error(
        "PaperMark AI evaluation error:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Evaluation failed."
      );


      setIsEvaluating(
        false
      );

      setCurrentStudent(
        ""
      );

    }

  }


  // =======================================================
  // PROGRESS
  // =======================================================

  const progress =
    totalStudents > 0
      ? Math.round(
          (
            completedCount /
            totalStudents
          ) *
          100
        )
      : 0;


  // =======================================================
  // CALCULATED AVERAGE
  // =======================================================

  const calculatedAverage =
    useMemo(() => {

      const completed =
        results.filter(
          (
            student
          ) =>
            student.status ===
            "completed"
        );


      if (
        completed.length === 0
      ) {

        return 0;

      }


      const total =
        completed.reduce(
          (
            sum,
            student
          ) => {

            return (
              sum +
              safeNumber(
                student.percentage
              )
            );

          },
          0
        );


      return (
        total /
        completed.length
      );

    }, [results]);


  // =======================================================
  // LOADING
  // =======================================================

  if (isLoading) {

    return (

      <AppShell
        title="Evaluation Results"
      >

        <div
          className={
            styles.loadingState
          }
        >

          <Loader2
            size={20}
            className={
              styles.spin
            }
          />

          <span>
            Loading evaluation...
          </span>

        </div>

      </AppShell>

    );

  }


  // =======================================================
  // LOAD ERROR
  // =======================================================

  if (
    error &&
    !evaluation
  ) {

    return (

      <AppShell
        title="Evaluation Results"
      >

        <div
          className={
            styles.errorBox
          }
        >

          <X
            size={18}
          />

          <div>

            <strong>
              Unable to load evaluation
            </strong>

            <span>
              {error}
            </span>

          </div>

        </div>

      </AppShell>

    );

  }


  if (!evaluation) {

    return null;

  }


  // =======================================================
  // MAIN UI
  // =======================================================

  return (

    <AppShell
      title="Evaluation Results"
    >

      <div
        className={
          styles.page
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className={
            styles.topRow
          }
        >

          <div>

            <Link
              href="/assignments"
              className={
                styles.backLink
              }
            >

              <ArrowLeft
                size={14}
              />

              Back to Assignments

            </Link>


            <div
              className={
                styles.eyebrow
              }
            >
              EVALUATION RESULTS
            </div>


            <h1
              className={
                styles.title
              }
            >
              {evaluation.title}
            </h1>


            {evaluation.course && (

              <p
                className={
                  styles.course
                }
              >
                {evaluation.course}
              </p>

            )}

          </div>


          <div
            className={
              styles.actions
            }
          >

            <button
              type="button"
              className={
                styles.exportButton
              }
              disabled
            >

              <Download
                size={14}
              />

              Export

            </button>


            <button
              type="button"
              className={
                styles.evaluateButton
              }
              onClick={
                handleEvaluate
              }
              disabled={
                isEvaluating
              }
            >

              {isEvaluating ? (

                <>

                  <Loader2
                    size={14}
                    className={
                      styles.spin
                    }
                  />

                  Evaluating...

                </>

              ) : (

                <>

                  <Play
                    size={13}
                    fill="currentColor"
                  />

                  Evaluate

                </>

              )}

            </button>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className={
              styles.errorBox
            }
          >

            <X
              size={17}
            />

            <div>

              <strong>
                Evaluation error
              </strong>

              <span>
                {error}
              </span>

            </div>

          </div>

        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div
          className={
            styles.summaryGrid
          }
        >

          <div
            className={
              styles.summaryCard
            }
          >

            <span>
              STUDENTS
            </span>

            <strong>
              {totalStudents}
            </strong>

            <small>
              Submissions
            </small>

          </div>


          <div
            className={
              styles.summaryCard
            }
          >

            <span>
              EVALUATED
            </span>

            <strong>
              {completedCount}
            </strong>

            <small>
              Completed evaluations
            </small>

          </div>


          <div
            className={
              styles.summaryCard
            }
          >

            <span>
              AVERAGE
            </span>

            <strong>

              {safeNumber(
                isEvaluating
                  ? calculatedAverage
                  : average
              ).toFixed(1)}

              %

            </strong>

            <small>
              Student average
            </small>

          </div>


          <div
            className={
              styles.summaryCard
            }
          >

            <span>
              TOTAL MARKS
            </span>

            <strong>
              {safeNumber(
                evaluation.total_marks
              )}
            </strong>

            <small>
              Maximum score
            </small>

          </div>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        {isEvaluating && (

          <div
            className={
              styles.progressCard
            }
          >

            <div
              className={
                styles.progressHeader
              }
            >

              <div>

                <strong>
                  Evaluating submissions
                </strong>

                <span>

                  {currentStudent
                    ? `Currently evaluating ${currentStudent}`
                    : "Preparing evaluation..."}

                </span>

              </div>


              <strong>

                {completedCount}

                {" / "}

                {totalStudents}

              </strong>

            </div>


            <div
              className={
                styles.progressTrack
              }
            >

              <div
                className={
                  styles.progressBar
                }
                style={{
                  width:
                    `${progress}%`,
                }}
              />

            </div>

          </div>

        )}


        {/* =================================================
            STUDENT RESULTS
        ================================================= */}

        <div
          className={
            styles.resultsCard
          }
        >

          <div
            className={
              styles.resultsHeader
            }
          >

            <div>

              <h2>
                Student Results
              </h2>

              <p>
                Review individual student
                scores and evaluation status.
              </p>

            </div>


            <input
              className={
                styles.search
              }
              placeholder="Search student..."
            />

          </div>


          <div
            className={
              styles.table
            }
          >

            {/* TABLE HEADER */}

            <div
              className={
                styles.tableHeader
              }
            >

              <span>
                STUDENT ID
              </span>

              <span>
                NAME
              </span>

              <span>
                SCORE
              </span>

              <span>
                PERCENTAGE
              </span>

              <span>
                STATUS
              </span>

              <span>
                ACTION
              </span>

            </div>


            {/* TABLE ROWS */}

            {results.map(
              (
                student
              ) => {

                const isCurrent =
                  student.status ===
                  "evaluating";


                const isCompleted =
                  student.status ===
                  "completed";


                const isError =
                  student.status ===
                  "error";


                return (

                  <div
                    key={
                      student.studentId
                    }
                    className={`
                      ${styles.tableRow}
                      ${
                        isCurrent
                          ? styles.evaluating
                          : ""
                      }
                      ${
                        isCompleted
                          ? styles.completed
                          : ""
                      }
                    `}
                  >

                    {/* STUDENT ID */}

                    <span
                      className={
                        styles.studentId
                      }
                    >
                      {student.studentId}
                    </span>


                    {/* NAME */}

                    <span
                      className={
                        styles.studentName
                      }
                    >

                      {student.studentName ||
                        "—"}

                    </span>


                    {/* SCORE */}

                    <span
                      className={
                        styles.score
                      }
                    >

                      {isCompleted

                        ? `${safeNumber(
                            student.obtainedMarks
                          )} / ${safeNumber(
                            student.totalMarks
                          )}`

                        : "—"}

                    </span>


                    {/* PERCENTAGE */}

                    <span
                      className={
                        styles.percentage
                      }
                    >

                      {isCompleted

                        ? `${safeNumber(
                            student.percentage
                          ).toFixed(1)}%`

                        : "—"}

                    </span>


                    {/* STATUS */}

                    <span>

                      {student.status ===
                        "waiting" && (

                        <span
                          className={
                            styles.waiting
                          }
                        >

                          <Circle
                            size={8}
                          />

                          Waiting

                        </span>

                      )}


                      {isCurrent && (

                        <span
                          className={
                            styles.evaluatingStatus
                          }
                        >

                          <Loader2
                            size={13}
                            className={
                              styles.spin
                            }
                          />

                          Evaluating...

                        </span>

                      )}


                      {isCompleted && (

                        <span
                          className={
                            styles.completedStatus
                          }
                        >

                          <Check
                            size={13}
                          />

                          Completed

                        </span>

                      )}


                      {isError && (

                        <span
                          className={
                            styles.errorStatus
                          }
                        >

                          Error

                        </span>

                      )}

                    </span>


                    {/* ACTION */}

                    <span>

                      <button
                        type="button"
                        className={
                          styles.viewButton
                        }
                        onClick={() =>
                          setSelectedStudent(
                            student.studentId
                          )
                        }
                        disabled={
                          !isCompleted
                        }
                      >

                        <Eye
                          size={13}
                        />

                        View

                      </button>

                    </span>

                  </div>

                );

              }
            )}

          </div>

        </div>


        {/* =================================================
            CURRENT STUDENT
        ================================================= */}

        {isEvaluating &&
          currentStudent && (

            <div
              className={
                styles.currentCard
              }
            >

              <div
                className={
                  styles.currentIcon
                }
              >

                <Loader2
                  size={17}
                  className={
                    styles.spin
                  }
                />

              </div>


              <div>

                <span>
                  CURRENTLY EVALUATING
                </span>

                <strong>
                  {currentStudent}
                </strong>

                <p>
                  PaperMark AI is comparing
                  the answer with the instructor
                  expected answer.
                </p>

              </div>

            </div>

        )}


        {/* =================================================
            COMPLETE
        ================================================= */}

        {!isEvaluating &&
          completedCount > 0 &&
          completedCount ===
            totalStudents && (

            <div
              className={
                styles.completeCard
              }
            >

              <div
                className={
                  styles.completeIcon
                }
              >

                <Check
                  size={17}
                />

              </div>


              <div>

                <strong>
                  Evaluation complete
                </strong>

                <span>
                  All {totalStudents} student
                  submissions have been evaluated.
                </span>

              </div>

            </div>

        )}


        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className={
            styles.footer
          }
        >

          <span>
            PaperMark AI evaluation engine
          </span>


          <Link
            href="/assignments"
            className={
              styles.backButton
            }
          >

            <ArrowLeft
              size={13}
            />

            Back to Assignments

          </Link>

        </div>


        {/* =================================================
            VIEW MODAL
        ================================================= */}

        {selectedStudent && (

          <div
            className={
              styles.modalOverlay
            }
            onClick={() =>
              setSelectedStudent(
                null
              )
            }
          >

            <div
              className={
                styles.modal
              }
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div
                className={
                  styles.modalHeader
                }
              >

                <div>

                  <span>
                    STUDENT RESULT
                  </span>

                  <h2>
                    {selectedStudent}
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedStudent(
                      null
                    )
                  }
                  className={
                    styles.closeButton
                  }
                >

                  <X
                    size={17}
                  />

                </button>

              </div>


              {/* MODAL BODY */}

              {(() => {

                const result =
                  results.find(
                    (
                      student
                    ) =>
                      String(
                        student.studentId
                      ) ===
                      String(
                        selectedStudent
                      )
                  );


                if (!result) {

                  return null;

                }


                return (

                  <div
                    className={
                      styles.modalBody
                    }
                  >

                    {/* SCORE */}

                    <div
                      className={
                        styles.modalScore
                      }
                    >

                      <strong>
                        {safeNumber(
                          result.obtainedMarks
                        )}
                      </strong>

                      <span>
                        /{" "}
                        {safeNumber(
                          result.totalMarks
                        )}
                      </span>

                    </div>


                    <p>

                      {safeNumber(
                        result.percentage
                      ).toFixed(1)}

                      % conceptual coverage

                    </p>


                    {/* QUESTION RESULTS */}

                    {result.questionResults.length >
                      0 && (

                      <div
                        style={{
                          marginTop:
                            20,

                          display:
                            "flex",

                          flexDirection:
                            "column",

                          gap:
                            16,
                        }}
                      >

                        {result.questionResults.map(
                          (
                            questionResult,
                            questionIndex
                          ) => (

                            <div
                              key={
                                questionResult.questionId ??
                                questionIndex
                              }
                              style={{
                                border:
                                  "1px solid #e1e8e3",

                                borderRadius:
                                  12,

                                padding:
                                  16,

                                background:
                                  "#ffffff",
                              }}
                            >

                              {/* QUESTION HEADER */}

                              <div
                                style={{
                                  display:
                                    "flex",

                                  justifyContent:
                                    "space-between",

                                  alignItems:
                                    "flex-start",

                                  gap:
                                    16,
                                }}
                              >

                                <div
                                  style={{
                                    fontWeight:
                                      700,

                                    fontSize:
                                      14,

                                    lineHeight:
                                      1.5,
                                  }}
                                >

                                  Question{" "}
                                  {questionIndex +
                                    1}

                                </div>


                                <div
                                  style={{
                                    fontWeight:
                                      700,

                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >

                                  {safeNumber(
                                    questionResult.marksAwarded
                                  )}

                                  {" / "}

                                  {safeNumber(
                                    questionResult.maxMarks
                                  )}

                                </div>

                              </div>


                              {/* QUESTION */}

                              <div
                                style={{
                                  marginTop:
                                    8,

                                  fontSize:
                                    13,

                                  lineHeight:
                                    1.6,
                                }}
                              >

                                {
                                  questionResult.question
                                }

                              </div>


                              <div
                                style={{
                                  marginTop:
                                    14,

                                  display:
                                    "grid",

                                  gap:
                                    12,
                                }}
                              >

                                {/* EXPECTED ANSWER */}

                                <div>

                                  <div
                                    style={{
                                      fontWeight:
                                        700,

                                      fontSize:
                                        12,

                                      marginBottom:
                                        5,
                                    }}
                                  >

                                    Instructor Expected Answer

                                  </div>


                                  <div
                                    style={{
                                      fontSize:
                                        12,

                                      lineHeight:
                                        1.6,

                                      padding:
                                        10,

                                      borderRadius:
                                        8,

                                      background:
                                        "#f6f9f7",

                                      whiteSpace:
                                        "pre-wrap",
                                    }}
                                  >

                                    {
                                      questionResult.expectedAnswer ||
                                      "No expected answer available."
                                    }

                                  </div>

                                </div>


                                {/* STUDENT ANSWER */}

                                <div>

                                  <div
                                    style={{
                                      fontWeight:
                                        700,

                                      fontSize:
                                        12,

                                      marginBottom:
                                        5,
                                    }}
                                  >

                                    Student Answer

                                  </div>


                                  <div
                                    style={{
                                      fontSize:
                                        12,

                                      lineHeight:
                                        1.6,

                                      padding:
                                        10,

                                      borderRadius:
                                        8,

                                      background:
                                        "#f6f9f7",

                                      whiteSpace:
                                        "pre-wrap",
                                    }}
                                  >

                                    {
                                      questionResult.studentAnswer ||
                                      "No answer provided."
                                    }

                                  </div>

                                </div>


                                {/* COVERAGE */}

                                <div>

                                  <div
                                    style={{
                                      fontWeight:
                                        700,

                                      fontSize:
                                        12,

                                      marginBottom:
                                        5,
                                    }}
                                  >

                                    Conceptual Coverage

                                  </div>


                                  <div
                                    style={{
                                      fontSize:
                                        12,

                                      fontWeight:
                                        600,
                                    }}
                                  >

                                    {safeNumber(
                                      questionResult.matchPercentage
                                    ).toFixed(1)}

                                    %

                                  </div>

                                </div>


                                {/* DONE WELL */}

                                {questionResult
                                  .whatWasDoneWell
                                  .length >
                                  0 && (

                                  <div>

                                    <div
                                      style={{
                                        fontWeight:
                                          700,

                                        fontSize:
                                          12,

                                        marginBottom:
                                          5,
                                      }}
                                    >

                                      What Was Done Well

                                    </div>


                                    <ul
                                      style={{
                                        margin:
                                          0,

                                        paddingLeft:
                                          18,

                                        fontSize:
                                          12,

                                        lineHeight:
                                          1.6,
                                      }}
                                    >

                                      {questionResult.whatWasDoneWell.map(
                                        (
                                          item,
                                          index
                                        ) => (

                                          <li
                                            key={
                                              index
                                            }
                                          >
                                            {item}
                                          </li>

                                        )
                                      )}

                                    </ul>

                                  </div>

                                )}


                                {/* SHOULD HAVE INCLUDED */}

                                {questionResult
                                  .whatShouldHaveBeenIncluded
                                  .length >
                                  0 && (

                                  <div>

                                    <div
                                      style={{
                                        fontWeight:
                                          700,

                                        fontSize:
                                          12,

                                        marginBottom:
                                          5,
                                      }}
                                    >

                                      What Should Have Been Included

                                    </div>


                                    <ul
                                      style={{
                                        margin:
                                          0,

                                        paddingLeft:
                                          18,

                                        fontSize:
                                          12,

                                        lineHeight:
                                          1.6,
                                      }}
                                    >

                                      {questionResult.whatShouldHaveBeenIncluded.map(
                                        (
                                          item,
                                          index
                                        ) => (

                                          <li
                                            key={
                                              index
                                            }
                                          >
                                            {item}
                                          </li>

                                        )
                                      )}

                                    </ul>

                                  </div>

                                )}


                                {/* MISSING */}

                                {(
                                  questionResult
                                    .whatWasMissing
                                    .length >
                                    0 ||
                                  questionResult
                                    .missingConcepts
                                    .length >
                                    0
                                ) && (

                                  <div>

                                    <div
                                      style={{
                                        fontWeight:
                                          700,

                                        fontSize:
                                          12,

                                        marginBottom:
                                          5,
                                      }}
                                    >

                                      What Was Missing

                                    </div>


                                    <ul
                                      style={{
                                        margin:
                                          0,

                                        paddingLeft:
                                          18,

                                        fontSize:
                                          12,

                                        lineHeight:
                                          1.6,
                                      }}
                                    >

                                      {(
                                        questionResult
                                          .whatWasMissing
                                          .length >
                                          0
                                          ? questionResult.whatWasMissing
                                          : questionResult.missingConcepts
                                      ).map(
                                        (
                                          item,
                                          index
                                        ) => (

                                          <li
                                            key={
                                              index
                                            }
                                          >
                                            {item}
                                          </li>

                                        )
                                      )}

                                    </ul>

                                  </div>

                                )}


                                {/* INCORRECT */}

                                {(
                                  questionResult
                                    .whatWasIncorrect
                                    .length >
                                    0 ||
                                  questionResult
                                    .incorrectConcepts
                                    .length >
                                    0
                                ) && (

                                  <div>

                                    <div
                                      style={{
                                        fontWeight:
                                          700,

                                        fontSize:
                                          12,

                                        marginBottom:
                                          5,
                                      }}
                                    >

                                      What Was Incorrect

                                    </div>


                                    <ul
                                      style={{
                                        margin:
                                          0,

                                        paddingLeft:
                                          18,

                                        fontSize:
                                          12,

                                        lineHeight:
                                          1.6,
                                      }}
                                    >

                                      {(
                                        questionResult
                                          .whatWasIncorrect
                                          .length >
                                          0
                                          ? questionResult.whatWasIncorrect
                                          : questionResult.incorrectConcepts
                                      ).map(
                                        (
                                          item,
                                          index
                                        ) => (

                                          <li
                                            key={
                                              index
                                            }
                                          >
                                            {item}
                                          </li>

                                        )
                                      )}

                                    </ul>

                                  </div>

                                )}


                                {/* MATCHED */}

                                {questionResult
                                  .matchedConcepts
                                  .length >
                                  0 && (

                                  <div>

                                    <div
                                      style={{
                                        fontWeight:
                                          700,

                                        fontSize:
                                          12,

                                        marginBottom:
                                          5,
                                      }}
                                    >

                                      Matched Concepts

                                    </div>


                                    <ul
                                      style={{
                                        margin:
                                          0,

                                        paddingLeft:
                                          18,

                                        fontSize:
                                          12,

                                        lineHeight:
                                          1.6,
                                      }}
                                    >

                                      {questionResult.matchedConcepts.map(
                                        (
                                          item,
                                          index
                                        ) => (

                                          <li
                                            key={
                                              index
                                            }
                                          >
                                            {item}
                                          </li>

                                        )
                                      )}

                                    </ul>

                                  </div>

                                )}


                                {/* POSITIVE COMMENT */}

                                {questionResult
                                  .positiveComment && (

                                  <div
                                    style={{
                                      padding:
                                        10,

                                      borderRadius:
                                        8,

                                      background:
                                        "#f6f9f7",

                                      fontSize:
                                        12,

                                      lineHeight:
                                        1.6,
                                    }}
                                  >

                                    <strong>
                                      Comment:{" "}
                                    </strong>

                                    {
                                      questionResult.positiveComment
                                    }

                                  </div>

                                )}


                                {/* FEEDBACK */}

                                {questionResult
                                  .feedback && (

                                  <div
                                    style={{
                                      fontSize:
                                        12,

                                      lineHeight:
                                        1.6,
                                    }}
                                  >

                                    <strong>
                                      AI Feedback:{" "}
                                    </strong>

                                    {
                                      questionResult.feedback
                                    }

                                  </div>

                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}


                    {/* NO QUESTION RESULTS */}

                    {result.questionResults.length ===
                      0 && (

                      <div
                        style={{
                          marginTop:
                            20,

                          padding:
                            14,

                          border:
                            "1px solid #e1e8e3",

                          borderRadius:
                            10,

                          fontSize:
                            12,

                          lineHeight:
                            1.6,
                        }}
                      >

                        Detailed question-level
                        evaluation is not available
                        for this result.

                      </div>

                    )}

                  </div>

                );

              })()}

            </div>

          </div>

        )}

      </div>

    </AppShell>

  );

}