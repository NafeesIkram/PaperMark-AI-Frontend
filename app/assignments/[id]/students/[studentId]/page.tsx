"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  FileText,
  Lightbulb,
  Loader2,
  XCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { getStudentResult } from "@/lib/api";

import styles from "./student-result.module.css";

type PageProps = {
  params: Promise<{
    id: string;
    studentId: string;
  }>;
};

type QuestionResult = {
  id: number;
  question: string;
  expected_answer: string | null;
  student_answer: string | null;
  max_marks: number;
  marks_awarded: number;
  match_percentage: number;
  matched_concepts: string[];
  missing_concepts: string[];
  incorrect_concepts: string[];
  feedback: string;
};

type StudentResult = {
  obtained_marks: number;
  total_marks: number;
  percentage: number;
  question_results: QuestionResult[];
};

type Student = {
  id: number;
  student_id: string;
  name: string | null;
};

type Evaluation = {
  id: number;
  title: string;
};

type StudentResultData = {
  evaluation: Evaluation;
  student: Student;
  result: StudentResult;
};

export default function StudentResultPage({
  params,
}: PageProps) {
  const [evaluationId, setEvaluationId] = useState<number | null>(
    null
  );

  const [studentId, setStudentId] = useState<number | null>(
    null
  );

  const [data, setData] =
    useState<StudentResultData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Resolve Next.js route params
   */
  useEffect(() => {
    let cancelled = false;

    async function resolveParams() {
      try {
        const resolved = await params;

        const evaluation = Number(resolved.id);
        const student = Number(resolved.studentId);

        if (!Number.isFinite(evaluation)) {
          throw new Error("Invalid evaluation ID.");
        }

        if (!Number.isFinite(student)) {
          throw new Error("Invalid student ID.");
        }

        if (!cancelled) {
          setEvaluationId(evaluation);
          setStudentId(student);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Invalid route parameters."
          );
          setLoading(false);
        }
      }
    }

    resolveParams();

    return () => {
      cancelled = true;
    };
  }, [params]);

  /*
   * Load student result
   */
  const loadResult = useCallback(async () => {
    if (
      evaluationId === null ||
      studentId === null
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getStudentResult(
        evaluationId,
        studentId
      );

      setData(result as StudentResultData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load student result."
      );
    } finally {
      setLoading(false);
    }
  }, [evaluationId, studentId]);

  useEffect(() => {
    if (
      evaluationId !== null &&
      studentId !== null
    ) {
      loadResult();
    }
  }, [
    evaluationId,
    studentId,
    loadResult,
  ]);

  /*
   * Loading
   */
  if (loading) {
    return (
      <AppShell title="Student Result">
        <div className={styles.loadingPage}>
          <Loader2
            size={22}
            className={styles.spin}
          />

          <span>
            Loading student evaluation...
          </span>
        </div>
      </AppShell>
    );
  }

  /*
   * Error
   */
  if (
    error ||
    !data ||
    evaluationId === null
  ) {
    return (
      <AppShell title="Student Result">
        <div className={styles.errorPage}>
          <div className={styles.errorIcon}>
            !
          </div>

          <h2>
            Unable to load result
          </h2>

          <p>
            {error ||
              "Student result was not found."}
          </p>

          <Link
            href={
              evaluationId !== null
                ? `/assignments/${evaluationId}`
                : "/assignments"
            }
            className={styles.backButton}
          >
            <ArrowLeft size={14} />
            Back to Results
          </Link>
        </div>
      </AppShell>
    );
  }

  const student = data.student;

  const result = data.result;

  const questions =
    Array.isArray(result.question_results)
      ? result.question_results
      : [];

  const averageMatch =
    questions.length > 0
      ? Math.round(
          questions.reduce(
            (sum, question) =>
              sum +
              Number(
                question.match_percentage || 0
              ),
            0
          ) / questions.length
        )
      : 0;

  return (
    <AppShell title="Student Result">
      <div className={styles.page}>

        {/* =====================================
            HEADER
        ===================================== */}

        <div className={styles.header}>
          <div>

            <Link
              href={`/assignments/${evaluationId}`}
              className={styles.backLink}
            >
              <ArrowLeft size={14} />
              Back to Results
            </Link>

            <div className={styles.eyebrow}>
              Student Evaluation
            </div>

            <h1 className={styles.title}>
              {student.name ||
                "Unnamed Student"}
            </h1>

            <p className={styles.studentId}>
              {student.student_id}
            </p>

          </div>

          <div className={styles.scoreCard}>

            <div className={styles.scoreLabel}>
              Final Score
            </div>

            <div className={styles.scoreValue}>
              {result.obtained_marks}

              <span>
                {" / "}
                {result.total_marks}
              </span>
            </div>

            <div className={styles.scorePercentage}>
              {Number(
                result.percentage || 0
              ).toFixed(1)}
              %
            </div>

          </div>
        </div>

        {/* =====================================
            OVERVIEW
        ===================================== */}

        <div className={styles.overview}>

          <div className={styles.overviewItem}>
            <FileText size={17} />

            <div>
              <span>
                Evaluation
              </span>

              <strong>
                {data.evaluation.title}
              </strong>
            </div>
          </div>

          <div className={styles.overviewItem}>
            <CheckCircle2 size={17} />

            <div>
              <span>
                Questions
              </span>

              <strong>
                {questions.length}
              </strong>
            </div>
          </div>

          <div className={styles.overviewItem}>
            <CircleAlert size={17} />

            <div>
              <span>
                Conceptual Match
              </span>

              <strong>
                {averageMatch}%
              </strong>
            </div>
          </div>

        </div>

        {/* =====================================
            QUESTIONS HEADER
        ===================================== */}

        <div className={styles.sectionHeader}>
          <div>

            <h2>
              Question Evaluation
            </h2>

            <p>
              Compare the instructor's expected
              answer with the student's response.
            </p>

          </div>
        </div>

        {/* =====================================
            QUESTION LIST
        ===================================== */}

        <div className={styles.questionList}>

          {questions.map(
            (question, index) => (

              <article
                key={
                  question.id ??
                  `${index}-${question.question}`
                }
                className={styles.questionCard}
              >

                {/* QUESTION HEADER */}

                <div className={styles.questionHeader}>

                  <div>

                    <div
                      className={
                        styles.questionNumber
                      }
                    >
                      Question {index + 1}
                    </div>

                    <h3>
                      {question.question}
                    </h3>

                  </div>

                  <div
                    className={
                      styles.questionScore
                    }
                  >

                    <strong>
                      {question.marks_awarded}
                    </strong>

                    <span>
                      / {question.max_marks}
                    </span>

                  </div>

                </div>

                {/* =====================================
                    COMPARISON
                ===================================== */}

                <div className={styles.comparison}>

                  {/* EXPECTED ANSWER */}

                  <div
                    className={
                      styles.answerPanel
                    }
                  >

                    <div
                      className={
                        styles.panelHeader
                      }
                    >
                      <span>
                        Teacher's Expected Answer
                      </span>
                    </div>

                    <div
                      className={
                        styles.answerText
                      }
                    >
                      {question.expected_answer ||
                        "No expected answer was provided."}
                    </div>

                  </div>

                  {/* STUDENT ANSWER */}

                  <div
                    className={
                      styles.answerPanel
                    }
                  >

                    <div
                      className={
                        styles.panelHeader
                      }
                    >
                      <span>
                        Student's Answer
                      </span>
                    </div>

                    <div
                      className={
                        styles.answerText
                      }
                    >
                      {question.student_answer ||
                        "No answer provided."}
                    </div>

                  </div>

                </div>

                {/* =====================================
                    AI EVALUATION
                ===================================== */}

                <div
                  className={
                    styles.aiSection
                  }
                >

                  <div
                    className={
                      styles.aiHeader
                    }
                  >

                    <div>

                      <div
                        className={
                          styles.aiEyebrow
                        }
                      >
                        AI Evaluation
                      </div>

                      <h4>
                        Feedback on this answer
                      </h4>

                    </div>

                    <div
                      className={
                        styles.matchBadge
                      }
                    >
                      {Number(
                        question.match_percentage ||
                          0
                      ).toFixed(0)}
                      % Conceptual Match
                    </div>

                  </div>

                  {/* FEEDBACK */}

                  <div
                    className={
                      styles.feedbackBox
                    }
                  >

                    <div
                      className={
                        styles.feedbackIcon
                      }
                    >
                      <Lightbulb size={16} />
                    </div>

                    <div>

                      <strong>
                        Feedback
                      </strong>

                      <p>
                        {question.feedback ||
                          "No feedback was generated."}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      DETAILED AI FEEDBACK
                      -------------------------------------------------
                      Additional UI only. Existing sections below
                      are intentionally preserved.
                  ================================================= */}

                  {(question.missing_concepts?.length ?? 0) > 0 ||
                  (question.incorrect_concepts?.length ?? 0) > 0 ? (
                    <div className={styles.feedbackDetails}>
                      {(question.missing_concepts?.length ?? 0) > 0 && (
                        <div className={`${styles.feedbackDetail} ${styles.shouldHave}`}>
                          <div className={styles.feedbackDetailTitle}>
                            What should have been included
                          </div>
                          <div className={styles.feedbackDetailText}>
                            • {question.missing_concepts.join("\n• ")}
                          </div>
                        </div>
                      )}

                      {(question.missing_concepts?.length ?? 0) > 0 && (
                        <div className={`${styles.feedbackDetail} ${styles.missingDetails}`}>
                          <div className={styles.feedbackDetailTitle}>
                            What was missing
                          </div>
                          <div className={styles.feedbackDetailText}>
                            The answer did not clearly address:
                            {"\n"}
                            • {question.missing_concepts.join("\n• ")}
                          </div>
                        </div>
                      )}

                      {(question.incorrect_concepts?.length ?? 0) > 0 && (
                        <div className={`${styles.feedbackDetail} ${styles.incorrectDetails}`}>
                          <div className={styles.feedbackDetailTitle}>
                            What was incorrect
                          </div>
                          <div className={styles.feedbackDetailText}>
                            • {question.incorrect_concepts.join("\n• ")}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.positiveFeedback}>
                      <strong>Excellent Answer</strong>
                      <p>
                        The answer correctly addresses the required concepts
                        and is consistent with the expected answer. No
                        significant missing or incorrect concepts were identified.
                      </p>
                    </div>
                  )}

                  {/* =====================================
                      MATCHED CONCEPTS
                  ===================================== */}

                  {question.matched_concepts?.length >
                    0 && (

                    <div
                      className={
                        styles.conceptBlock
                      }
                    >

                      <div
                        className={
                          styles.conceptTitle
                        }
                      >
                        <CheckCircle2
                          size={14}
                        />

                        What was done well
                      </div>

                      <div
                        className={
                          styles.conceptList
                        }
                      >

                        {question.matched_concepts.map(
                          (
                            concept,
                            conceptIndex
                          ) => (

                            <span
                              key={
                                `${concept}-${conceptIndex}`
                              }
                              className={
                                styles.matched
                              }
                            >
                              {concept}
                            </span>

                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* =====================================
                      MISSING CONCEPTS
                  ===================================== */}

                  {question.missing_concepts?.length >
                    0 && (

                    <div
                      className={
                        styles.conceptBlock
                      }
                    >

                      <div
                        className={
                          styles.conceptTitleMissing
                        }
                      >
                        <CircleAlert
                          size={14}
                        />

                        Missing
                      </div>

                      <div
                        className={
                          styles.conceptList
                        }
                      >

                        {question.missing_concepts.map(
                          (
                            concept,
                            conceptIndex
                          ) => (

                            <span
                              key={
                                `${concept}-${conceptIndex}`
                              }
                              className={
                                styles.missing
                              }
                            >
                              {concept}
                            </span>

                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* =====================================
                      INCORRECT CONCEPTS
                  ===================================== */}

                  {question.incorrect_concepts?.length >
                    0 && (

                    <div
                      className={
                        styles.conceptBlock
                      }
                    >

                      <div
                        className={
                          styles.conceptTitleIncorrect
                        }
                      >
                        <XCircle
                          size={14}
                        />

                        Incorrect
                      </div>

                      <div
                        className={
                          styles.conceptList
                        }
                      >

                        {question.incorrect_concepts.map(
                          (
                            concept,
                            conceptIndex
                          ) => (

                            <span
                              key={
                                `${concept}-${conceptIndex}`
                              }
                              className={
                                styles.incorrect
                              }
                            >
                              {concept}
                            </span>

                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>

              </article>
            )
          )}

        </div>

      </div>
    </AppShell>
  );
}