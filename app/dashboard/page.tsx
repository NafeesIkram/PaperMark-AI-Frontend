"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  FilePlus2,
  Users,
  Clock3,
  Plus,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getEvaluations,
  type EvaluationListItem,
} from "@/lib/api";

import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();

  const [assignments, setAssignments] =
    useState<EvaluationListItem[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getEvaluations();

        setAssignments(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalAssignments =
    assignments.length;

  const completedAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status
          .toLowerCase() ===
        "completed"
    ).length;

  const processingAssignments =
    assignments.filter(
      (assignment) =>
        assignment.status
          .toLowerCase() ===
        "processing"
    ).length;

  const totalStudents =
    assignments.reduce(
      (sum, assignment) =>
        sum +
        assignment.submissions,
      0
    );

  const totalEvaluated =
    assignments.reduce(
      (sum, assignment) =>
        sum +
        assignment.evaluated,
      0
    );

  const recentAssignments =
    assignments.slice(0, 5);

  if (loading) {
    return (
      <AppShell title="Dashboard">
        <div className="page">
          <div
            className={
              styles.loading
            }
          >
            Loading dashboard...
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard">
      <div
        className={styles.dashboard}
      >
        {/* HEADER */}

        <div className={styles.header}>
          <div
            className={
              styles.headerLeft
            }
          >
            <div
              className={
                styles.eyebrow
              }
            >
              PaperMark AI
            </div>

            <h1
              className={styles.title}
            >
              Dashboard
            </h1>

            <p
              className={
                styles.description
              }
            >
              Manage evaluations, student
              submissions and marking
              workflows.
            </p>
          </div>

          <button
            type="button"
            className={
              styles.newButton
            }
            onClick={() =>
              router.push(
                "/assignments/new"
              )
            }
          >
            <Plus size={14} />
            New Evaluation
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className={styles.error}
            style={{
              marginBottom: 18,
            }}
          >
            {error}
          </div>
        )}

        {/* STAT CARDS */}

        <div
          className={
            styles.statsGrid
          }
        >
          <div
            className={
              styles.statCard
            }
          >
            <div
              className={
                styles.statTop
              }
            >
              <span
                className={
                  styles.statLabel
                }
              >
                Evaluations
              </span>

              <div
                className={
                  styles.statIcon
                }
              >
                <FileCheck2
                  size={16}
                />
              </div>
            </div>

            <div
              className={
                styles.statValue
              }
            >
              {totalAssignments}
            </div>

            <div
              className={
                styles.statSub
              }
            >
              Total evaluations
            </div>
          </div>

          <div
            className={
              styles.statCard
            }
          >
            <div
              className={
                styles.statTop
              }
            >
              <span
                className={
                  styles.statLabel
                }
              >
                Completed
              </span>

              <div
                className={
                  styles.statIcon
                }
              >
                <CheckCircle2
                  size={16}
                />
              </div>
            </div>

            <div
              className={
                styles.statValue
              }
            >
              {
                completedAssignments
              }
            </div>

            <div
              className={
                styles.statSub
              }
            >
              Completed evaluations
            </div>
          </div>

          <div
            className={
              styles.statCard
            }
          >
            <div
              className={
                styles.statTop
              }
            >
              <span
                className={
                  styles.statLabel
                }
              >
                Students
              </span>

              <div
                className={
                  styles.statIcon
                }
              >
                <Users size={16} />
              </div>
            </div>

            <div
              className={
                styles.statValue
              }
            >
              {totalStudents}
            </div>

            <div
              className={
                styles.statSub
              }
            >
              Student submissions
            </div>
          </div>

          <div
            className={
              styles.statCard
            }
          >
            <div
              className={
                styles.statTop
              }
            >
              <span
                className={
                  styles.statLabel
                }
              >
                Evaluated
              </span>

              <div
                className={
                  styles.statIcon
                }
              >
                <BarChart3
                  size={16}
                />
              </div>
            </div>

            <div
              className={
                styles.statValue
              }
            >
              {totalEvaluated}
            </div>

            <div
              className={
                styles.statSub
              }
            >
              Scripts evaluated
            </div>
          </div>
        </div>

        {/* MAIN GRID */}

        <div
          className={
            styles.mainGrid
          }
        >
          {/* RECENT ASSIGNMENTS */}

          <section
            className={`${styles.card}`}
          >
            <div
              className={
                styles.cardHeader
              }
            >
              <div
                className={
                  styles.cardHeaderText
                }
              >
                <h2
                  className={
                    styles.cardTitle
                  }
                >
                  Recent Evaluations
                </h2>

                <p
                  className={
                    styles.cardDescription
                  }
                >
                  Your latest evaluation
                  activities.
                </p>
              </div>

              <button
                type="button"
                style={{
                  border: 0,
                  background:
                    "transparent",
                  color:
                    "var(--green-dark)",
                  fontSize: 10,
                  fontWeight: 800,
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 4,
                  cursor: "pointer",
                }}
                onClick={() =>
                  router.push(
                    "/assignments"
                  )
                }
              >
                View All
                <ArrowRight
                  size={12}
                />
              </button>
            </div>

            <div
              className={
                styles.assignmentList
              }
            >
              {recentAssignments.length ===
                0 && (
                <div
                  className={
                    styles.empty
                  }
                >
                  <FilePlus2
                    size={25}
                    style={{
                      marginBottom: 8,
                      opacity: 0.5,
                    }}
                  />

                  <div>
                    No evaluations yet.
                  </div>

                  <button
                    type="button"
                    style={{
                      marginTop: 10,
                      border: 0,
                      background:
                        "transparent",
                      color:
                        "var(--green-dark)",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                    onClick={() =>
                      router.push(
                        "/assignments/new"
                      )
                    }
                  >
                    Create your first
                    evaluation
                  </button>
                </div>
              )}

              {recentAssignments.map(
                (assignment) => {
                  const status =
                    assignment.status.toLowerCase();

                  return (
                    <div
                      className={
                        styles.assignmentItem
                      }
                      key={
                        assignment.id
                      }
                    >
                      <div
                        className={
                          styles.assignmentInfo
                        }
                      >
                        <div
                          className={
                            styles.assignmentTitle
                          }
                        >
                          {
                            assignment.title
                          }
                        </div>

                        <div
                          className={
                            styles.assignmentCourse
                          }
                        >
                          {assignment.course ||
                            "No course"}{" "}
                          ·{" "}
                          {
                            assignment.questions
                          }{" "}
                          questions
                        </div>
                      </div>

                      <div
                        className={
                          styles.assignmentMeta
                        }
                      >
                        <span
                          className={
                            styles.assignmentMarks
                          }
                        >
                          {
                            assignment.total_marks
                          }{" "}
                          marks
                        </span>

                        <span
                          className={`${styles.status} ${
                            status ===
                            "completed"
                              ? styles.statusCompleted
                              : status ===
                                "processing"
                              ? styles.statusProcessing
                              : styles.statusDraft
                          }`}
                        >
                          {
                            assignment.status
                          }
                        </span>

                        <button
                          type="button"
                          style={{
                            width: 28,
                            height: 28,
                            border:
                              "1px solid #dce5df",
                            background:
                              "#fff",
                            borderRadius: 7,
                            display:
                              "grid",
                            placeItems:
                              "center",
                            color:
                              "#5f6a64",
                          }}
                          onClick={() =>
                            router.push(
                              `/assignments/${assignment.id}`
                            )
                          }
                          aria-label="Open evaluation"
                        >
                          <ArrowRight
                            size={12}
                          />
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* QUICK ACTIONS */}

          <section
            className={styles.card}
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
                  Quick Actions
                </h2>

                <p
                  className={
                    styles.cardDescription
                  }
                >
                  Common instructor tasks.
                </p>
              </div>
            </div>

            <div
              className={
                styles.actions
              }
            >
              <button
                type="button"
                className={
                  styles.actionButton
                }
                onClick={() =>
                  router.push(
                    "/assignments/new"
                  )
                }
              >
                <div
                  className={
                    styles.actionIcon
                  }
                >
                  <Plus size={15} />
                </div>

                <div
                  className={
                    styles.actionText
                  }
                >
                  <div
                    className={
                      styles.actionTitle
                    }
                  >
                    New Evaluation
                  </div>

                  <div
                    className={
                      styles.actionDescription
                    }
                  >
                    Create questions and
                    marking rules.
                  </div>
                </div>
              </button>

              <button
                type="button"
                className={
                  styles.actionButton
                }
                onClick={() =>
                  router.push(
                    "/assignments"
                  )
                }
              >
                <div
                  className={
                    styles.actionIcon
                  }
                >
                  <FileCheck2
                    size={15}
                  />
                </div>

                <div
                  className={
                    styles.actionText
                  }
                >
                  <div
                    className={
                      styles.actionTitle
                    }
                  >
                    View Assignments
                  </div>

                  <div
                    className={
                      styles.actionDescription
                    }
                  >
                    Review all evaluations
                    and submissions.
                  </div>
                </div>
              </button>

              <button
                type="button"
                className={
                  styles.actionButton
                }
                onClick={() =>
                  router.push(
                    "/students"
                  )
                }
              >
                <div
                  className={
                    styles.actionIcon
                  }
                >
                  <Users size={15} />
                </div>

                <div
                  className={
                    styles.actionText
                  }
                >
                  <div
                    className={
                      styles.actionTitle
                    }
                  >
                    Students
                  </div>

                  <div
                    className={
                      styles.actionDescription
                    }
                  >
                    Manage student
                    information.
                  </div>
                </div>
              </button>

              <button
                type="button"
                className={
                  styles.actionButton
                }
                onClick={() =>
                  router.push(
                    "/analytics"
                  )
                }
              >
                <div
                  className={
                    styles.actionIcon
                  }
                >
                  <BarChart3
                    size={15}
                  />
                </div>

                <div
                  className={
                    styles.actionText
                  }
                >
                  <div
                    className={
                      styles.actionTitle
                    }
                  >
                    Analytics
                  </div>

                  <div
                    className={
                      styles.actionDescription
                    }
                  >
                    Review evaluation
                    performance.
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* OVERVIEW */}

        <section
          className={`${styles.card} ${styles.overview}`}
        >
          <div
            className={
              styles.overviewHeader
            }
          >
            <div>
              <h2
                className={
                  styles.overviewTitle
                }
              >
                Workspace Overview
              </h2>
            </div>
          </div>

          <div
            className={
              styles.overviewGrid
            }
          >
            <div
              className={
                styles.overviewItem
              }
            >
              <div
                className={
                  styles.overviewLabel
                }
              >
                Processing
              </div>

              <div
                className={
                  styles.overviewValue
                }
              >
                {
                  processingAssignments
                }
              </div>
            </div>

            <div
              className={
                styles.overviewItem
              }
            >
              <div
                className={
                  styles.overviewLabel
                }
              >
                Completion Rate
              </div>

              <div
                className={
                  styles.overviewValue
                }
              >
                {totalStudents > 0
                  ? Math.round(
                      (totalEvaluated /
                        totalStudents) *
                        100
                    )
                  : 0}
                %
              </div>
            </div>

            <div
              className={
                styles.overviewItem
              }
            >
              <div
                className={
                  styles.overviewLabel
                }
              >
                Active Workflow
              </div>

              <div
                className={
                  styles.overviewValue
                }
              >
                <Clock3
                  size={16}
                  style={{
                    marginRight: 5,
                    verticalAlign:
                      "middle",
                  }}
                />
                Ready
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}