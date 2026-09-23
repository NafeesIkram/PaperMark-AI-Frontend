"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  FileCheck2,
  Plus,
  Search,
  ArrowRight,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getEvaluations,
  type EvaluationListItem,
} from "@/lib/api";

import styles from "./assignments.module.css";

type Filter =
  | "All"
  | "Completed"
  | "Processing"
  | "Draft";

export default function AssignmentsPage() {
  const router = useRouter();

  const [assignments, setAssignments] =
    useState<EvaluationListItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<Filter>("All");

  useEffect(() => {
    async function loadAssignments() {
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
            : "Failed to load assignments."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssignments();
  }, []);

  const filteredAssignments =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return assignments.filter(
        (assignment) => {
          const status =
            assignment.status.toLowerCase();

          const matchesFilter =
            filter === "All" ||
            status ===
              filter.toLowerCase();

          const matchesSearch =
            !searchValue ||
            assignment.title
              .toLowerCase()
              .includes(searchValue) ||
            (
              assignment.course || ""
            )
              .toLowerCase()
              .includes(searchValue);

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      assignments,
      filter,
      search,
    ]);

  function statusClass(
    status: string
  ) {
    const value =
      status.toLowerCase();

    if (value === "completed") {
      return styles.statusCompleted;
    }

    if (value === "processing") {
      return styles.statusProcessing;
    }

    return styles.statusDraft;
  }

  if (loading) {
    return (
      <AppShell title="Assignments">
        <div className={styles.page}>
          <div
            className={styles.loading}
          >
            Loading assignments...
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Assignments">
      <div className={styles.page}>
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <div
              className={styles.eyebrow}
            >
              PaperMark AI
            </div>

            <h1
              className={styles.title}
            >
              Assignments
            </h1>

            <p
              className={
                styles.description
              }
            >
              Manage your evaluations,
              submissions and results.
            </p>
          </div>

          <button
            type="button"
            className={styles.newButton}
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
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* CARD */}

        <div className={styles.card}>
          {/* TOOLBAR */}

          <div
            className={styles.toolbar}
          >
            <div
              className={styles.filters}
            >
              {(
                [
                  "All",
                  "Completed",
                  "Processing",
                  "Draft",
                ] as Filter[]
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`${styles.filter} ${
                    filter === item
                      ? styles.filterActive
                      : ""
                  }`}
                  onClick={() =>
                    setFilter(item)
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <div
              className={
                styles.searchWrap
              }
            >
              <Search
                size={13}
                className={
                  styles.searchIcon
                }
              />

              <input
                className={styles.search}
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search assignments..."
              />
            </div>
          </div>

          {/* TABLE */}

          {filteredAssignments.length ===
          0 ? (
            <div
              className={styles.empty}
            >
              <div
                className={
                  styles.emptyIcon
                }
              >
                <FileCheck2
                  size={19}
                />
              </div>

              <div
                className={
                  styles.emptyTitle
                }
              >
                No assignments found
              </div>

              <div
                className={
                  styles.emptyText
                }
              >
                Create a new evaluation
                to get started.
              </div>

              <button
                type="button"
                className={styles.newButton}
                style={{
                  marginTop: 14,
                }}
                onClick={() =>
                  router.push(
                    "/assignments/new"
                  )
                }
              >
                <Plus size={13} />
                Create Evaluation
              </button>
            </div>
          ) : (
            <div
              className={
                styles.tableWrap
              }
            >
              <table
                className={styles.table}
              >
                <thead>
                  <tr>
                    <th>
                      Assignment
                    </th>
                    <th>
                      Questions
                    </th>
                    <th>
                      Submissions
                    </th>
                    <th>
                      Evaluated
                    </th>
                    <th>
                      Marks
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
                  {filteredAssignments.map(
                    (assignment) => (
                      <tr
                        key={
                          assignment.id
                        }
                      >
                        <td>
                          <div
                            className={
                              styles.titleCell
                            }
                          >
                            <strong>
                              {
                                assignment.title
                              }
                            </strong>

                            <span>
                              {assignment.course ||
                                "No course"}
                            </span>
                          </div>
                        </td>

                        <td>
                          {
                            assignment.questions
                          }
                        </td>

                        <td>
                          {
                            assignment.submissions
                          }
                        </td>

                        <td>
                          {
                            assignment.evaluated
                          }
                        </td>

                        <td>
                          {
                            assignment.total_marks
                          }
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${statusClass(
                              assignment.status
                            )}`}
                          >
                            {
                              assignment.status
                            }
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={
                              styles.openButton
                            }
                            onClick={() =>
                              router.push(
                                `/assignments/${assignment.id}`
                              )
                            }
                          >
                            Open
                            <ArrowRight
                              size={11}
                            />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}