"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
  MoreHorizontal,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getStudents,
  StudentListItem,
} from "@/lib/api";

import styles from "./students.module.css";


export default function StudentsPage() {

  const [students, setStudents] =
    useState<StudentListItem[]>(
      []
    );

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  useEffect(() => {

    let mounted = true;


    async function loadStudents() {

      try {

        setLoading(true);

        setError("");


        const data =
          await getStudents();


        if (mounted) {

          setStudents(data);

        }

      } catch (err) {

        if (mounted) {

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load students."
          );

        }

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    }


    loadStudents();


    return () => {

      mounted = false;

    };

  }, []);


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredStudents =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      if (!value) {

        return students;

      }


      return students.filter(
        (student) =>

          student.student_id
            .toLowerCase()
            .includes(value)

          ||

          (
            student.name || ""
          )
            .toLowerCase()
            .includes(value)
      );

    }, [
      students,
      search,
    ]);


  // =========================================================
  // STATS
  // =========================================================

  const totalSubmissions =
    students.reduce(
      (
        sum,
        student
      ) =>
        sum +
        student.submissions,

      0
    );


  const totalEvaluated =
    students.reduce(
      (
        sum,
        student
      ) =>
        sum +
        student.evaluated,

      0
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <AppShell title="Students">

      <div
        className={
          styles.page
        }
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className={
            styles.header
          }
        >

          <div>

            <div
              className={
                styles.eyebrow
              }
            >
              PaperMark AI
            </div>


            <h1
              className={
                styles.title
              }
            >
              Students
            </h1>


            <p
              className={
                styles.description
              }
            >
              Manage students and their
              evaluation submissions.
            </p>

          </div>


          <button
            type="button"
            className={
              styles.addButton
            }
            onClick={() =>
              alert(
                "Add Student will be connected to an evaluation in the next version."
              )
            }
          >

            <Plus size={14} />

            Add Student

          </button>

        </div>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (

          <div
            style={{
              marginBottom: 18,
              padding:
                "12px 14px",
              border:
                "1px solid #fecaca",
              borderRadius: 9,
              background:
                "#fff5f5",
              color:
                "#dc2626",
              fontSize: 11,
            }}
          >
            {error}
          </div>

        )}


        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div
          className={
            styles.stats
          }
        >

          {/* TOTAL STUDENTS */}

          <div
            className={
              styles.stat
            }
          >

            <div
              className={
                styles.statLabel
              }
            >
              Total Students
            </div>


            <div
              className={
                styles.statValue
              }
            >
              {loading
                ? "—"
                : students.length}
            </div>


            <div
              className={
                styles.statSub
              }
            >
              Students in workspace
            </div>

          </div>


          {/* SUBMISSIONS */}

          <div
            className={
              styles.stat
            }
          >

            <div
              className={
                styles.statLabel
              }
            >
              Submissions
            </div>


            <div
              className={
                styles.statValue
              }
            >
              {loading
                ? "—"
                : totalSubmissions}
            </div>


            <div
              className={
                styles.statSub
              }
            >
              Total submitted scripts
            </div>

          </div>


          {/* EVALUATED */}

          <div
            className={
              styles.stat
            }
          >

            <div
              className={
                styles.statLabel
              }
            >
              Evaluated
            </div>


            <div
              className={
                styles.statValue
              }
            >
              {loading
                ? "—"
                : totalEvaluated}
            </div>


            <div
              className={
                styles.statSub
              }
            >
              Completed evaluations
            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* TABLE CARD */}
        {/* ================================================= */}

        <div
          className={
            styles.card
          }
        >

          {/* TOOLBAR */}

          <div
            className={
              styles.toolbar
            }
          >

            <div>

              <strong
                style={{
                  fontSize: 12,
                }}
              >
                Student Directory
              </strong>

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
                className={
                  styles.search
                }
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search students..."
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading ? (

            <div
              className={
                styles.empty
              }
            >
              Loading students...
            </div>

          ) : filteredStudents.length ===
            0 ? (

            <div
              className={
                styles.empty
              }
            >
              {search
                ? "No students found."
                : "No students have been added yet."}
            </div>

          ) : (

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
                      Submissions
                    </th>

                    <th>
                      Evaluated
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
                          student.student_id
                        }
                      >

                        <td>

                          <span
                            className={
                              styles.studentId
                            }
                          >
                            {
                              student.student_id
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
                              student.name ||
                              "Unnamed Student"
                            }
                          </span>

                        </td>


                        <td>
                          {
                            student.submissions
                          }
                        </td>


                        <td>
                          {
                            student.evaluated
                          }
                        </td>


                        <td>

                          <span
                            className={
                              styles.badge
                            }
                          >
                            {
                              student.status ||
                              "Active"
                            }
                          </span>

                        </td>


                        <td>

                          <button
                            type="button"
                            className={
                              styles.actionButton
                            }
                            onClick={() =>
                              alert(
                                `Student ${student.student_id}`
                              )
                            }
                            aria-label="Student actions"
                          >

                            <MoreHorizontal
                              size={14}
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