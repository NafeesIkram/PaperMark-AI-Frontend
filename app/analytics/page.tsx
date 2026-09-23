"use client";

import { useEffect, useState } from "react";

import {
  BarChart3,
  CheckCircle2,
  FileCheck2,
  Users,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getAnalytics,
  type AnalyticsResponse,
} from "@/lib/api";

import styles from "./analytics.module.css";


export default function AnalyticsPage() {

  const [data, setData] =
    useState<AnalyticsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD ANALYTICS
  // =========================================================

  async function loadAnalytics() {

    try {

      setLoading(true);

      setError("");

      const result =
        await getAnalytics();

      setData(result);

    } catch (err) {

      console.error(
        "Analytics loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load analytics."
      );

    } finally {

      setLoading(false);

    }
  }


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadAnalytics();

  }, []);


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <AppShell title="Analytics">

      <div className={styles.page}>

        {/* HEADER */}

        <div className={styles.header}>

          <div className={styles.eyebrow}>
            PaperMark AI
          </div>

          <h1 className={styles.title}>
            Analytics
          </h1>

          <p className={styles.description}>
            Overview of evaluation activity and student performance.
          </p>

        </div>


        {/* LOADING */}

        {loading && (

          <div className={styles.loadingCard}>
            Loading analytics...
          </div>

        )}


        {/* ERROR */}

        {!loading && error && (

          <div className={styles.errorCard}>

            <div className={styles.errorTitle}>
              Unable to load analytics
            </div>

            <div className={styles.errorText}>
              {error}
            </div>

            <button
              type="button"
              className={styles.retryButton}
              onClick={loadAnalytics}
            >
              Try Again
            </button>

          </div>

        )}


        {/* DATA */}

        {!loading && !error && data && (

          <>

            {/* ================================================= */}
            {/* STAT CARDS */}
            {/* ================================================= */}

            <div className={styles.statsGrid}>

              {/* Evaluations */}

              <div className={styles.statCard}>

                <div className={styles.statHeader}>

                  <span className={styles.statLabel}>
                    Evaluations
                  </span>

                  <div className={styles.statIcon}>
                    <FileCheck2 size={15} />
                  </div>

                </div>

                <div className={styles.statValue}>
                  {data.evaluations}
                </div>

                <div className={styles.statSub}>
                  Total evaluations
                </div>

              </div>


              {/* Students */}

              <div className={styles.statCard}>

                <div className={styles.statHeader}>

                  <span className={styles.statLabel}>
                    Students
                  </span>

                  <div className={styles.statIcon}>
                    <Users size={15} />
                  </div>

                </div>

                <div className={styles.statValue}>
                  {data.students}
                </div>

                <div className={styles.statSub}>
                  Unique students
                </div>

              </div>


              {/* Submissions */}

              <div className={styles.statCard}>

                <div className={styles.statHeader}>

                  <span className={styles.statLabel}>
                    Submissions
                  </span>

                  <div className={styles.statIcon}>
                    <FileCheck2 size={15} />
                  </div>

                </div>

                <div className={styles.statValue}>
                  {data.submissions}
                </div>

                <div className={styles.statSub}>
                  Student submissions
                </div>

              </div>


              {/* Evaluated */}

              <div className={styles.statCard}>

                <div className={styles.statHeader}>

                  <span className={styles.statLabel}>
                    Evaluated
                  </span>

                  <div className={styles.statIcon}>
                    <CheckCircle2 size={15} />
                  </div>

                </div>

                <div className={styles.statValue}>
                  {data.evaluated}
                </div>

                <div className={styles.statSub}>
                  Completed scripts
                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* AVERAGE SCORE */}
            {/* ================================================= */}

            <div className={styles.averageCard}>

              <div className={styles.averageLeft}>

                <div className={styles.averageLabel}>
                  Average Score
                </div>

                <div className={styles.averageValue}>
                  {Number(
                    data.average_score
                  ).toFixed(1)}
                  %
                </div>

                <div className={styles.averageSub}>
                  Across evaluated scripts
                </div>

              </div>

              <div className={styles.averageIcon}>
                <BarChart3 size={20} />
              </div>

            </div>


            {/* ================================================= */}
            {/* CONTENT GRID */}
            {/* ================================================= */}

            <div className={styles.contentGrid}>


              {/* PERFORMANCE */}

              <section className={styles.card}>

                <div className={styles.cardHeader}>

                  <h2 className={styles.cardTitle}>
                    Evaluation Performance
                  </h2>

                  <p className={styles.cardDescription}>
                    Current workspace progress.
                  </p>

                </div>


                <div className={styles.performance}>

                  {data.performance.map(
                    (item) => (

                      <div
                        className={
                          styles.performanceRow
                        }
                        key={item.label}
                      >

                        <div
                          className={
                            styles.performanceTop
                          }
                        >

                          <span
                            className={
                              styles.performanceLabel
                            }
                          >
                            {item.label}
                          </span>

                          <span
                            className={
                              styles.performanceValue
                            }
                          >
                            {Number(
                              item.value
                            ).toFixed(1)}
                            %
                          </span>

                        </div>


                        <div
                          className={
                            styles.progress
                          }
                        >

                          <div
                            className={
                              styles.progressFill
                            }
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  Number(item.value),
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              </section>


              {/* DISTRIBUTION */}

              <section className={styles.card}>

                <div className={styles.cardHeader}>

                  <h2 className={styles.cardTitle}>
                    Score Distribution
                  </h2>

                  <p className={styles.cardDescription}>
                    Evaluated student score ranges.
                  </p>

                </div>


                <div className={styles.distribution}>

                  {data.distribution.map(
                    (item) => (

                      <div
                        className={
                          styles.distributionRow
                        }
                        key={item.label}
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
                              width: `${Math.min(
                                Math.max(
                                  Number(
                                    item.percentage
                                  ),
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>


                        <span
                          className={
                            styles.distributionValue
                          }
                        >
                          {item.value}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </section>

            </div>


            {/* ================================================= */}
            {/* INSIGHTS */}
            {/* ================================================= */}

            <section
              className={`${styles.card} ${styles.insights}`}
            >

              <h2 className={styles.cardTitle}>
                Evaluation Insights
              </h2>

              <p className={styles.cardDescription}>
                Current indicators from your evaluation workspace.
              </p>


              <div className={styles.insightGrid}>

                <div className={styles.insight}>

                  <div className={styles.insightTitle}>
                    Evaluations
                  </div>

                  <div className={styles.insightText}>
                    You currently have{" "}
                    {data.evaluations} evaluation
                    {data.evaluations !== 1
                      ? "s"
                      : ""}{" "}
                    in your workspace.
                  </div>

                </div>


                <div className={styles.insight}>

                  <div className={styles.insightTitle}>
                    Submission Coverage
                  </div>

                  <div className={styles.insightText}>
                    {data.evaluated} of{" "}
                    {data.submissions} submitted
                    scripts have been evaluated.
                  </div>

                </div>


                <div className={styles.insight}>

                  <div className={styles.insightTitle}>
                    Average Performance
                  </div>

                  <div className={styles.insightText}>
                    The current average score across
                    evaluated scripts is{" "}
                    {Number(
                      data.average_score
                    ).toFixed(1)}
                    %.
                  </div>

                </div>

              </div>

            </section>

          </>

        )}

      </div>

    </AppShell>

  );
}