"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Mail,
  MessageCircle,
  BrainCircuit,
  BarChart3,
  ClipboardCheck,
  GitCompareArrows,
  MessageSquareText,
  UserRound,
} from "lucide-react";

import styles from "./about.module.css";


export default function AboutPage() {
  return (
    <main className={styles.page}>

      <div className={styles.container}>

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        <Link
          href="/dashboard"
          className={styles.backButton}
        >
          <ArrowLeft size={15} />
          <span>Back to Dashboard</span>
        </Link>


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <section className={styles.hero}>

          <div className={styles.badge}>
            PaperMark AI
          </div>

          <h1 className={styles.title}>
            About Me
          </h1>

          <p className={styles.heroDescription}>
            Developer and creator of PaperMark AI,
            an AI-assisted assignment evaluation platform
            designed to make academic evaluation simpler
            and more efficient.
          </p>

        </section>


        {/* ================================================= */}
        {/* PROFILE */}
        {/* ================================================= */}

        <section className={styles.profileCard}>

          <div className={styles.profileImageWrapper}>

            <Image
              src="/Nafees.jpeg"
              alt="Nafees Ikram"
              width={130}
              height={130}
              className={styles.profileImage}
              priority
            />

          </div>


          <div className={styles.profileInfo}>

            <div className={styles.profileLabel}>
              Developer & Creator
            </div>

            <h2 className={styles.profileName}>
              Nafees Ikram
            </h2>

            <p className={styles.profileDescription}>
              I created PaperMark AI to help instructors
              evaluate student answers using AI-assisted
              analysis, scoring, and feedback.
            </p>

            <div className={styles.contactLinks}>

              {/* EMAIL */}

              <a
                href="mailto:nafees.ikram01@gmail.com"
                className={styles.contactButton}
              >
                <Mail size={15} />
                <span>Email Me</span>
              </a>


              {/* WHATSAPP */}

              <a
                href="https://wa.me/8801735581445"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactButton}
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </a>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* ABOUT PAPER MARK AI */}
        {/* ================================================= */}

        <section className={styles.section}>

          <div className={styles.sectionHeader}>

            <div className={styles.sectionIcon}>
              <BrainCircuit size={18} />
            </div>

            <div>

              <h2 className={styles.sectionTitle}>
                About PaperMark AI
              </h2>

              <p className={styles.sectionSubtitle}>
                AI-assisted assignment evaluation
              </p>

            </div>

          </div>


          <div className={styles.textCard}>

            <p>
              PaperMark AI is an instructor-focused
              assignment evaluation system.
            </p>

            <p>
              It allows instructors to provide an expected
              answer and evaluate student answers using
              AI-assisted analysis.
            </p>

            <p>
              The system can generate scores and simple
              feedback to help instructors understand
              student performance.
            </p>

          </div>

        </section>


        {/* ================================================= */}
        {/* CURRENT FEATURES */}
        {/* ================================================= */}

        <section className={styles.section}>

          <div className={styles.sectionHeader}>

            <div className={styles.sectionIcon}>
              <ClipboardCheck size={18} />
            </div>

            <div>

              <h2 className={styles.sectionTitle}>
                Current Features
              </h2>

              <p className={styles.sectionSubtitle}>
                What PaperMark AI currently provides
              </p>

            </div>

          </div>


          <div className={styles.featureGrid}>

            {/* FEATURE 1 */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <GitCompareArrows size={18} />
              </div>

              <div>

                <h3>
                  Answer Comparison
                </h3>

                <p>
                  Compare student answers with the
                  instructor's expected answer.
                </p>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BrainCircuit size={18} />
              </div>

              <div>

                <h3>
                  AI Evaluation
                </h3>

                <p>
                  Analyze answers using AI-assisted
                  evaluation.
                </p>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BarChart3 size={18} />
              </div>

              <div>

                <h3>
                  Evaluation Score
                </h3>

                <p>
                  Generate marks and percentage based
                  on the evaluation.
                </p>

              </div>

            </div>


            {/* FEATURE 4 */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <MessageSquareText size={18} />
              </div>

              <div>

                <h3>
                  AI Feedback
                </h3>

                <p>
                  Provide simple feedback about what
                  was done well and what needs improvement.
                </p>

              </div>

            </div>


            {/* FEATURE 5 */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <UserRound size={18} />
              </div>

              <div>

                <h3>
                  Student Management
                </h3>

                <p>
                  Manage students and their evaluation
                  submissions from one workspace.
                </p>

              </div>

            </div>


            {/* FEATURE 6 */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BarChart3 size={18} />
              </div>

              <div>

                <h3>
                  Analytics
                </h3>

                <p>
                  View evaluation, submission, and
                  performance information.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* CONTACT */}
        {/* ================================================= */}

        <section className={styles.contactCard}>

          <div className={styles.contactIcon}>
            <MessageCircle size={20} />
          </div>


          <div className={styles.contactContent}>

            <h2>
              Get in Touch
            </h2>

            <p>
              Have feedback, suggestions, or questions
              about PaperMark AI?
            </p>


            <div className={styles.contactActions}>

              <a
                href="mailto:nafees.ikram01@gmail.com"
                className={styles.actionButton}
              >
                <Mail size={15} />
                Email
              </a>


              <a
                href="https://wa.me/8801735581445"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <footer className={styles.footer}>

          <div>
            PaperMark AI
          </div>

          <span>
            AI-assisted assignment evaluation
          </span>

          <span>
            Version 1.0
          </span>

        </footer>

      </div>

    </main>
  );
}