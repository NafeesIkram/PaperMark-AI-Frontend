"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  FileText,
  Plus,
  UserPlus,
  AlertCircle,
  Trash2,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import { createEvaluation } from "@/lib/api";

import styles from "./student-scripts.module.css";

type RubricPoint = {
  description: string;
  marks: number;
};

type CustomRule = {
  type: string;
  description: string;
  marks?: number | null;
};

type Question = {
  question: string;
  marks: number;
  expectedAnswer: string;
  evaluationMethod: string;
  rubricPoints: RubricPoint[];
  customRules: CustomRule[];
};

type Student = {
  id: string;
  studentId: string;
  name: string;
  answers: string[];
  expanded: boolean;
};

type EvaluationDraft = {
  title: string;
  course: string;
  totalMarks: number;
  questions: Question[];
  overallCustomRules: CustomRule[];
  extensions: string[];
};

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function toNumber(value: unknown, fallback = 0): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function normalizeRubricPoints(value: unknown): RubricPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item: any) => ({
    description: String(
      item?.description ??
        item?.text ??
        ""
    ),
    marks: toNumber(item?.marks, 0),
  }));
}

function normalizeCustomRules(value: unknown): CustomRule[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item: any) => ({
    type: String(
      item?.type ??
        "Custom"
    ),
    description: String(
      item?.description ??
        ""
    ),
    marks:
      item?.marks === undefined ||
      item?.marks === null
        ? null
        : toNumber(item.marks, 0),
  }));
}

function normalizeQuestion(raw: any): Question {
  return {
    question: String(
      raw?.question ??
        raw?.questionText ??
        ""
    ),

    marks: toNumber(
      raw?.marks ??
        raw?.maxMarks,
      0
    ),

    expectedAnswer: String(
      raw?.expectedAnswer ??
        raw?.expected_answer ??
        ""
    ),

    evaluationMethod: String(
      raw?.evaluationMethod ??
        raw?.evaluation_method ??
        "semantic"
    ),

    /*
      IMPORTANT:
      These defaults prevent:
      Cannot read properties of undefined
      (reading 'customRules')
    */
    rubricPoints: normalizeRubricPoints(
      raw?.rubricPoints ??
        raw?.rubric_points
    ),

    customRules: normalizeCustomRules(
      raw?.customRules ??
        raw?.custom_rules
    ),
  };
}

function normalizeDraft(raw: any): EvaluationDraft {
  const rawQuestions = Array.isArray(raw?.questions)
    ? raw.questions
    : [];

  return {
    title: String(
      raw?.title ??
        "Untitled Evaluation"
    ),

    course: String(
      raw?.course ??
        ""
    ),

    totalMarks: toNumber(
      raw?.totalMarks ??
        raw?.total_marks,
      rawQuestions.reduce(
        (sum: number, q: any) =>
          sum +
          toNumber(q?.marks, 0),
        0
      )
    ),

    questions: rawQuestions.map(
      (question: any) =>
        normalizeQuestion(question)
    ),

    overallCustomRules:
      normalizeCustomRules(
        raw?.overallCustomRules ??
          raw?.overall_custom_rules ??
          raw?.markingRules?.customRules ??
          []
      ),

    extensions: Array.isArray(
      raw?.extensions
    )
      ? raw.extensions.map(
          (item: unknown) =>
            String(item)
        )
      : [],
  };
}

function createStudent(
  questionCount: number,
  expanded = true
): Student {
  return {
    id:
      typeof crypto !== "undefined" &&
      "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,

    studentId: "",

    name: "",

    answers: Array.from(
      { length: questionCount },
      () => ""
    ),

    expanded,
  };
}

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */

