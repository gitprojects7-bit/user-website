
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./style.css";

type PageName =
  | "Dashboard"
  | "My Tasks"
  | "Team Board"
  | "Create Task"
  | "Team Chat"
  | "Direct Messages"
  | "Time Logs"
  | "Team Members"
  | "Notifications"
  | "Profile"
  | "Settings";

type Account = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type Task = {
  title: string;
  project: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: "In progress" | "To do" | "Review";
};

const menuItems: { label: PageName; icon: string }[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "My Tasks", icon: "✓" },
  { label: "Team Board", icon: "▤" },
  { label: "Create Task", icon: "+" },
  { label: "Team Chat", icon: "▱" },
  { label: "Direct Messages", icon: "✉" },
  { label: "Time Logs", icon: "◷" },
  { label: "Team Members", icon: "♧" },
  { label: "Notifications", icon: "♢" },
  { label: "Profile", icon: "◎" },
];

const initialTasks: Task[] = [
  {
    title: "Update customer onboarding flow",
    project: "Client Portal",
    due: "Today",
    priority: "High",
    status: "In progress",
  },
  {
    title: "Prepare sprint review notes",
    project: "Team Workspace",
    due: "Tomorrow",
    priority: "Medium",
    status: "To do",
  },
  {
    title: "Review notification settings",
    project: "Work Flow App",
    due: "26 Oct",
    priority: "Low",
    status: "Review",
  },
  {
    title: "Complete API documentation",
    project: "Platform Upgrade",
    due: "27 Oct",
    priority: "High",
    status: "To do",
  },
];

