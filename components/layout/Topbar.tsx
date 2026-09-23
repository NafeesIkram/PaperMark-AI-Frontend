"use client";

import { Bell } from "lucide-react";

import styles from "./Topbar.module.css";

type TopbarProps = {
  title: string;
};

export default function Topbar({
  title,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.title}>
        {title}
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconButton}
          type="button"
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>
      </div>
    </header>
  );
}