"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
} from "lucide-react";

import { login } from "@/lib/api";

import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      await login(
        cleanEmail,
        password
      );

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* BRAND */}

        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image
              src="/papermark-logo.png"
              alt="PaperMark AI"
              width={48}
              height={48}
              priority
            />
          </div>

          <div>
            <h1
              className={
                styles.brandName
              }
            >
              PaperMark AI
            </h1>

            <p
              className={
                styles.brandSub
              }
            >
              Instructor workspace
            </p>
          </div>
        </div>

        {/* HEADING */}

        <div className={styles.heading}>
          <h2>
            Welcome back
          </h2>

          <p>
            Sign in to continue to your
            instructor workspace.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className={styles.error}
            role="alert"
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          {/* EMAIL */}

          <div
            className={
              styles.formGroup
            }
          >
            <label
              className={styles.label}
              htmlFor="email"
            >
              Email
            </label>

            <div
              className={
                styles.inputWrap
              }
            >
              <Mail
                size={15}
                aria-hidden="true"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="instructor@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div
            className={
              styles.formGroup
            }
          >
            <label
              className={styles.label}
              htmlFor="password"
            >
              Password
            </label>

            <div
              className={
                styles.inputWrap
              }
            >
              <LockKeyhole
                size={15}
                aria-hidden="true"
              />

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className={
                  styles.passwordToggle
                }
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={15}
                  />
                ) : (
                  <Eye
                    size={15}
                  />
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className={
              styles.submit
            }
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <ArrowRight
                  size={14}
                />
              </>
            )}
          </button>
        </form>

        {/* REGISTER */}

        <div
          className={styles.footer}
        >
          <span>
            Don't have an account?
          </span>

          <Link href="/register">
            Create account
          </Link>
        </div>

        {/* BOTTOM */}

        <div
          className={styles.bottom}
        >
          PaperMark AI • AI-assisted
          assignment evaluation
        </div>
      </div>
    </main>
  );
}