const activities = [
  { title: "Maya created a new task", time: "4 min ago", icon: "＋" },
  { title: "Arun shared sprint notes", time: "16 min ago", icon: "↗" },
  { title: "Design team updated a board", time: "38 min ago", icon: "▤" },
  { title: "New message from Priya", time: "1 hr ago", icon: "✉" },
];

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [activePage, setActivePage] = useState<PageName>("Dashboard");
  const [pageHistory, setPageHistory] = useState<PageName[]>([]);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [elapsed, setElapsed] = useState(42 * 60 + 18);
  const [timerRunning, setTimerRunning] = useState(true);
  const [notice, setNotice] = useState("");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const savedAccount = (): Account | null => {
    try {
      const value = localStorage.getItem("workflowAccount");
      return value ? (JSON.parse(value) as Account) : null;
    } catch {
      return null;
    }
  };

  const account = savedAccount();
  const userName = account?.name || "A. Director";
  const userEmail = account?.email || "abc@gmail.com";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!timerRunning || !isLoggedIn) return;

    const timer = window.setInterval(() => {
      setElapsed((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerRunning, isLoggedIn]);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const handleAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignup) {
      const newAccount: Account = { name, email, phone, password };

      try {
        localStorage.setItem("workflowAccount", JSON.stringify(newAccount));
      } catch {
        setNotice("Could not save the account in this browser.");
        return;
      }

      setIsSignup(false);
      setPassword("");
      setNotice("Account created. Sign in with your new credentials.");
      return;
    }

    const existingAccount = savedAccount();

    const validDemo =
      email.trim().toLowerCase() === "abc@gmail.com" &&
      password === "123456";

    const validNewAccount =
      existingAccount &&
      existingAccount.email.toLowerCase() === email.trim().toLowerCase() &&
      existingAccount.password === password;

    if (validDemo || validNewAccount) {
      setIsLoggedIn(true);
      setActivePage("Dashboard");
      setPageHistory([]);
      setSearch("");
      setProfileOpen(false);
      setNotice("");
    } else {
      setNotice("Invalid credentials. Use the demo account or create an account.");
    }
  };

  const navigateTo = (page: PageName) => {
    if (page === activePage) {
      setProfileOpen(false);
      return;
    }

    setPageHistory((history) => [...history, activePage]);
    setActivePage(page);
    setProfileOpen(false);
    setSearch("");
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const previous = pageHistory[pageHistory.length - 1];
      setPageHistory((history) => history.slice(0, -1));
      setActivePage(previous);
      setProfileOpen(false);
    } else if (activePage !== "Dashboard") {
      setActivePage("Dashboard");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsSignup(false);
    setEmail("");
    setPassword("");
    setActivePage("Dashboard");
    setPageHistory([]);
    setProfileOpen(false);
    setNotice("");
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.project} ${task.due} ${task.priority} ${task.status}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const filteredMenu = menuItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  const markTimerSaved = () => {
    setTimerRunning(false);
    setNotice("Time entry saved successfully.");
  };

  if (!isLoggedIn) {
    return (
      <main className="auth-page">
        <section className="brand-panel">
          <div className="brand">
            <span className="brand-logo">W</span>
            <div>
              <strong>WORK FLOW</strong>
              <small>INVOICE + TEAM</small>
            </div>
          </div>

          <div className="brand-message">
            <span className="brand-eyebrow">TEAM PORTAL</span>
            <h1>
              Welcome to
              <br />
              Work Flow.
            </h1>
            <p>Your work, your team, and your business — all in one place.</p>
          </div>

          <small className="brand-footer">A better way to work together.</small>
        </section>

        <section className="form-panel">
          <div className="form-content" key={isSignup ? "signup" : "login"}>
            <span className="eyebrow">
              {isSignup ? "GET STARTED" : "WELCOME BACK"}
            </span>

            <h2>
              {isSignup ? "Create your account" : "Sign in to your account"}
            </h2>

            <p className="subtitle">
              {isSignup
                ? "Join Work Flow and bring your team together."
                : "Enter your details to access your team workspace."}
            </p>

            <div className="auth-tabs">
              <button
                type="button"
                className={isSignup ? "active" : ""}
                onClick={() => {
                  setIsSignup(true);
                  setNotice("");
                  setShowPassword(false);
                }}
              >
                Sign up
              </button>
              <button
                type="button"
                className={!isSignup ? "active" : ""}
                onClick={() => {
                  setIsSignup(false);
                  setNotice("");
                  setShowPassword(false);
                }}
              >
                Sign in
              </button>
            </div>

            <form onSubmit={handleAuth}>
              {isSignup && (
                <>
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </>
              )}

              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="abc@gmail.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              {isSignup && (
                <>
                  <label htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </>
              )}

              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button className="submit-button" type="submit">
                <span>{isSignup ? "Create account" : "Sign in"}</span>
                <span className="button-arrow">→</span>
              </button>
            </form>

            {!isSignup && (
              <div className="demo-box">
                <div>
                  <strong>DEMO CREDENTIALS</strong>
                  <p>abc@gmail.com&nbsp; / &nbsp;123456</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("abc@gmail.com");
                    setPassword("123456");
                    setNotice("");
                  }}
                >
                  Use demo account
                </button>
              </div>
            )}

            {notice && (
              <p className="auth-notice" role="status">
                {notice}
              </p>
            )}

            <p className="switch-form">
              {isSignup ? "Already have an account?" : "New to Work Flow?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup((value) => !value);
                  setNotice("");
                  setShowPassword(false);
                }}
              >
                {isSignup ? "Sign in →" : "Create new account →"}
              </button>
            </p>

            <footer>© 2026 Work Flow. All rights reserved.</footer>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">W</span>
          <div>
            <strong>WORK FLOW</strong>
            <small>INVOICE + TEAM</small>
          </div>
        </div>

        <p className="sidebar-caption">TEAM WORKSPACE</p>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${
                activePage === item.label ? "selected" : ""
              }`}
              onClick={() => navigateTo(item.label)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activePage === item.label && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{initials || "AD"}</div>
          <div className="sidebar-user-info">
            <strong>{userName}</strong>
            <small>Workspace member</small>
          </div>
          <button
            type="button"
            className="sidebar-logout"
            title="Log out"
            onClick={logout}
          >
            ↪
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <button
              type="button"
              className="back-button"
              onClick={goBack}
              title="Go back"
              aria-label="Go back"
            >
              ←
            </button>
            <div>
              <h1>
                {activePage === "Dashboard"
                  ? "My workspace dashboard"
                  : activePage}
              </h1>
              <p>
                {activePage === "Dashboard"
                  ? "Your work queue, active timer, team updates, and upcoming deadlines."
                  : `Manage your workspace — ${activePage.toLowerCase()}.`}
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search anything..."
                aria-label="Search workspace"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>

            <div className="profile-wrapper">
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
              >
                <span className="avatar top-avatar">{initials || "AD"}</span>
                <span className="profile-text">
                  <strong>{userName}</strong>
                  <small>Workspace owner</small>
                </span>
                <span className="profile-chevron">
                  {profileOpen ? "⌃" : "⌄"}
                </span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-user">
                    <div className="avatar">{initials || "AD"}</div>
                    <div>
                      <strong>{userName}</strong>
                      <small>{userEmail}</small>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    type="button"
                    onClick={() => navigateTo("Profile")}
                  >
                    <span>◎</span> My profile
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo("Settings")}
                  >
                    <span>⚙</span> Settings
                  </button>
                  <button type="button" className="logout-option" onClick={logout}>
                    <span>↪</span> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content" key={activePage}>
          {activePage === "Dashboard" ? (
            <>
              <div className="section-heading">
                <div>
                  <h2>My workspace dashboard</h2>
                  <p>
                    Personal work queue, active timer, team updates, and upcoming
                    deadlines.
                  </p>
                </div>
                <span className="today-label">WORKSPACE OVERVIEW</span>
              </div>

              <section className="stats-grid">
                <article className="stat-card">
                  <div className="stat-top">
                    <span>MY OPEN TASKS</span>
                    <span className="stat-icon teal">▦</span>
                  </div>
                  <strong>7</strong>
                  <small className="stat-foot teal-text">3 due this week</small>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span>TIME THIS WEEK</span>
                    <span className="stat-icon aqua">◷</span>
                  </div>
                  <strong>21h 40m</strong>
                  <small className="stat-foot aqua-text">Across 9 tasks</small>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span>COMPLETED</span>
                    <span className="stat-icon green">✓</span>
                  </div>
                  <strong>19</strong>
                  <small className="stat-foot green-text">This month</small>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span>TEAM MESSAGES</span>
                    <span className="stat-icon purple">✉</span>
                  </div>
                  <strong>4</strong>
                  <small className="stat-foot purple-text">2 unread</small>
                </article>
              </section>

              <section className="dashboard-middle">
                <div className="left-stack">
                  <article className="panel current-task-panel">
                    <div className="panel-heading">
                      <div>
                        <span className="panel-eyebrow">CURRENT TASK</span>
                        <h3>Update customer onboarding flow</h3>
                        <p>
                          Project: Client Portal <span>·</span> Assigned to:{" "}
                          {userName} <span>·</span> Due today
                        </p>
                      </div>
                      <span className="status-pill in-progress">IN PROGRESS</span>
                    </div>

                    <div className="task-progress">
                      <div className="progress-label">
                        <span>Task progress</span>
                        <strong>65%</strong>
                      </div>
                      <div className="progress-track">
                        <span />
                      </div>
                    </div>

                    <div className="timer-row">
                      <div>
                        <span className="panel-eyebrow">ACTIVE TIMER</span>
                        <strong className="timer-value">
                          {formatTime(elapsed)}
                        </strong>
                      </div>
                      <button
                        type="button"
                        className="timer-button"
                        onClick={() => {
                          if (timerRunning) {
                            markTimerSaved();
                          } else {
                            setTimerRunning(true);
                            setNotice("Timer resumed.");
                          }
                        }}
                      >
                        {timerRunning ? "Ⅱ Stop & save" : "▶ Resume timer"}
                      </button>
                    </div>
                  </article>

                  <article className="panel focus-panel">
                    <div className="focus-icon">✦</div>
                    <div>
                      <h3>Keep your momentum</h3>
                      <p>
                        You have {tasks.filter((task) => task.status !== "Review").length}{" "}
                        tasks waiting for your attention.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-action"
                      onClick={() => navigateTo("My Tasks")}
                    >
                      View tasks →
                    </button>
                  </article>
                </div>

                <article className="panel activity-panel">
                  <div className="panel-title-row">
                    <div>
                      <h3>TEAM ACTIVITY</h3>
                      <p>Latest updates from your workspace</p>
                    </div>
                    <span className="activity-count">{activities.length}</span>
                  </div>

                  <div className="activity-list">
                    {activities.map((activity) => (
                      <div className="activity-item" key={activity.title}>
                        <span className="activity-icon">{activity.icon}</span>
                        <div>
                          <strong>{activity.title}</strong>
                          <small>{activity.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="activity-link"
                    onClick={() => navigateTo("Team Board")}
                  >
                    View team activity →
                  </button>
                </article>
              </section>

              <section className="tasks-section">
                <div className="tasks-heading">
                  <div>
                    <h2>Upcoming tasks</h2>
                    <p>Keep track of the work coming up next.</p>
                  </div>
                  <span>{filteredTasks.length} tasks</span>
                </div>

                <div className="task-table-wrap">
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>TASK</th>
                        <th>PROJECT</th>
                        <th>DUE DATE</th>
                        <th>PRIORITY</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <tr key={task.title}>
                          <td className="task-name">{task.title}</td>
                          <td>{task.project}</td>
                          <td>{task.due}</td>
                          <td>
                            <span
                              className={`priority-pill ${task.priority.toLowerCase()}`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-pill ${task.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredTasks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="empty-state">
                            No tasks match “{search}”.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <footer className="workspace-footer">
                <span>WORK FLOW WORKSPACE · Illustrative sample data</span>
                <span>PERSONAL DASHBOARD</span>
              </footer>
            </>
          ) : (
            <section className="coming-soon-page">
              <div className="coming-icon">
                {menuItems.find((item) => item.label === activePage)?.icon ||
                  (activePage === "Settings" ? "⚙" : "✦")}
              </div>
              <span className="panel-eyebrow">WORK FLOW WORKSPACE</span>
              <h2>{activePage}</h2>
              <p>
                {activePage === "Profile"
                  ? "Your workspace profile and account information will appear here."
                  : activePage === "Settings"
                    ? "Manage your workspace preferences and account settings here."
                    : `Your ${activePage.toLowerCase()} workspace is being prepared.`}
              </p>
              <span className="coming-badge">COMING SOON</span>
              <button
                type="button"
                className="timer-button"
                onClick={goBack}
              >
                ← Back to previous page
              </button>
            </section>
          )}
        </div>
      </section>

      {notice && (
        <div className="toast-message" role="status">
          <span>✓</span> {notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {search && activePage !== "Dashboard" && (
        <div className="search-results">
          <strong>Matching pages</strong>
          {filteredMenu.length ? (
            filteredMenu.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => navigateTo(item.label)}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))
          ) : (
            <small>No matching pages found.</small>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
