"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import styles from "./new-evaluation.module.css";

type EvaluationMethod = "semantic" | "exact" | "rubric";

type RubricPoint = {
  id: number;
  description: string;
  marks: string;
};

type CustomRule = {
  id: number;
  type: string;
  description: string;
  marks: string;
};

type Question = {
  id: number;
  question: string;
  marks: string;
  expectedAnswer: string;
  evaluationMethod: EvaluationMethod;
  rubricPoints: RubricPoint[];
  customRules: CustomRule[];
  open: boolean;
};

const evaluationMethods: {
  value: EvaluationMethod;
  title: string;
  description: string;
}[] = [
  {
    value: "semantic",
    title: "Semantic Match",
    description:
      "Evaluate whether the student's answer has the correct meaning and concepts.",
  },
  {
    value: "exact",
    title: "Exact / Fixed Answer",
    description:
      "Use this when the answer needs to match a specific value, phrase or answer.",
  },
  {
    value: "rubric",
    title: "Point-Based Rubric",
    description:
      "Award marks independently for each required point in the rubric.",
  },
];

const ruleTypes = [
  "Required Concept",
  "Exact Phrase",
  "Required Formula",
  "Bonus",
  "Penalty",
  "Partial Credit",
  "Custom",
];

const extensionOptions = [
  {
    id: "ai-usage",
    title: "AI Usage Checker",
    description: "Estimate AI-like writing signals in submissions.",
    icon: "AI",
  },
  {
    id: "grammar",
    title: "Grammar Checker",
    description: "Check grammar, spelling and punctuation.",
    icon: "Aa",
  },
  {
    id: "manual-review",
    title: "Manual Review",
    description: "Review diagrams, images and visual answers.",
    icon: "✓",
  },
  {
    id: "pdf-marking",
    title: "PDF Marking",
    description: "Add marks and comments directly to PDFs.",
    icon: "PDF",
  },
];

function createRubricPoint(): RubricPoint {
  return {
    id: Date.now() + Math.random(),
    description: "",
    marks: "",
  };
}

function createCustomRule(): CustomRule {
  return {
    id: Date.now() + Math.random(),
    type: "Required Concept",
    description: "",
    marks: "",
  };
}

function createQuestion(number: number): Question {
  return {
    id: Date.now() + number,
    question: "",
    marks: "10",
    expectedAnswer: "",
    evaluationMethod: "semantic",
    rubricPoints: [],
    customRules: [],
    open: true,
  };
}

