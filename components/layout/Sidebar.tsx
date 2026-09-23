"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BarChart3,
  FileCheck2,
  LayoutDashboard,
  Settings,
  Upload,
  Users,
  Puzzle,
  UserRound,
  LogOut,
} from "lucide-react";

import styles from "./Sidebar.module.css";

import { logout } from "@/lib/api";


const items = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: "/assignments",
    label: "Assignments",
    icon: FileCheck2,
  },

  {
    href: "/assignments/new",
    label: "New Evaluation",
    icon: Upload,
  },

  {
    href: "/students",
    label: "Students",
    icon: Users,
  },

  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },

  {
    href: "/extensions",
    label: "Extensions",
    icon: Puzzle,
  },

  {
    href: "/about",
    label: "About Me",
    icon: UserRound,
  },

  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];


export default function Sidebar() {

  const pathname =
    usePathname();

  const router =
    useRouter();


  async function handleLogout() {

    try {

      await logout();

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {

      // Always return to login
      // even if backend logout request fails

      router.replace("/");

      router.refresh();

    }

  }


  return (
    <aside className={styles.sidebar}>

      {/* ================================================= */}
      {/* BRAND */}
      {/* ================================================= */}

      <Link
        href="/dashboard"
        className={styles.brand}
      >

        <div
          className={styles.brandLogo}
        >

          <Image
            src="/papermark-logo.png"
            alt="PaperMark AI Logo"
            width={42}
            height={42}
            priority
          />

        </div>


        <div>

          <div
            className={styles.brandName}
          >
            PaperMark AI
          </div>

          <div
            className={styles.brandSub}
          >
            Instructor workspace
          </div>

        </div>

      </Link>


      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <div
        className={styles.navSection}
      >
        Workspace
      </div>


      {items.map(
        ({
          href,
          label,
          icon: Icon,
        }) => {

          const active =
            pathname === href ||
            (
              href !== "/dashboard" &&
              pathname.startsWith(href)
            );


          return (

            <Link
              key={href}
              href={href}
              className={`
                ${styles.navItem}
                ${
                  active
                    ? styles.active
                    : ""
                }
              `}
            >

              <Icon size={17} />

              <span>
                {label}
              </span>

            </Link>

          );

        }
      )}


      {/* ================================================= */}
      {/* BOTTOM */}
      {/* ================================================= */}

      <div
        className={styles.sidebarBottom}
      >

        {/* USER */}

        <div
          className={styles.userMini}
        >

          <div
            className={styles.avatar}
          >
            NI
          </div>


          <div>

            <strong
              style={{
                fontSize: 12,
              }}
            >
              Nafees Ikram
            </strong>

            <div
              style={{
                fontSize: 10,
                color: "#7a847e",
              }}
            >
              Instructor
            </div>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >

          <LogOut size={16} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}