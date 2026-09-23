"use client";

import {
  Bot,
  FilePenLine,
  ImageIcon,
  Languages,
  Plus,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import styles from "./extensions.module.css";

const extensions = [
  {
    name: "AI Usage Checker",
    description:
      "Estimate AI-like writing signals in student submissions.",
    icon: Bot,
  },
  {
    name: "Grammar Checker",
    description:
      "Check grammar, spelling and punctuation in answers.",
    icon: Languages,
  },
  {
    name: "Manual Review",
    description:
      "Review diagrams, images and visual answers manually.",
    icon: ImageIcon,
  },
  {
    name: "PDF Marking",
    description:
      "Add marks and comments directly to student PDFs.",
    icon: FilePenLine,
  },
];

export default function ExtensionsPage() {
  return (
    <AppShell title="Extensions">
      <div className={styles.page}>
        {/* HEADER */}

        <div className={styles.header}>
          <div
            className={styles.eyebrow}
          >
            PaperMark AI
          </div>

          <h1
            className={styles.title}
          >
            Extensions
          </h1>

          <p
            className={
              styles.description
            }
          >
            Add extra tools to your
            assignment evaluation
            workflow.
          </p>
        </div>

        {/* EXTENSIONS */}

        <div className={styles.grid}>
          {extensions.map(
            (extension) => {
              const Icon =
                extension.icon;

              return (
                <div
                  className={styles.card}
                  key={
                    extension.name
                  }
                >
                  <div
                    className={
                      styles.icon
                    }
                  >
                    <Icon size={23} />
                  </div>

                  <div
                    className={
                      styles.content
                    }
                  >
                    <h2
                      className={
                        styles.name
                      }
                    >
                      {
                        extension.name
                      }
                    </h2>

                    <p
                      className={
                        styles.cardDescription
                      }
                    >
                      {
                        extension.description
                      }
                    </p>
                  </div>

                  <div
                    className={
                      styles.bottom
                    }
                  >
                    <span
                      className={
                        styles.comingSoon
                      }
                    >
                      Coming Soon
                    </span>

                    <button
                      type="button"
                      className={
                        styles.addButton
                      }
                      onClick={() =>
                        alert(
                          `${extension.name} will be available soon.`
                        )
                      }
                    >
                      <Plus
                        size={13}
                      />
                      Add
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </AppShell>
  );
}