export default function NewEvaluationPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const [questions, setQuestions] = useState<Question[]>([
    createQuestion(1),
  ]);

  const [overallRules, setOverallRules] = useState<CustomRule[]>([]);
  const [extensions, setExtensions] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("papermark_evaluation_draft");

    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      if (data.title) setTitle(data.title);
      if (data.course) setCourse(data.course);
      if (data.totalMarks) setTotalMarks(String(data.totalMarks));

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(
          data.questions.map((q: any, index: number) => ({
            id: q.id ?? Date.now() + index,
            question: q.question ?? "",
            marks: String(q.marks ?? "10"),
            expectedAnswer: q.expectedAnswer ?? "",
            evaluationMethod: q.evaluationMethod ?? "semantic",
            rubricPoints: q.rubricPoints ?? [],
            customRules: q.customRules ?? [],
            open: index === 0,
          }))
        );
      }

      if (Array.isArray(data.overallRules)) {
        setOverallRules(data.overallRules);
      }

      if (Array.isArray(data.extensions)) {
        setExtensions(data.extensions);
      }
    } catch {
      // Ignore invalid draft data.
    }
  }, []);

  const calculatedMarks = useMemo(() => {
    return questions.reduce((sum, question) => {
      const value = Number(question.marks);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
  }, [questions]);

  function updateQuestion(
    questionId: number,
    changes: Partial<Question>
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? { ...question, ...changes }
          : question
      )
    );
  }

  function toggleQuestion(questionId: number) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? { ...question, open: !question.open }
          : { ...question, open: false }
      )
    );
  }

  function addQuestion() {
    const newQuestion = createQuestion(questions.length + 1);

    setQuestions((current) => [
      ...current.map((q) => ({ ...q, open: false })),
      newQuestion,
    ]);
  }

  function removeQuestion(questionId: number) {
    if (questions.length === 1) return;

    setQuestions((current) =>
      current.filter((question) => question.id !== questionId)
    );
  }

  function addRubricPoint(questionId: number) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              rubricPoints: [
                ...question.rubricPoints,
                createRubricPoint(),
              ],
            }
          : question
      )
    );
  }

  function updateRubricPoint(
    questionId: number,
    pointId: number,
    changes: Partial<RubricPoint>
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              rubricPoints: question.rubricPoints.map((point) =>
                point.id === pointId
                  ? { ...point, ...changes }
                  : point
              ),
            }
          : question
      )
    );
  }

  function removeRubricPoint(
    questionId: number,
    pointId: number
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              rubricPoints: question.rubricPoints.filter(
                (point) => point.id !== pointId
              ),
            }
          : question
      )
    );
  }

  function addQuestionRule(questionId: number) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              customRules: [
                ...question.customRules,
                createCustomRule(),
              ],
            }
          : question
      )
    );
  }

  function updateQuestionRule(
    questionId: number,
    ruleId: number,
    changes: Partial<CustomRule>
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              customRules: question.customRules.map((rule) =>
                rule.id === ruleId
                  ? { ...rule, ...changes }
                  : rule
              ),
            }
          : question
      )
    );
  }

  function removeQuestionRule(
    questionId: number,
    ruleId: number
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              customRules: question.customRules.filter(
                (rule) => rule.id !== ruleId
              ),
            }
          : question
      )
    );
  }

  function addOverallRule() {
    setOverallRules((current) => [
      ...current,
      createCustomRule(),
    ]);
  }

  function updateOverallRule(
    ruleId: number,
    changes: Partial<CustomRule>
  ) {
    setOverallRules((current) =>
      current.map((rule) =>
        rule.id === ruleId
          ? { ...rule, ...changes }
          : rule
      )
    );
  }

  function removeOverallRule(ruleId: number) {
    setOverallRules((current) =>
      current.filter((rule) => rule.id !== ruleId)
    );
  }

  function toggleExtension(id: string) {
    setExtensions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function getRubricTotal(question: Question) {
    return question.rubricPoints.reduce((sum, point) => {
      const value = Number(point.marks);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
  }

  function handleNext() {
    setError("");

    if (!title.trim()) {
      setError("Please enter an evaluation title.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.question.trim()) {
        setError(`Please enter Question ${i + 1}.`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!question.expectedAnswer.trim()) {
        setError(
          `Please enter the Expected / Model Answer for Question ${
            i + 1
          }.`
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (question.evaluationMethod === "rubric") {
        const questionMarks = Number(question.marks);
        const rubricTotal = getRubricTotal(question);

        if (
          Math.abs(rubricTotal - questionMarks) >
          0.001
        ) {
          setError(
            `Rubric marks for Question ${
              i + 1
            } must equal the question marks.`
          );
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }
      }
    }

    const draft = {
      title: title.trim(),
      course: course.trim(),
      totalMarks:
        totalMarks.trim() ||
        String(calculatedMarks),
      questions,
      overallRules,
      extensions,
    };

    sessionStorage.setItem(
      "papermark_evaluation_draft",
      JSON.stringify(draft)
    );

    router.push("/assignments/new/students");
  }

  return (
    <AppShell title="New Evaluation">
      <main className={styles.page}>
        <div className={styles.pageHead}>
          <div>
            <div className={styles.eyebrow}>
              PAPERMARK AI
            </div>

            <h1 className={styles.pageTitle}>
              New Evaluation
            </h1>

            <p className={styles.pageDesc}>
              Create questions, define marking rules and
              prepare your evaluation.
            </p>
          </div>
        </div>

        {error && (
          <div className={styles.createEvaluationError}>
            {error}
          </div>
        )}

        {/* =================================================
            01 — EVALUATION INFORMATION
        ================================================= */}

        <section className={styles.evaluationSection}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionNumber}>01</div>

            <div>
              <h2>Evaluation Information</h2>
              <p>
                Set the basic details for this evaluation.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>
                Evaluation Title
                <span className={styles.requiredStar}>
                  *
                </span>
              </label>

              <input
                className={styles.input}
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Introduction to Management – Midterm"
              />
            </div>

            <div className={styles.field}>
              <label>
                Course
                <span className={styles.optionalText}>
                  Optional
                </span>
              </label>

              <input
                className={styles.input}
                value={course}
                onChange={(e) =>
                  setCourse(e.target.value)
                }
                placeholder="e.g. Management"
              />
            </div>

            <div className={styles.field}>
              <label>
                Total Marks
                <span className={styles.optionalText}>
                  Optional
                </span>
              </label>

              <input
                className={styles.input}
                type="number"
                min="0"
                value={totalMarks}
                onChange={(e) =>
                  setTotalMarks(e.target.value)
                }
                placeholder={String(calculatedMarks)}
              />

              <p className={styles.fieldHelp}>
                Leave blank to calculate automatically from
                the question marks.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            02 — QUESTIONS
        ================================================= */}

        <section className={styles.evaluationSection}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionNumber}>02</div>

            <div>
              <h2>Questions</h2>
              <p>
                Add questions and define how each answer
                should be evaluated.
              </p>
            </div>
          </div>

          <div className={styles.questionList}>
            {questions.map((question, index) => {
              const rubricTotal =
                getRubricTotal(question);

              return (
                <div
                  className={styles.questionCard}
                  key={question.id}
                >
                  {/* Question header */}
                  <div className={styles.questionHeader}>
                    <button
                      type="button"
                      className={styles.questionHeaderMain}
                      onClick={() =>
                        toggleQuestion(question.id)
                      }
                    >
                      <span
                        className={styles.questionNumber}
                      >
                        Q{index + 1}
                      </span>

                      <span
                        className={
                          styles.questionHeaderText
                        }
                      >
                        <strong>
                          Question {index + 1}
                        </strong>

                        <span>
                          {question.marks || "0"} marks
                        </span>

                        <span className={styles.dot}>
                          •
                        </span>

                        <span>
                          {
                            evaluationMethods.find(
                              (item) =>
                                item.value ===
                                question.evaluationMethod
                            )?.title
                          }
                        </span>
                      </span>
                    </button>

                    <div
                      className={
                        styles.questionHeaderActions
                      }
                    >
                      {questions.length > 1 && (
                        <button
                          type="button"
                          className={
                            styles.iconButtonDanger
                          }
                          title="Delete question"
                          onClick={() =>
                            removeQuestion(question.id)
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      <button
                        type="button"
                        className={styles.iconButton}
                        onClick={() =>
                          toggleQuestion(question.id)
                        }
                        aria-label={
                          question.open
                            ? "Collapse question"
                            : "Expand question"
                        }
                      >
                        {question.open ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {question.open && (
                    <div className={styles.questionBody}>
                      {/* Question */}
                      <div className={styles.field}>
                        <label>
                          Question
                          <span
                            className={
                              styles.requiredStar
                            }
                          >
                            *
                          </span>
                        </label>

                        <textarea
                          className={styles.textarea}
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              {
                                question:
                                  e.target.value,
                              }
                            )
                          }
                          placeholder="Enter the question..."
                        />
                      </div>

                      <div
                        className={
                          styles.questionTopGrid
                        }
                      >
                        <div
                          className={styles.field}
                        >
                          <label>
                            Marks
                            <span
                              className={
                                styles.requiredStar
                              }
                            >
                              *
                            </span>
                          </label>

                          <input
                            className={styles.input}
                            type="number"
                            min="0"
                            value={question.marks}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                {
                                  marks:
                                    e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Evaluation Method */}
                      <div
                        className={styles.methodSection}
                      >
                        <div
                          className={
                            styles.subsectionHeader
                          }
                        >
                          <div>
                            <h3>
                              Evaluation Method
                            </h3>
                            <p>
                              Choose how the AI should
                              evaluate this question.
                            </p>
                          </div>
                        </div>

                        <div
                          className={styles.methodGrid}
                        >
                          {evaluationMethods.map(
                            (method) => {
                              const selected =
                                question.evaluationMethod ===
                                method.value;

                              return (
                                <button
                                  type="button"
                                  key={method.value}
                                  className={`${styles.methodCard} ${
                                    selected
                                      ? styles.methodCardSelected
                                      : ""
                                  }`}
                                  onClick={() =>
                                    updateQuestion(
                                      question.id,
                                      {
                                        evaluationMethod:
                                          method.value,
                                      }
                                    )
                                  }
                                >
                                  <div
                                    className={
                                      styles.methodRadio
                                    }
                                  >
                                    {selected && (
                                      <Check
                                        size={11}
                                      />
                                    )}
                                  </div>

                                  <div>
                                    <strong>
                                      {method.title}
                                    </strong>

                                    <p>
                                      {
                                        method.description
                                      }
                                    </p>
                                  </div>
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Rubric */}
                      {question.evaluationMethod ===
                        "rubric" && (
                        <div
                          className={
                            styles.rubricBox
                          }
                        >
                          <div
                            className={
                              styles.subsectionHeader
                            }
                          >
                            <div>
                              <h3>
                                Rubric Points
                              </h3>
                              <p>
                                Each point is checked
                                independently and can
                                receive partial credit.
                              </p>
                            </div>

                            <button
                              type="button"
                              className={
                                styles.secondaryButton
                              }
                              onClick={() =>
                                addRubricPoint(
                                  question.id
                                )
                              }
                            >
                              <Plus size={13} />
                              Add Point
                            </button>
                          </div>

                          {question.rubricPoints
                            .length === 0 ? (
                            <div
                              className={
                                styles.emptyBox
                              }
                            >
                              No rubric points added yet.
                            </div>
                          ) : (
                            <div
                              className={
                                styles.rubricList
                              }
                            >
                              {question.rubricPoints.map(
                                (point, pointIndex) => (
                                  <div
                                    className={
                                      styles.rubricRow
                                    }
                                    key={point.id}
                                  >
                                    <span
                                      className={
                                        styles.rubricIndex
                                      }
                                    >
                                      {pointIndex + 1}
                                    </span>

                                    <input
                                      className={
                                        styles.input
                                      }
                                      value={
                                        point.description
                                      }
                                      onChange={(e) =>
                                        updateRubricPoint(
                                          question.id,
                                          point.id,
                                          {
                                            description:
                                              e.target
                                                .value,
                                          }
                                        )
                                      }
                                      placeholder="Describe the required point..."
                                    />

                                    <input
                                      className={
                                        styles.marksInput
                                      }
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={point.marks}
                                      onChange={(e) =>
                                        updateRubricPoint(
                                          question.id,
                                          point.id,
                                          {
                                            marks:
                                              e.target
                                                .value,
                                          }
                                        )
                                      }
                                      placeholder="Marks"
                                    />

                                    <button
                                      type="button"
                                      className={
                                        styles.removeButton
                                      }
                                      onClick={() =>
                                        removeRubricPoint(
                                          question.id,
                                          point.id
                                        )
                                      }
                                    >
                                      <Trash2
                                        size={13}
                                      />
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          <div
                            className={`${styles.rubricTotal} ${
                              Math.abs(
                                rubricTotal -
                                  Number(
                                    question.marks
                                  )
                              ) > 0.001
                                ? styles.rubricTotalError
                                : styles.rubricTotalOk
                            }`}
                          >
                            Rubric total:{" "}
                            <strong>
                              {rubricTotal} /{" "}
                              {question.marks || 0}
                            </strong>
                          </div>
                        </div>
                      )}

                      {/* Expected Answer */}
                      <div
                        className={
                          styles.expectedAnswer
                        }
                      >
                        <div
                          className={
                            styles.subsectionHeader
                          }
                        >
                          <div>
                            <h3>
                              Expected / Model Answer
                              <span
                                className={
                                  styles.requiredStar
                                }
                              >
                                *
                              </span>
                            </h3>

                            <p>
                              Provide the reference
                              answer the AI should use
                              during evaluation.
                            </p>
                          </div>
                        </div>

                        <textarea
                          className={styles.textarea}
                          value={
                            question.expectedAnswer
                          }
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              {
                                expectedAnswer:
                                  e.target.value,
                              }
                            )
                          }
                          placeholder="Enter the expected or model answer..."
                        />
                      </div>

                      {/* Custom Rules */}
                      <div
                        className={
                          styles.customRules
                        }
                      >
                        <div
                          className={
                            styles.subsectionHeader
                          }
                        >
                          <div>
                            <h3>
                              Question Custom Marking
                              Rules
                            </h3>

                            <p>
                              Add specific rules that
                              apply only to this question.
                            </p>
                          </div>

                          <button
                            type="button"
                            className={
                              styles.secondaryButton
                            }
                            onClick={() =>
                              addQuestionRule(
                                question.id
                              )
                            }
                          >
                            <Plus size={13} />
                            Add Rule
                          </button>
                        </div>

                        {question.customRules.length ===
                        0 ? (
                          <div
                            className={styles.emptyBox}
                          >
                            No custom rules added.
                          </div>
                        ) : (
                          <div
                            className={styles.ruleList}
                          >
                            {question.customRules.map(
                              (rule, ruleIndex) => (
                                <div
                                  className={
                                    styles.ruleCard
                                  }
                                  key={rule.id}
                                >
                                  <div
                                    className={
                                      styles.ruleNumber
                                    }
                                  >
                                    {ruleIndex + 1}
                                  </div>

                                  <select
                                    className={
                                      styles.input
                                    }
                                    value={rule.type}
                                    onChange={(e) =>
                                      updateQuestionRule(
                                        question.id,
                                        rule.id,
                                        {
                                          type: e.target
                                            .value,
                                        }
                                      )
                                    }
                                  >
                                    {ruleTypes.map(
                                      (type) => (
                                        <option
                                          key={type}
                                          value={type}
                                        >
                                          {type}
                                        </option>
                                      )
                                    )}
                                  </select>

                                  <textarea
                                    className={
                                      styles.ruleTextarea
                                    }
                                    value={
                                      rule.description
                                    }
                                    onChange={(e) =>
                                      updateQuestionRule(
                                        question.id,
                                        rule.id,
                                        {
                                          description:
                                            e.target
                                              .value,
                                        }
                                      )
                                    }
                                    placeholder="Describe the marking rule..."
                                  />

                                  <input
                                    className={
                                      styles.marksInput
                                    }
                                    type="number"
                                    step="0.5"
                                    value={rule.marks}
                                    onChange={(e) =>
                                      updateQuestionRule(
                                        question.id,
                                        rule.id,
                                        {
                                          marks:
                                            e.target
                                              .value,
                                        }
                                      )
                                    }
                                    placeholder="Marks"
                                  />

                                  <button
                                    type="button"
                                    className={
                                      styles.removeButton
                                    }
                                    onClick={() =>
                                      removeQuestionRule(
                                        question.id,
                                        rule.id
                                      )
                                    }
                                  >
                                    <Trash2
                                      size={13}
                                    />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.addQuestionButton}
            onClick={addQuestion}
          >
            <Plus size={14} />
            Add Another Question
          </button>
        </section>

        {/* =================================================
            03 — OVERALL MARKING RULES
        ================================================= */}

        <section className={styles.evaluationSection}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionNumber}>03</div>

            <div>
              <h2>Overall Marking Rules</h2>
              <p>
                Add rules that apply across the whole
                evaluation.
              </p>
            </div>
          </div>

          <div className={styles.overallRules}>
            <div
              className={styles.subsectionHeader}
            >
              <div>
                <h3>Overall Custom Marking Rules</h3>
                <p>
                  These rules apply to the evaluation as a
                  whole.
                </p>
              </div>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={addOverallRule}
              >
                <Plus size={13} />
                Add Rule
              </button>
            </div>

            {overallRules.length === 0 ? (
              <div className={styles.emptyBox}>
                No overall custom rules added.
              </div>
            ) : (
              <div className={styles.ruleList}>
                {overallRules.map(
                  (rule, ruleIndex) => (
                    <div
                      className={styles.ruleCard}
                      key={rule.id}
                    >
                      <div
                        className={styles.ruleNumber}
                      >
                        {ruleIndex + 1}
                      </div>

                      <select
                        className={styles.input}
                        value={rule.type}
                        onChange={(e) =>
                          updateOverallRule(
                            rule.id,
                            {
                              type: e.target.value,
                            }
                          )
                        }
                      >
                        {ruleTypes.map((type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        ))}
                      </select>

                      <textarea
                        className={styles.ruleTextarea}
                        value={rule.description}
                        onChange={(e) =>
                          updateOverallRule(
                            rule.id,
                            {
                              description:
                                e.target.value,
                            }
                          )
                        }
                        placeholder="Describe the overall marking rule..."
                      />

                      <input
                        className={styles.marksInput}
                        type="number"
                        step="0.5"
                        value={rule.marks}
                        onChange={(e) =>
                          updateOverallRule(
                            rule.id,
                            {
                              marks: e.target.value,
                            }
                          )
                        }
                        placeholder="Marks"
                      />

                      <button
                        type="button"
                        className={
                          styles.removeButton
                        }
                        onClick={() =>
                          removeOverallRule(rule.id)
                        }
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            04 — EXTENSIONS
        ================================================= */}

        <section className={styles.evaluationSection}>
          <div className={styles.sectionHeading}>
            <div className={styles.sectionNumber}>04</div>

            <div>
              <h2>Extensions</h2>
              <p>
                Optional tools for your evaluation workflow.
              </p>
            </div>
          </div>

          <div className={styles.extensionGrid}>
            {extensionOptions.map((extension) => {
              const selected = extensions.includes(
                extension.id
              );

              return (
                <button
                  type="button"
                  key={extension.id}
                  className={`${styles.extensionCard} ${
                    selected
                      ? styles.extensionCardSelected
                      : ""
                  }`}
                  onClick={() =>
                    toggleExtension(extension.id)
                  }
                >
                  <div
                    className={styles.extensionIcon}
                  >
                    {extension.icon}
                  </div>

                  <div
                    className={
                      styles.extensionContent
                    }
                  >
                    <h3>{extension.title}</h3>

                    <p>
                      {extension.description}
                    </p>

                    <div
                      className={
                        styles.extensionBottom
                      }
                    >
                      <span>
                        Coming Soon
                      </span>

                      <span
                        className={
                          styles.extensionStatus
                        }
                      >
                        {selected
                          ? "Added"
                          : "Add"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}

        <div className={styles.evaluationFooter}>
          <div className={styles.footerInfo}>
            {questions.length} question
            {questions.length !== 1 ? "s" : ""} •{" "}
            {totalMarks || calculatedMarks} total marks
          </div>

          <button
            type="button"
            className={styles.createEvaluationButton}
            onClick={handleNext}
          >
            Next: Add Students
            <ChevronDown
              size={14}
              style={{
                transform: "rotate(-90deg)",
              }}
            />
          </button>
        </div>
      </main>
    </AppShell>
  );
}