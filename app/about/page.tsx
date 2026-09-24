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
  PenLine,
  FileText,
  ScanText,
  Zap,
  Database,
  Code2,
  ShieldCheck,
  FileOutput,
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
        {/* HERO */}
        {/* ================================================= */}

        <section className={styles.hero}>

          <div className={styles.badge}>
            PaperMark AI • In Development
          </div>

          <h1 className={styles.title}>
            About Me
          </h1>

          <p className={styles.heroDescription}>
            Developer and creator of PaperMark AI, an AI-assisted
            assignment evaluation platform designed to help
            instructors evaluate student submissions more
            efficiently and consistently.
          </p>

        </section>


        {/* ================================================= */}
        {/* DEVELOPMENT STATUS */}
        {/* ================================================= */}

        <section className={styles.statusCard}>

          <div className={styles.statusIcon}>
            <Zap size={19} />
          </div>

          <div className={styles.statusContent}>

            <div className={styles.statusHeader}>

              <h2>
                Currently in Development
              </h2>

              <span className={styles.statusBadge}>
                Version 1.0
              </span>

            </div>

            <p>
              PaperMark AI is an actively developing project.
              The current version focuses on AI-assisted assignment
              evaluation, answer comparison, scoring, student
              management, analytics, and feedback generation.
            </p>

          </div>

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
              I created PaperMark AI to help instructors evaluate
              student answers using AI-assisted analysis, scoring,
              comparison, and feedback.
            </p>


            <div className={styles.contactLinks}>

              <a
                href="mailto:nafees.ikram01@gmail.com"
                className={styles.contactButton}
              >
                <Mail size={15} />
                <span>Email Me</span>
              </a>


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
              PaperMark AI is an instructor-focused assignment
              evaluation system designed to simplify the process
              of reviewing and evaluating student submissions.
            </p>

            <p>
              Instructors can provide an expected answer and
              evaluate student answers using AI-assisted analysis.
              The system can generate marks, percentages, and
              feedback based on the evaluation.
            </p>

            <p>
              The platform is currently in active development.
              New document processing, evaluation, plagiarism
              detection, reporting, and advanced AI-assisted
              features are planned for future versions.
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


            {/* Answer Comparison */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <GitCompareArrows size={18} />
              </div>

              <div>

                <h3>
                  Answer Comparison
                </h3>

                <p>
                  Compare student answers with the instructor's
                  expected answer.
                </p>

              </div>

            </div>


            {/* AI Evaluation */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BrainCircuit size={18} />
              </div>

              <div>

                <h3>
                  AI Evaluation
                </h3>

                <p>
                  Analyze student answers using AI-assisted
                  evaluation.
                </p>

              </div>

            </div>


            {/* Evaluation Score */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BarChart3 size={18} />
              </div>

              <div>

                <h3>
                  Evaluation Score
                </h3>

                <p>
                  Generate marks and percentages based on the
                  evaluation.
                </p>

              </div>

            </div>


            {/* AI Feedback */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <MessageSquareText size={18} />
              </div>

              <div>

                <h3>
                  AI Feedback
                </h3>

                <p>
                  Explain what the student did well, what was
                  missed, and what needs improvement.
                </p>

              </div>

            </div>


            {/* Student Management */}

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


            {/* Analytics */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BarChart3 size={18} />
              </div>

              <div>

                <h3>
                  Analytics
                </h3>

                <p>
                  View evaluation, submission, score, and
                  performance information.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* FUTURE DEVELOPMENT */}
        {/* ================================================= */}

        <section className={styles.section}>

          <div className={styles.sectionHeader}>

            <div className={styles.sectionIcon}>
              <Zap size={18} />
            </div>

            <div>

              <h2 className={styles.sectionTitle}>
                Future Development
              </h2>

              <p className={styles.sectionSubtitle}>
                Planned features and improvements
              </p>

            </div>

          </div>


          <div className={styles.featureGrid}>


            {/* PDF Upload */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <FileText size={18} />
              </div>

              <div>

                <h3>
                  PDF Assignment Upload
                </h3>

                <p>
                  Upload instructor answer sheets and student
                  assignments directly as PDF files.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* PDF Extraction */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <ScanText size={18} />
              </div>

              <div>

                <h3>
                  PDF Text Extraction
                </h3>

                <p>
                  Automatically extract text from uploaded
                  assignment documents for evaluation.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* OCR */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <ScanText size={18} />
              </div>

              <div>

                <h3>
                  OCR for Scanned Answers
                </h3>

                <p>
                  Read scanned, image-based, and handwritten
                  assignment content using OCR.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Code Questions */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <Code2 size={18} />
              </div>

              <div>

                <h3>
                  Code Question Evaluation
                </h3>

                <p>
                  Support programming and code-related questions
                  with AI-assisted code evaluation.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* AI Plagiarism Checker */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <ShieldCheck size={18} />
              </div>

              <div>

                <h3>
                  AI Plagiarism Checker
                </h3>

                <p>
                  Check student submissions for potential
                  plagiarism and similarities between answers.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Detailed Evaluation */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <MessageSquareText size={18} />
              </div>

              <div>

                <h3>
                  Detailed Evaluation
                </h3>

                <p>
                  Generate descriptive evaluations explaining
                  strengths, weaknesses, missing points, and
                  areas for improvement.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Detailed Comments */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <MessageCircle size={18} />
              </div>

              <div>

                <h3>
                  Detailed Comments
                </h3>

                <p>
                  Provide clear comments explaining why marks
                  were awarded or deducted and how students
                  can improve.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Report Generation */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <FileOutput size={18} />
              </div>

              <div>

                <h3>
                  Evaluation Report Generation
                </h3>

                <p>
                  Generate structured reports containing marks,
                  feedback, performance summaries, and results.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* PDF Annotation */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <PenLine size={18} />
              </div>

              <div>

                <h3>
                  PDF Annotation
                </h3>

                <p>
                  Add marks, comments, corrections, and feedback
                  directly onto student PDFs.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Rubric */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <ClipboardCheck size={18} />
              </div>

              <div>

                <h3>
                  Advanced Rubric Marking
                </h3>

                <p>
                  Evaluate answers using detailed rubrics,
                  criteria, individual marks, and custom
                  marking rules.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Grammar */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <MessageSquareText size={18} />
              </div>

              <div>

                <h3>
                  Grammar & Writing Checker
                </h3>

                <p>
                  Detect grammar, spelling, sentence structure,
                  and writing issues in student answers.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Advanced Analytics */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BarChart3 size={18} />
              </div>

              <div>

                <h3>
                  Advanced Analytics
                </h3>

                <p>
                  Provide deeper insights into student
                  performance, question-wise results, and
                  evaluation trends.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Multiple AI Providers */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <BrainCircuit size={18} />
              </div>

              <div>

                <h3>
                  Multiple AI Providers
                </h3>

                <p>
                  Support multiple AI providers and allow
                  instructors to select their preferred
                  evaluation model.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Evaluation History */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <Database size={18} />
              </div>

              <div>

                <h3>
                  Evaluation History
                </h3>

                <p>
                  Maintain organized records of previous
                  evaluations, scores, feedback, and results.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>


            {/* Manual Review */}

            <div className={styles.featureCard}>

              <div className={styles.featureIcon}>
                <UserRound size={18} />
              </div>

              <div>

                <h3>
                  Manual Review Tools
                </h3>

                <p>
                  Allow instructors to review, edit, and adjust
                  AI-generated evaluations before finalizing
                  results.
                </p>

                <span className={styles.comingSoon}>
                  Coming Soon
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* LONG-TERM VISION */}
        {/* ================================================= */}

        <section className={styles.section}>

          <div className={styles.sectionHeader}>

            <div className={styles.sectionIcon}>
              <BrainCircuit size={18} />
            </div>

            <div>

              <h2 className={styles.sectionTitle}>
                Long-Term Vision
              </h2>

              <p className={styles.sectionSubtitle}>
                Where PaperMark AI is heading
              </p>

            </div>

          </div>


          <div className={styles.textCard}>

            <p>
              The long-term vision for PaperMark AI is to create
              a complete AI-assisted academic evaluation platform
              where instructors can manage questions, expected
              answers, student submissions, evaluation rules,
              feedback, and reports from one place.
            </p>

            <p>
              The platform will gradually expand from basic
              answer comparison and scoring into document
              processing, OCR, code evaluation, plagiarism
              checking, detailed feedback, PDF annotation,
              report generation, and advanced analytics.
            </p>

            <p>
              These features are planned for future versions and
              will be introduced progressively as PaperMark AI
              continues to develop.
            </p>

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
              Have feedback, suggestions, or questions about
              PaperMark AI?
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
            Version 1.0 • In Development
          </span>

        </footer>

      </div>
    </main>
  );
}