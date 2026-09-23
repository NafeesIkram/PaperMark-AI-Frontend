"use client";

import {
  useState,
} from "react";

import {
  Bell,
  KeyRound,
  Lock,
  Save,
  Settings2,
  User,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import styles from "./settings.module.css";

type Section =
  | "Profile"
  | "AI API"
  | "Preferences"
  | "Security";

export default function SettingsPage() {
  const [section, setSection] =
    useState<Section>("Profile");

  const [name, setName] =
    useState("Instructor");

  const [email, setEmail] =
    useState(
      "instructor@example.com"
    );

  const [apiKey, setApiKey] =
    useState("");

  const [saved, setSaved] =
    useState(false);

  const [notifications, setNotifications] =
    useState(true);

  const [reviewBeforePublish, setReviewBeforePublish] =
    useState(true);

  function handleSaveProfile() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function handleSaveApi() {
    /*
     * IMPORTANT:
     * This is only UI for now.
     *
     * Do NOT store a real API key in
     * localStorage or browser storage.
     *
     * Later it will be sent securely
     * to the FastAPI backend.
     */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <AppShell title="Settings">
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
            Settings
          </h1>

          <p
            className={
              styles.description
            }
          >
            Manage your instructor
            workspace and evaluation
            preferences.
          </p>
        </div>

        {/* LAYOUT */}

        <div className={styles.layout}>
          {/* NAV */}

          <div className={styles.navCard}>
            <button
              type="button"
              className={`${styles.navItem} ${
                section === "Profile"
                  ? styles.navItemActive
                  : ""
              }`}
              onClick={() =>
                setSection("Profile")
              }
            >
              <User size={14} />
              Profile
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                section === "AI API"
                  ? styles.navItemActive
                  : ""
              }`}
              onClick={() =>
                setSection("AI API")
              }
            >
              <KeyRound size={14} />
              AI API
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                section ===
                "Preferences"
                  ? styles.navItemActive
                  : ""
              }`}
              onClick={() =>
                setSection(
                  "Preferences"
                )
              }
            >
              <Settings2 size={14} />
              Preferences
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                section === "Security"
                  ? styles.navItemActive
                  : ""
              }`}
              onClick={() =>
                setSection("Security")
              }
            >
              <Lock size={14} />
              Security
            </button>
          </div>

          {/* CONTENT */}

          <div className={styles.content}>
            {/* PROFILE */}

            {section ===
              "Profile" && (
              <section
                className={
                  styles.card
                }
              >
                <div
                  className={
                    styles.cardHeader
                  }
                >
                  <h2
                    className={
                      styles.cardTitle
                    }
                  >
                    Profile
                  </h2>

                  <p
                    className={
                      styles.cardDescription
                    }
                  >
                    Update your instructor
                    account information.
                  </p>
                </div>

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label
                    className={
                      styles.label
                    }
                    htmlFor="name"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    className={
                      styles.input
                    }
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target
                          .value
                      )
                    }
                  />
                </div>

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label
                    className={
                      styles.label
                    }
                    htmlFor="email"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    className={
                      styles.input
                    }
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target
                          .value
                      )
                    }
                  />
                </div>

                {saved && (
                  <div
                    className={
                      styles.success
                    }
                    style={{
                      marginBottom: 13,
                    }}
                  >
                    Profile changes
                    saved successfully.
                  </div>
                )}

                <button
                  type="button"
                  className={
                    styles.saveButton
                  }
                  onClick={
                    handleSaveProfile
                  }
                >
                  <Save size={13} />
                  Save Changes
                </button>
              </section>
            )}

            {/* AI API */}

            {section ===
              "AI API" && (
              <section
                className={
                  styles.card
                }
              >
                <div
                  className={
                    styles.cardHeader
                  }
                >
                  <h2
                    className={
                      styles.cardTitle
                    }
                  >
                    Custom AI API
                  </h2>

                  <p
                    className={
                      styles.cardDescription
                    }
                  >
                    Connect your own AI
                    provider API for
                    evaluation.
                  </p>
                </div>

                <div
                  className={
                    styles.warning
                  }
                  style={{
                    marginBottom: 16,
                  }}
                >
                  API keys will be handled
                  securely by the backend.
                  Do not store production
                  API keys in browser
                  localStorage.
                </div>

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label
                    className={
                      styles.label
                    }
                    htmlFor="provider"
                  >
                    AI Provider
                  </label>

                  <select
                    id="provider"
                    className={
                      styles.input
                    }
                    defaultValue="OpenAI"
                  >
                    <option>
                      OpenAI
                    </option>

                    <option>
                      Anthropic
                    </option>

                    <option>
                      Google
                    </option>

                    <option>
                      Custom Provider
                    </option>
                  </select>
                </div>

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label
                    className={
                      styles.label
                    }
                    htmlFor="api-key"
                  >
                    API Key
                  </label>

                  <div
                    className={
                      styles.apiRow
                    }
                  >
                    <input
                      id="api-key"
                      type="password"
                      className={`${styles.input} ${styles.apiInput}`}
                      value={apiKey}
                      onChange={(event) =>
                        setApiKey(
                          event.target
                            .value
                        )
                      }
                      placeholder="Paste your API key"
                    />

                    <button
                      type="button"
                      className={
                        styles.saveButton
                      }
                      onClick={
                        handleSaveApi
                      }
                    >
                      <Save size={13} />
                      Save
                    </button>
                  </div>

                  <div
                    className={
                      styles.helpText
                    }
                  >
                    This field is currently
                    demo-only. Secure backend
                    storage will be connected
                    later.
                  </div>
                </div>

                {saved && (
                  <div
                    className={
                      styles.success
                    }
                  >
                    API settings saved in
                    demo mode.
                  </div>
                )}
              </section>
            )}

            {/* PREFERENCES */}

            {section ===
              "Preferences" && (
              <section
                className={
                  styles.card
                }
              >
                <div
                  className={
                    styles.cardHeader
                  }
                >
                  <h2
                    className={
                      styles.cardTitle
                    }
                  >
                    Preferences
                  </h2>

                  <p
                    className={
                      styles.cardDescription
                    }
                  >
                    Configure how PaperMark
                    AI behaves during
                    evaluation.
                  </p>
                </div>

                <div
                  className={
                    styles.settingRow
                  }
                >
                  <div
                    className={
                      styles.settingInfo
                    }
                  >
                    <div
                      className={
                        styles.settingTitle
                      }
                    >
                      Evaluation Notifications
                    </div>

                    <div
                      className={
                        styles.settingDescription
                      }
                    >
                      Receive notifications
                      when evaluations are
                      completed.
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`${styles.toggle} ${
                      notifications
                        ? styles.toggleActive
                        : ""
                    }`}
                    onClick={() =>
                      setNotifications(
                        (value) =>
                          !value
                      )
                    }
                    aria-label="Toggle notifications"
                  >
                    <div
                      className={
                        styles.toggleKnob
                      }
                    />
                  </button>
                </div>

                <div
                  className={
                    styles.settingRow
                  }
                >
                  <div
                    className={
                      styles.settingInfo
                    }
                  >
                    <div
                      className={
                        styles.settingTitle
                      }
                    >
                      Review Before Publishing
                    </div>

                    <div
                      className={
                        styles.settingDescription
                      }
                    >
                      Require instructor
                      review before final
                      results are published.
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`${styles.toggle} ${
                      reviewBeforePublish
                        ? styles.toggleActive
                        : ""
                    }`}
                    onClick={() =>
                      setReviewBeforePublish(
                        (value) =>
                          !value
                      )
                    }
                    aria-label="Toggle review before publishing"
                  >
                    <div
                      className={
                        styles.toggleKnob
                      }
                    />
                  </button>
                </div>

                <div
                  className={
                    styles.settingRow
                  }
                >
                  <div
                    className={
                      styles.settingInfo
                    }
                  >
                    <div
                      className={
                        styles.settingTitle
                      }
                    >
                      AI Evidence
                    </div>

                    <div
                      className={
                        styles.settingDescription
                      }
                    >
                      Show conceptual evidence
                      and reasons behind
                      suggested marks.
                    </div>
                  </div>

                  <div
                    className={`${styles.toggle} ${styles.toggleActive}`}
                  >
                    <div
                      className={
                        styles.toggleKnob
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SECURITY */}

            {section ===
              "Security" && (
              <section
                className={
                  styles.card
                }
              >
                <div
                  className={
                    styles.cardHeader
                  }
                >
                  <h2
                    className={
                      styles.cardTitle
                    }
                  >
                    Security
                  </h2>

                  <p
                    className={
                      styles.cardDescription
                    }
                  >
                    Manage account security
                    settings.
                  </p>
                </div>

                <div
                  className={
                    styles.settingRow
                  }
                >
                  <div
                    className={
                      styles.settingInfo
                    }
                  >
                    <div
                      className={
                        styles.settingTitle
                      }
                    >
                      Password
                    </div>

                    <div
                      className={
                        styles.settingDescription
                      }
                    >
                      Change your account
                      password.
                    </div>
                  </div>

                  <button
                    type="button"
                    className={
                      styles.secondaryButton
                    }
                    onClick={() =>
                      alert(
                        "Password change will be connected next."
                      )
                    }
                  >
                    Change
                  </button>
                </div>

                <div
                  className={
                    styles.settingRow
                  }
                >
                  <div
                    className={
                      styles.settingInfo
                    }
                  >
                    <div
                      className={
                        styles.settingTitle
                      }
                    >
                      Session Security
                    </div>

                    <div
                      className={
                        styles.settingDescription
                      }
                    >
                      Authentication is handled
                      through the backend
                      session cookie.
                    </div>
                  </div>

                  <span
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap: 5,
                      color:
                        "#317448",
                      fontSize: 9,
                      fontWeight:
                        800,
                    }}
                  >
                    <Lock size={11} />
                    Secure
                  </span>
                </div>

                <div
                  className={
                    styles.settingRow
                  }
                >
                  <div
                    className={
                      styles.settingInfo
                    }
                  >
                    <div
                      className={
                        styles.settingTitle
                      }
                    >
                      Notifications
                    </div>

                    <div
                      className={
                        styles.settingDescription
                      }
                    >
                      Configure security and
                      evaluation notifications.
                    </div>
                  </div>

                  <Bell size={15} />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}