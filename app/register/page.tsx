"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import { register } from "@/lib/api";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // NAME
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    // EMAIL
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    // PASSWORD
    if (!password) {
      setError("Please enter a password.");
      return;
    }

    // Backend requires minimum 8 characters
    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    // CONFIRM PASSWORD
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        name.trim(),
        email.trim(),
        password
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );

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
              width={54}
              height={54}
              priority
            />
          </div>

          <div>
            <h1>PaperMark AI</h1>
            <p>Instructor workspace</p>
          </div>
        </div>

        {/* HEADING */}
        <div className={styles.heading}>
          <h2>Create your account</h2>

          <p>
            Set up your instructor workspace to start
            creating evaluations.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className={styles.success}>
            {success}
          </div>
        )}

        {/* FORM */}
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div className={styles.formGroup}>
            <label>Full Name</label>

            <div className={styles.inputWrap}>
              <User size={16} />

              <input
                type="text"
                placeholder="Instructor name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                autoComplete="name"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className={styles.formGroup}>
            <label>Email</label>

            <div className={styles.inputWrap}>
              <Mail size={16} />

              <input
                type="email"
                placeholder="instructor@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className={styles.formGroup}>
            <label>Password</label>

            <div className={styles.inputWrap}>
              <LockKeyhole size={16} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password (8+ characters)"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formGroup}>
            <label>Confirm Password</label>

            <div className={styles.inputWrap}>
              <LockKeyhole size={16} />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className={styles.submit}
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}

            {!loading && (
              <ArrowRight size={16} />
            )}
          </button>
        </form>

        {/* LOGIN */}
        <div className={styles.footer}>
          <span>
            Already have an account?
          </span>

          <Link href="/">
            Sign in
          </Link>
        </div>
      </div>

      <div className={styles.bottom}>
        PaperMark AI • AI-assisted assignment evaluation
      </div>
    </main>
  );
}