export default function StudentScriptsPage() {
  const router = useRouter();

  const [draft, setDraft] =
    useState<EvaluationDraft | null>(null);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [expandedStudent, setExpandedStudent] =
    useState<string | null>(null);

  /* -------------------------------------------------------
     Load evaluation draft
  ------------------------------------------------------- */

  useEffect(() => {
    try {
      const saved =
        sessionStorage.getItem(
          "papermark_evaluation_draft"
        );

      if (!saved) {
        setError(
          "Evaluation draft was not found. Please go back and create the evaluation again."
        );

        setLoading(false);
        return;
      }

      const parsed =
        JSON.parse(saved);

      const normalized =
        normalizeDraft(parsed);

      setDraft(normalized);

      /*
        If students already exist in an older draft,
        restore them safely.
      */
      if (
        Array.isArray(
          parsed?.students
        ) &&
        parsed.students.length > 0
      ) {
        const restoredStudents =
          parsed.students.map(
            (student: any, index: number) => ({
              id:
                student?.id ??
                `${Date.now()}-${index}`,

              studentId: String(
                student?.studentId ??
                  student?.student_id ??
                  ""
              ),

              name: String(
                student?.name ??
                  ""
              ),

              answers:
                normalized.questions.map(
                  (
                    _question,
                    questionIndex
                  ) => {
                    const answer =
                      Array.isArray(
                        student?.answers
                      )
                        ? student.answers[
                            questionIndex
                          ]
                        : "";

                    if (
                      typeof answer ===
                      "string"
                    ) {
                      return answer;
                    }

                    if (
                      answer &&
                      typeof answer ===
                        "object"
                    ) {
                      return String(
                        answer?.answer ??
                          ""
                      );
                    }

                    return "";
                  }
                ),

              expanded: false,
            })
          );

        setStudents(
          restoredStudents
        );

        setExpandedStudent(
          restoredStudents[0]?.id ??
            null
        );
      } else {
        /*
          Start with one student.
        */
        const firstStudent =
          createStudent(
            normalized.questions.length,
            true
          );

        setStudents([
          firstStudent,
        ]);

        setExpandedStudent(
          firstStudent.id
        );
      }
    } catch (err) {
      console.error(
        "Failed to load evaluation draft:",
        err
      );

      setError(
        "Could not load the evaluation draft."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     Question count
  ------------------------------------------------------- */

  const questionCount =
    draft?.questions.length ?? 0;

  const answeredCount = useMemo(() => {
    return students.reduce(
      (total, student) => {
        return (
          total +
          student.answers.filter(
            (answer) =>
              answer.trim().length > 0
          ).length
        );
      },
      0
    );
  }, [students]);

  /* -------------------------------------------------------
     Student actions
  ------------------------------------------------------- */

  function addStudent() {
    if (!draft) {
      return;
    }

    const newStudent =
      createStudent(
        draft.questions.length,
        true
      );

    setStudents((previous) => [
      ...previous.map(
        (student) => ({
          ...student,
          expanded: false,
        })
      ),
      newStudent,
    ]);

    setExpandedStudent(
      newStudent.id
    );

    setError("");

    /*
      Scroll the new student into view
      after React renders it.
    */
    setTimeout(() => {
      document
        .getElementById(
          `student-${newStudent.id}`
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  }

  function removeStudent(
    studentId: string
  ) {
    if (students.length <= 1) {
      setError(
        "At least one student is required."
      );
      return;
    }

    setStudents((previous) =>
      previous.filter(
        (student) =>
          student.id !== studentId
      )
    );

    if (
      expandedStudent ===
      studentId
    ) {
      setExpandedStudent(null);
    }

    setError("");
  }

  function toggleStudent(
    studentId: string
  ) {
    setExpandedStudent(
      (current) =>
        current === studentId
          ? null
          : studentId
    );
  }

  function updateStudentId(
    studentId: string,
    value: string
  ) {
    setStudents((previous) =>
      previous.map(
        (student) =>
          student.id === studentId
            ? {
                ...student,
                studentId: value,
              }
            : student
      )
    );
  }

  function updateStudentName(
    studentId: string,
    value: string
  ) {
    setStudents((previous) =>
      previous.map(
        (student) =>
          student.id === studentId
            ? {
                ...student,
                name: value,
              }
            : student
      )
    );
  }

  function updateAnswer(
    studentId: string,
    questionIndex: number,
    value: string
  ) {
    setStudents((previous) =>
      previous.map(
        (student) => {
          if (
            student.id !==
            studentId
          ) {
            return student;
          }

          const answers = [
            ...student.answers,
          ];

          /*
            Make sure the answer array
            always has enough positions.
          */
          while (
            answers.length <
            questionCount
          ) {
            answers.push("");
          }

          answers[
            questionIndex
          ] = value;

          return {
            ...student,
            answers,
          };
        }
      )
    );
  }

  /* -------------------------------------------------------
     Validation
  ------------------------------------------------------- */

  function validateStudents(): boolean {
    setError("");

    if (!draft) {
      setError(
        "Evaluation draft is missing."
      );
      return false;
    }

    if (
      draft.questions.length === 0
    ) {
      setError(
        "At least one question is required."
      );
      return false;
    }

    if (
      students.length === 0
    ) {
      setError(
        "Please add at least one student."
      );
      return false;
    }

    const studentIds =
      new Set<string>();

    for (
      let studentIndex = 0;
      studentIndex <
      students.length;
      studentIndex++
    ) {
      const student =
        students[studentIndex];

      const studentId =
        student.studentId.trim();

      if (!studentId) {
        setError(
          `Please enter Student ID for Student ${
            studentIndex + 1
          }.`
        );

        setExpandedStudent(
          student.id
        );

        return false;
      }

      if (
        studentIds.has(
          studentId.toLowerCase()
        )
      ) {
        setError(
          `Duplicate Student ID found: ${studentId}.`
        );

        setExpandedStudent(
          student.id
        );

        return false;
      }

      studentIds.add(
        studentId.toLowerCase()
      );

      /*
        Currently every question must
        have an answer.
      */
      for (
        let questionIndex = 0;
        questionIndex <
        draft.questions.length;
        questionIndex++
      ) {
        const answer =
          student.answers[
            questionIndex
          ] ?? "";

        if (
          !answer.trim()
        ) {
          setError(
            `Please enter the answer for Question ${
              questionIndex + 1
            } for Student ${studentId}.`
          );

          setExpandedStudent(
            student.id
          );

          return false;
        }
      }
    }

    return true;
  }

  /* -------------------------------------------------------
     Create Evaluation
  ------------------------------------------------------- */

  async function handleCreateEvaluation() {
    if (creating) {
      return;
    }

    if (!validateStudents()) {
      return;
    }

    if (!draft) {
      return;
    }

    setCreating(true);
    setError("");

    try {
      /*
        IMPORTANT:
        Convert frontend camelCase into
        backend snake_case.
      */

      const payload = {
        title: draft.title.trim(),

        course:
          draft.course.trim() ||
          null,

        total_marks:
          draft.totalMarks,

        questions:
          draft.questions.map(
            (question) => ({
              question:
                question.question,

              marks:
                question.marks,

              expected_answer:
                question.expectedAnswer,

              evaluation_method:
                question.evaluationMethod,

              /*
                Always send arrays.
                Never send undefined.
              */
              rubric_points:
                Array.isArray(
                  question.rubricPoints
                )
                  ? question.rubricPoints.map(
                      (point) => ({
                        description:
                          point.description,

                        marks:
                          point.marks,
                      })
                    )
                  : [],

              custom_rules:
                Array.isArray(
                  question.customRules
                )
                  ? question.customRules.map(
                      (rule) => ({
                        type:
                          rule.type,

                        description:
                          rule.description,

                        marks:
                          rule.marks ??
                          null,
                      })
                    )
                  : [],
            })
          ),

        students:
          students.map(
            (student) => ({
              student_id:
                student.studentId.trim(),

              name:
                student.name.trim() ||
                null,

              answers:
                student.answers.map(
                  (
                    answer,
                    questionIndex
                  ) => ({
                    question_index:
                      questionIndex,

                    answer:
                      answer.trim(),
                  })
                ),
            })
          ),

        /*
          Overall rules are ONLY
          overall custom rules.
        */
        overall_custom_rules:
          Array.isArray(
            draft.overallCustomRules
          )
            ? draft.overallCustomRules.map(
                (rule) => ({
                  type:
                    rule.type,

                  description:
                    rule.description,

                  marks:
                    rule.marks ??
                    null,
                })
              )
            : [],

        extensions:
          Array.isArray(
            draft.extensions
          )
            ? draft.extensions
            : [],
      };

      console.log(
        "PaperMark AI - Create Evaluation Payload:",
        payload
      );

      const result =
        await createEvaluation(
          payload
        );

      /*
        Backend currently returns:
        { id, ... }

        But this also handles:
        { evaluation: { id } }
      */
      const evaluationId =
        (result as any)?.id ??
        (result as any)?.evaluation
          ?.id;

      if (!evaluationId) {
        console.error(
          "Unexpected create evaluation response:",
          result
        );

        throw new Error(
          "Evaluation was created but no evaluation ID was returned."
        );
      }

      /*
        Clear temporary draft.
      */
      sessionStorage.removeItem(
        "papermark_evaluation_draft"
      );

      /*
        Go to Assignments page.
      */
      router.push(
        `/assignments?created=${evaluationId}`
      );
    } catch (err) {
      console.error(
        "Create evaluation failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create evaluation. Please try again."
      );
    } finally {
      setCreating(false);
    }
  }

  /* -------------------------------------------------------
     Back
  ------------------------------------------------------- */

  function handleBack() {
    router.push(
      "/assignments/new"
    );
  }

  /* -------------------------------------------------------
     Loading
  ------------------------------------------------------- */

  if (loading) {
    return (
      <AppShell title="Student Scripts">
        <div className={styles.page}>
          <div
            className={
              styles.loadingState
            }
          >
            Loading student scripts...
          </div>
        </div>
      </AppShell>
    );
  }

  /* -------------------------------------------------------
     Error without draft
  ------------------------------------------------------- */

  if (!draft) {
    return (
      <AppShell title="Student Scripts">
        <div className={styles.page}>
          <div
            className={
              styles.pageHeader
            }
          >
            <div>
              <div
                className={
                  styles.eyebrow
                }
              >
                PAPERMARK AI
              </div>

              <h1
                className={
                  styles.pageTitle
                }
              >
                Student Scripts
              </h1>

              <p
                className={
                  styles.pageDescription
                }
              >
                Add students one by one
                and enter their answers.
              </p>
            </div>
          </div>

          {error && (
            <div
              className={
                styles.errorBanner
              }
            >
              <AlertCircle
                size={16}
              />

              <span>{error}</span>
            </div>
          )}

          <div
            className={
              styles.emptyState
            }
          >
            <FileText
              size={36}
            />

            <h2>
              No evaluation draft
            </h2>

            <p>
              Please go back and create
              an evaluation first.
            </p>

            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={
                handleBack
              }
            >
              <ArrowLeft
                size={15}
              />
              Back to Evaluation
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  /* -------------------------------------------------------
     Main UI
  ------------------------------------------------------- */

  return (
    <AppShell title="Student Scripts">
      <div className={styles.page}>
        {/* Header */}

        <div
          className={
            styles.pageHeader
          }
        >
          <div>
            <div
              className={
                styles.eyebrow
              }
            >
              PAPERMARK AI
            </div>

            <h1
              className={
                styles.pageTitle
              }
            >
              Student Scripts
            </h1>

            <p
              className={
                styles.pageDescription
              }
            >
              Add students one by one
              and enter their answers.
            </p>
          </div>
        </div>

        {/* Summary cards */}

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
            <div
              className={
                styles.summaryValue
              }
            >
              {students.length}
            </div>

            <div
              className={
                styles.summaryLabel
              }
            >
              Students
            </div>
          </div>

          <div
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryValue
              }
            >
              {draft.questions.length}
            </div>

            <div
              className={
                styles.summaryLabel
              }
            >
              Questions
            </div>
          </div>
        </div>

        {/* Evaluation information */}

        <div
          className={
            styles.evaluationCard
          }
        >
          <div
            className={
              styles.evaluationIcon
            }
          >
            <FileText
              size={19}
            />
          </div>

          <div
            className={
              styles.evaluationInfo
            }
          >
            <h2>
              {draft.title}
            </h2>

            <p>
              {draft.course ||
                "No course specified"}{" "}
              •{" "}
              {draft.totalMarks} marks •{" "}
              {draft.questions.length}{" "}
              {draft.questions.length ===
              1
                ? "question"
                : "questions"}
            </p>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div
            className={
              styles.errorBanner
            }
          >
            <AlertCircle
              size={16}
            />

            <span>{error}</span>
          </div>
        )}

        {/* Students section */}

        <section
          className={
            styles.studentsCard
          }
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <h2>
                Students
              </h2>

              <p>
                Add each student separately.
                Added students stay saved and
                can be collapsed.
              </p>
            </div>

            <button
              type="button"
              className={
                styles.addStudentButton
              }
              onClick={
                addStudent
              }
            >
              <UserPlus
                size={15}
              />
              Add Student
            </button>
          </div>

          {/* Student list */}

          <div
            className={
              styles.studentList
            }
          >
            {students.map(
              (
                student,
                studentIndex
              ) => {
                const isExpanded =
                  expandedStudent ===
                  student.id;

                const answered =
                  student.answers.filter(
                    (answer) =>
                      answer.trim()
                        .length > 0
                  ).length;

                const isComplete =
                  student.studentId.trim()
                    .length > 0 &&
                  answered ===
                    questionCount;

                return (
                  <div
                    key={student.id}
                    id={`student-${student.id}`}
                    className={`${styles.studentItem} ${
                      isExpanded
                        ? styles.studentItemOpen
                        : ""
                    }`}
                  >
                    {/* Student header */}

                    <div
                      className={
                        styles.studentHeader
                      }
                    >
                      <button
                        type="button"
                        className={
                          styles.studentHeaderButton
                        }
                        onClick={() =>
                          toggleStudent(
                            student.id
                          )
                        }
                      >
                        <div
                          className={
                            styles.studentNumber
                          }
                        >
                          {studentIndex +
                            1}
                        </div>

                        <div
                          className={
                            styles.studentMain
                          }
                        >
                          <strong>
                            {student.studentId.trim() ||
                              `Student ${
                                studentIndex +
                                1
                              }`}
                          </strong>

                          <span>
                            {student.name.trim() ||
                              "No name"}{" "}
                            •{" "}
                            {answered}/
                            {
                              questionCount
                            }{" "}
                            answers
                          </span>
                        </div>
                      </button>

                      <div
                        className={
                          styles.studentActions
                        }
                      >
                        {isComplete ? (
                          <CheckCircle2
                            size={21}
                            className={
                              styles.completeIcon
                            }
                          />
                        ) : (
                          <div
                            className={
                              styles.incompleteIcon
                            }
                          >
                            {answered}
                          </div>
                        )}

                        <button
                          type="button"
                          className={
                            styles.chevronButton
                          }
                          onClick={() =>
                            toggleStudent(
                              student.id
                            )
                          }
                          aria-label={
                            isExpanded
                              ? "Collapse student"
                              : "Expand student"
                          }
                        >
                          <ChevronDown
                            size={18}
                            className={
                              isExpanded
                                ? styles.chevronOpen
                                : ""
                            }
                          />
                        </button>
                      </div>
                    </div>

                    {/* Student body */}

                    {isExpanded && (
                      <div
                        className={
                          styles.studentBody
                        }
                      >
                        {/* Student information */}

                        <div
                          className={
                            styles.studentInfoGrid
                          }
                        >
                          <div
                            className={
                              styles.field
                            }
                          >
                            <label>
                              Student ID{" "}
                              <span>
                                *
                              </span>
                            </label>

                            <input
                              type="text"
                              value={
                                student.studentId
                              }
                              onChange={(
                                event
                              ) =>
                                updateStudentId(
                                  student.id,
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="e.g. 00001111"
                            />
                          </div>

                          <div
                            className={
                              styles.field
                            }
                          >
                            <label>
                              Student Name{" "}
                              <small>
                                Optional
                              </small>
                            </label>

                            <input
                              type="text"
                              value={
                                student.name
                              }
                              onChange={(
                                event
                              ) =>
                                updateStudentName(
                                  student.id,
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="e.g. Nafis"
                            />
                          </div>
                        </div>

                        {/* Answers */}

                        <div
                          className={
                            styles.answersSection
                          }
                        >
                          <div
                            className={
                              styles.answersTitle
                            }
                          >
                            <h3>
                              Answers
                            </h3>

                            <span>
                              {
                                questionCount
                              }{" "}
                              questions
                            </span>
                          </div>

                          <div
                            className={
                              styles.questionList
                            }
                          >
                            {draft.questions.map(
                              (
                                question,
                                questionIndex
                              ) => (
                                <div
                                  key={
                                    questionIndex
                                  }
                                  className={
                                    styles.questionBlock
                                  }
                                >
                                  <div
                                    className={
                                      styles.questionHeader
                                    }
                                  >
                                    <div
                                      className={
                                        styles.questionNumber
                                      }
                                    >
                                      Q
                                      {questionIndex +
                                        1}
                                    </div>

                                    <div
                                      className={
                                        styles.questionText
                                      }
                                    >
                                      <strong>
                                        {
                                          question.question
                                        }
                                      </strong>

                                      <span>
                                        {
                                          question.marks
                                        }{" "}
                                        marks
                                      </span>
                                    </div>
                                  </div>

                                  <textarea
                                    value={
                                      student
                                        .answers[
                                        questionIndex
                                      ] ??
                                      ""
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateAnswer(
                                        student.id,
                                        questionIndex,
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                    placeholder={`Enter Student ${
                                      studentIndex +
                                      1
                                    }'s answer for Question ${
                                      questionIndex +
                                      1
                                    }...`}
                                    rows={8}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Remove */}

                        <div
                          className={
                            styles.studentFooter
                          }
                        >
                          <button
                            type="button"
                            className={
                              styles.removeButton
                            }
                            onClick={() =>
                              removeStudent(
                                student.id
                              )
                            }
                            disabled={
                              students.length <=
                              1
                            }
                          >
                            <Trash2
                              size={14}
                            />
                            Remove Student
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
            )}
          </div>

          {/* Add another student */}

          <button
            type="button"
            className={
              styles.addAnotherButton
            }
            onClick={
              addStudent
            }
          >
            <Plus size={16} />
            Add Another Student
          </button>
        </section>

        {/* Bottom action bar */}

        <div
          className={
            styles.bottomBar
          }
        >
          <button
            type="button"
            className={
              styles.backButton
            }
            onClick={
              handleBack
            }
          >
            <ArrowLeft
              size={15}
            />
            Back to Evaluation
          </button>

          <div
            className={
              styles.bottomRight
            }
          >
            <div
              className={
                styles.addedInfo
              }
            >
              <CheckCircle2
                size={14}
              />

              {students.length}{" "}
              {students.length ===
              1
                ? "student"
                : "students"}{" "}
              added
            </div>

            <button
              type="button"
              className={
                styles.createButton
              }
              onClick={
                handleCreateEvaluation
              }
              disabled={
                creating
              }
            >
              <CheckCircle2
                size={15}
              />

              {creating
                ? "Creating..."
                : "Create Evaluation"}
            </button>
          </div>
        </div>

        {/* Small debug info - useful during development */}

        {process.env
          .NODE_ENV ===
          "development" && (
          <div
            className={
              styles.devInfo
            }
          >
            {answeredCount}/
            {students.length *
              questionCount}{" "}
            total answers entered
          </div>
        )}
      </div>
    </AppShell>
  );
}