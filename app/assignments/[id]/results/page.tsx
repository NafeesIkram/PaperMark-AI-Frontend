"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Search,
  Users,
  XCircle,
  AlertCircle,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import {
  getEvaluations,
  type EvaluationListItem,
} from "@/lib/api";

import styles from "./results.module.css";

type DemoStudent = {
  id: string;
  name: string;
  score: number;
  status:
    | "Completed"
    | "Processing"
    | "Pending";
};

type QuestionResult = {
  question: string;
  score: number;
  total: number;
  evidence: {
    type:
      | "success"
      | "warning"
      | "error";
    text: string;
  }[];
  comment: string;
};

const demoStudents: DemoStudent[] = [
  {
    id: "ST001",
    name: "Student One",
    score: 86,
    status: "Completed",
  },
  {
    id: "ST002",
    name: "Student Two",
    score: 74,
    status: "Completed",
  },
  {
    id: "ST003",
    name: "Student Three",
    score: 91,
    status: "Completed",
  },
  {
    id: "ST004",
    name: "Student Four",
    score: 68,
    status: "Completed",
  },
];

const demoQuestionResults: QuestionResult[] =
  [
    {
      question:
        "Explain the four main functions of management.",
      score: 8.5,
      total: 10,
      evidence: [
        {
          type: "success",
          text: "Planning concept identified.",
        },
        {
          type: "success",
          text: "Organizing concept identified.",
        },
        {
          type: "success",
          text: "Leading concept identified.",
        },
        {
          type: "warning",
          text: "Controlling explanation is incomplete.",
        },
      ],
      comment:
        "The main management functions are covered, but the controlling concept needs a clearer explanation.",
    },
    {
      question:
        "What is motivation and why is it important in an organization?",
      score: 8.5,
      total: 10,
      evidence: [
        {
          type: "success",
          text: "Core definition matches the expected meaning.",
        },
        {
          type: "success",
          text: "Importance to employee performance identified.",
        },
        {
          type: "warning",
          text: "One supporting explanation is missing.",
        },
      ],
      comment:
        "The answer demonstrates good conceptual understanding with a small missing element.",
    },
  ];

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [evaluation, setEvaluation] =
    useState<EvaluationListItem | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedStudentId, setSelectedStudentId] =
    useState("ST001");

  useEffect(() => {
    async function loadEvaluation() {
      try {
        setLoading(true);
        setError("");

        const evaluations =
          await getEvaluations();

        const found =
          evaluations.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        if (!found) {
          setError(
            "Evaluation could not be found."
          );
          return;
        }

        setEvaluation(found);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load evaluation."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadEvaluation();
    }
  }, [id]);

  const filteredStudents =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return demoStudents;
      }

      return demoStudents.filter(
        (student) =>
          student.id
            .toLowerCase()
            .includes(value) ||
          student.name
            .toLowerCase()
            .includes(value)
      );
    }, [search]);

  const averageScore =
    demoStudents.reduce(
      (sum, student) =>
        sum + student.score,
      0
    ) / demoStudents.length;

  const selectedStudent =
    demoStudents.find(
      (student) =>
        student.id ===
        selectedStudentId
    ) || demoStudents[0];

  if (loading) {
    return (
      <AppShell title="Results">
        <div className="page">
          <div
            className={styles.loading}
          >
            Loading results...
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !evaluation) {
    return (
      <AppShell title="Results">
        <div className="page">
          <div
            className={styles.error}
          >
            {error ||
              "Evaluation not found."}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Results">
      <div className={styles.resultsPage}>
        {/* HEADER */}

        <div className={styles.header}>
          <div
            className={styles.headerLeft}
          >
            <button
              type="button"
              className={
                styles.backButton
              }
              onClick={() =>
                router.push(
                  "/assignments"
                )
              }
            >
              <ArrowLeft
                size={13}
              />
              Back to Assignments
            </button>

            <div
              className={styles.eyebrow}
            >
              Evaluation Results
            </div>

            <h1
              className={styles.title}
            >
              {evaluation.title}
            </h1>

            <p
              className={styles.course}
            >
              {evaluation.course ||
                "No course specified"}
            </p>
          </div>

          <div
            className={
              styles.headerActions
            }
          >
            <button
              type="button"
              className={
                styles.secondaryButton
              }
              onClick={() =>
                alert(
                  "Export will be connected later."
                )
              }
            >
              <Download
                size={14}
              />
              Export
            </button>

            <button
              type="button"
              className={
                styles.primaryButton
              }
              onClick={() =>
                alert(
                  "Evaluation marking workflow will be connected later."
                )
              }
            >
              <FileText
                size={14}
              />
              Evaluate
            </button>
          </div>
        </div>

        {/* SUMMARY */}

        <div
          className={styles.summaryGrid}
        >
          <div
            className={styles.summaryCard}
          >
            <div
              className={
                styles.summaryLabel
              }
            >
              Students
            </div>

            <div
              className={
                styles.summaryValue
              }
            >
              {evaluation.submissions}
            </div>

            <div
              className={
                styles.summarySub
              }
            >
              Submissions
            </div>
          </div>

          <div
            className={styles.summaryCard}
          >
            <div
              className={
                styles.summaryLabel
              }
            >
              Evaluated
            </div>

            <div
              className={
                styles.summaryValue
              }
            >
              {evaluation.evaluated}
            </div>

            <div
              className={
                styles.summarySub
              }
            >
              Completed evaluations
            </div>
          </div>

          <div
            className={styles.summaryCard}
          >
            <div
              className={
                styles.summaryLabel
              }
            >
              Average
            </div>

            <div
              className={
                styles.summaryValue
              }
            >
              {averageScore.toFixed(1)}
            </div>

            <div
              className={
                styles.summarySub
              }
            >
              Demo result
            </div>
          </div>

          <div
            className={styles.summaryCard}
          >
            <div
              className={
                styles.summaryLabel
              }
            >
              Total Marks
            </div>

            <div
              className={
                styles.summaryValue
              }
            >
              {evaluation.total_marks}
            </div>

            <div
              className={
                styles.summarySub
              }
            >
              Maximum score
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div
          className={styles.contentGrid}
        >
          {/* STUDENT TABLE */}

          <section
            className={`${styles.card} ${styles.studentsCard}`}
          >
            <div
              className={styles.cardHeader}
            >
              <div>
                <h2
                  className={
                    styles.cardTitle
                  }
                >
                  Student Results
                </h2>

                <p
                  className={
                    styles.cardDescription
                  }
                >
                  Review individual student
                  scores and evaluation status.
                </p>
              </div>

              <div
                style={{
                  position:
                    "relative",
                }}
              >
                <Search
                  size={13}
                  style={{
                    position:
                      "absolute",
                    left: 10,
                    top: 11,
                    color:
                      "#8a948e",
                  }}
                />

                <input
                  className={
                    styles.search
                  }
                  style={{
                    paddingLeft: 30,
                  }}
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search student..."
                />
              </div>
            </div>

            <div
              className={
                styles.tableWrap
              }
            >
              <table
                className={
                  styles.table
                }
              >
                <thead>
                  <tr>
                    <th>
                      Student ID
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Percentage
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student) => (
                      <tr
                        key={
                          student.id
                        }
                      >
                        <td>
                          <span
                            className={
                              styles.studentId
                            }
                          >
                            {
                              student.id
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              styles.studentName
                            }
                          >
                            {
                              student.name
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              styles.score
                            }
                          >
                            {
                              student.score
                            }{" "}
                            / 100
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              styles.percentage
                            }
                          >
                            {
                              student.score
                            }
                            %
                          </span>
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${
                              student.status ===
                              "Completed"
                                ? styles.statusCompleted
                                : student.status ===
                                  "Processing"
                                ? styles.statusProcessing
                                : styles.statusPending
                            }`}
                          >
                            {
                              student.status
                            }
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={
                              styles.viewButton
                            }
                            onClick={() =>
                              setSelectedStudentId(
                                student.id
                              )
                            }
                          >
                            <Eye
                              size={12}
                            />
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {filteredStudents.length ===
              0 && (
              <div
                className={
                  styles.empty
                }
              >
                No students found.
              </div>
            )}
          </section>

          {/* RIGHT SIDE */}

          <div>
            <section
              className={`${styles.card} ${styles.studentDetails}`}
            >
              <div
                className={
                  styles.detailsHeader
                }
              >
                <div
                  className={
                    styles.detailsStudent
                  }
                >
                  <div
                    className={
                      styles.studentAvatar
                    }
                  >
                    {selectedStudent.name
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>
                    <div
                      className={
                        styles.detailsName
                      }
                    >
                      {
                        selectedStudent.name
                      }
                    </div>

                    <div
                      className={
                        styles.detailsId
                      }
                    >
                      {
                        selectedStudent.id
                      }
                    </div>
                  </div>

                  <div
                    className={
                      styles.detailsScore
                    }
                  >
                    <div
                      className={
                        styles.detailsScoreValue
                      }
                    >
                      {
                        selectedStudent.score
                      }
                    </div>

                    <div
                      className={
                        styles.detailsScoreLabel
                      }
                    >
                      / 100
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={
                  styles.questionList
                }
              >
                {demoQuestionResults.map(
                  (
                    result,
                    index
                  ) => (
                    <div
                      className={
                        styles.questionResult
                      }
                      key={index}
                    >
                      <div
                        className={
                          styles.questionResultHeader
                        }
                      >
                        <span
                          className={
                            styles.questionLabel
                          }
                        >
                          Q{index + 1}
                        </span>

                        <span
                          className={
                            styles.questionMarks
                          }
                        >
                          {
                            result.score
                          }{" "}
                          /{" "}
                          {
                            result.total
                          }
                        </span>
                      </div>

                      <div
                        className={
                          styles.questionBody
                        }
                      >
                        <div
                          className={
                            styles.questionText
                          }
                        >
                          {
                            result.question
                          }
                        </div>

                        <div
                          className={
                            styles.evidenceList
                          }
                        >
                          {result.evidence.map(
                            (
                              evidence,
                              evidenceIndex
                            ) => (
                              <div
                                className={`${styles.evidence} ${
                                  evidence.type ===
                                  "success"
                                    ? styles.evidenceSuccess
                                    : evidence.type ===
                                      "warning"
                                    ? styles.evidenceWarning
                                    : styles.evidenceError
                                }`}
                                key={
                                  evidenceIndex
                                }
                              >
                                {evidence.type ===
                                "success" ? (
                                  <CheckCircle2
                                    size={
                                      11
                                    }
                                  />
                                ) : evidence.type ===
                                  "warning" ? (
                                  <AlertCircle
                                    size={
                                      11
                                    }
                                  />
                                ) : (
                                  <XCircle
                                    size={
                                      11
                                    }
                                  />
                                )}

                                <span>
                                  {
                                    evidence.text
                                  }
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        <div
                          className={
                            styles.comment
                          }
                        >
                          {
                            result.comment
                          }
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* SCORE DISTRIBUTION */}

            <section
              className={`${styles.card} ${styles.distributionCard}`}
              style={{
                marginTop: 18,
              }}
            >
              <div
                className={
                  styles.cardHeader
                }
              >
                <div>
                  <h2
                    className={
                      styles.cardTitle
                    }
                  >
                    Score Distribution
                  </h2>

                  <p
                    className={
                      styles.cardDescription
                    }
                  >
                    Overview of student
                    performance.
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.distributionList
                }
              >
                {[
                  {
                    label: "90–100",
                    value: 1,
                    percentage: 25,
                  },
                  {
                    label: "80–89",
                    value: 1,
                    percentage: 25,
                  },
                  {
                    label: "70–79",
                    value: 1,
                    percentage: 25,
                  },
                  {
                    label: "Below 70",
                    value: 1,
                    percentage: 25,
                  },
                ].map(
                  (item) => (
                    <div
                      className={
                        styles.distributionRow
                      }
                      key={
                        item.label
                      }
                    >
                      <span
                        className={
                          styles.distributionLabel
                        }
                      >
                        {item.label}
                      </span>

                      <div
                        className={
                          styles.bar
                        }
                      >
                        <div
                          className={
                            styles.barFill
                          }
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        />
                      </div>

                      <span
                        className={
                          styles.distributionValue
                        }
                      >
                        {
                          item.value
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}