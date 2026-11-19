// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  AtSign,
  Bell,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Eye,
  EyeOff,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  MessagesSquare,
  Mic,
  Paperclip,
  Pencil,
  Phone,
  Play,
  Plus,
  Search,
  Send,
  Square,
  User,
  UserPlus,
  UsersRound,
  Video,
  X,
  Zap,
} from "lucide-react";
import "./style.css";

// ============================================================
// Constants and demo data
// ============================================================

const WS = {
  tt: "Team & task management",
  tm: "Task management",
};

// ============================================================
// Icons (lucide-react)
// ============================================================

const LIB = {
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  ListTodo,
  MessagesSquare,
  MessageCircle,
  Bell,
  Search,
  Plus,
  ArrowLeft,
  Check,
  Clock,
  Zap,
  Phone,
  Video,
  Mic,
  Paperclip,
  X,
  User,
  ClipboardCheck,
  Eye,
  UserPlus,
  Send,
  Play,
  Square,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  AtSign,
  Camera,
  Lock,
  LogOut,
  Mail,
  Pencil,
};

function Icon({ n, s = 20 }) {
  const C = LIB[n];
  return C ? <C size={s} strokeWidth={1.8} /> : null;
}

const WSD = {
  tt: "Manage your teams, assign tasks, complete reviewed tasks and report to the Super Admin.",
  tm: "View assigned projects and tasks, track time and submit work for review.",
};

const WSI = { tt: "UsersRound", tm: "User" };

const ST = ["To Do", "In Progress", "Stopped", "Reassigned", "Review", "Completed"];

// "To Do" and "Reassigned" tasks have not been worked on yet
const FRESH = ["To Do", "Reassigned"];

const now = () => new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });

const ini = (n) => n.split(" ").map((x) => x[0]).join("").slice(0, 2);

const slug = (n) => "#" + n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const fmt = (s) => {
  s = Math.floor(s);
  const h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// Accounts created through Sign Up are stored in localStorage (demo only)
const readAccs = () => {
  try {
    return JSON.parse(localStorage.getItem("wf_acc") || "[]");
  } catch (x) {
    return [];
  }
};

// Demo login details (also shown on the profile page)
const DEMO = {
  name: "ABC",
  email: "abc@gmail.com",
  phone: "+91 98765 43210",
  user: "abc",
  pw: "123456",
  ws: ["tt", "tm"],
};

// Task helper. "o" = optional demo state: { status, secs, done (checklist items ticked), log: [[time, text]] }
const T = (id, title, desc, project, assignee, by, priority, due, items, o = {}) =>
  (
    {
      id,
      title,
      project,
      assignee,
      by,
      priority,
      due,
      status: o.status || "To Do",
      desc,
      secs: o.secs || 0,
      log: [
        { t: "12/11/26, 09:00", txt: "Task assigned by " + by },
        ...(o.log || []).map(([t, txt]) => ({ t, txt })),
      ],
      reports: [],
      checklist: items.map((t, i) => ({ t, done: i < (o.done || 0) })),
    }
  );

// Projects are created by the Super Admin (separate web page).
// "members" does NOT include the project lead (see the "lead" field).
const seed = {
  user: null,
  ws: null,
  // demo: TASK-1101 (Task management) is running
  timer: { id: "TASK-1101", start: Date.now() },
  projects: [
    // ---- Projects of Team & task management ----
    {
      id: "P-1",
      name: "Billing Platform",
      desc: "Multi-currency billing with tax automation.",
      lead: "ABC",
      team: "Alpha Engineering",
      members: ["Rahul Varma", "Sneha Rao", "Alex Morgan"],
      due: "2026-12-20",
    },
    {
      id: "P-2",
      name: "Mobile App",
      desc: "iOS and Android approvals app.",
      lead: "ABC",
      team: "Beta Mobile Squad",
      members: ["Priya Sharma", "Karan Mehta", "Divya Iyer"],
      due: "2026-12-05",
    },
    {
      id: "P-5",
      name: "Customer Portal",
      desc: "Self-service portal for invoices and support.",
      lead: "ABC",
      team: "Gamma Web Team",
      members: ["Chloe Bennett", "Alex Morgan"],
      due: "2026-11-15",
    },
    // ---- Projects of Task management ----
    {
      id: "P-3",
      name: "HR Management",
      desc: "Leave, timesheets and payroll audit.",
      lead: "Maya Chen",
      team: "Core HR & Ops",
      members: ["ABC", "Chloe Bennett", "Divya Iyer"],
      due: "2027-01-10",
    },
    {
      id: "P-4",
      name: "Analytics Dashboard",
      desc: "Executive metrics and forecasts.",
      lead: "Arun Patel",
      team: "Analytics & Design",
      members: ["ABC", "Karan Mehta", "Alex Morgan"],
      due: "2027-01-25",
    },
    {
      id: "P-6",
      name: "Support Desk",
      desc: "Ticketing, SLA tracking and customer feedback.",
      lead: "Neha Gupta",
      team: "Care & Support",
      members: ["ABC", "Chloe Bennett"],
      due: "2026-11-10",
    },
  ],
  tasks: [
    // ============ Team & task management tasks (assigned by ABC) ============
    T(
      "TASK-1001",
      "Implement invoice export endpoint",
      "Build the CSV/PDF invoice export endpoint and update the team.",
      "Billing Platform",
      "Rahul Varma",
      "ABC",
      "High",
      "2026-11-25",
      ["Design endpoint contract", "Implement CSV export", "Implement PDF export", "Write unit tests"],
      {
        status: "In Progress",
        secs: 4320,
        done: 2,
        log: [
          ["15/11/26, 10:00", "Timer started"],
          ["15/11/26, 11:12", "Timer stopped, 01:12:00 logged"],
          ["15/11/26, 11:13", "Work update: Endpoint contract finalised and CSV export implemented."],
          ["16/11/26, 09:40", "Timer resumed"],
        ],
      },
    ),
    T(
      "TASK-1002",
      "Configure multi-currency billing",
      "Add multi-currency support with cached exchange rates.",
      "Billing Platform",
      "Sneha Rao",
      "ABC",
      "High",
      "2026-11-20",
      ["Integrate exchange rate API", "Cache rates", "Add currency selector"],
      {
        status: "Review",
        secs: 7200,
        done: 3,
        log: [
          ["14/11/26, 10:00", "Timer started"],
          ["14/11/26, 12:00", "Timer stopped, 02:00:00 logged"],
          ["14/11/26, 12:01", "Work update: Currency rates service wired and cached."],
          ["17/11/26, 15:30", "Marked for review by Sneha Rao"],
        ],
      },
    ),
    T(
      "TASK-1003",
      "OAuth2 Google login",
      "Implement Google OAuth2 sign-in for the billing dashboard.",
      "Billing Platform",
      "Alex Morgan",
      "ABC",
      "High",
      "2026-11-10",
      ["Register OAuth client", "Implement callback", "Test on staging"],
      {
        status: "Completed",
        secs: 4500,
        done: 3,
        log: [
          ["12/11/26, 09:30", "Timer started"],
          ["12/11/26, 10:45", "Timer stopped, 01:15:00 logged"],
          ["12/11/26, 10:46", "Completed: Google OAuth2 login implemented and tested on staging."],
          ["13/11/26, 10:00", "Marked complete by ABC"],
        ],
      },
    ),
    T(
      "TASK-1004",
      "Build tax rule engine",
      "Create a configurable tax rule engine for regional tax slabs.",
      "Billing Platform",
      "Rahul Varma",
      "ABC",
      "Medium",
      "2026-11-30",
      ["Draft tax schema", "Implement rule evaluator", "Add admin config"],
      {
        status: "Stopped",
        secs: 1800,
        done: 1,
        log: [
          ["16/11/26, 14:00", "Timer started"],
          ["16/11/26, 14:30", "Timer stopped, 00:30:00 logged"],
          ["16/11/26, 14:31", "Work update: Tax slabs schema drafted, waiting on the rate table."],
        ],
      },
    ),
    T(
      "TASK-1005",
      "Push notification triggers",
      "Define and implement the push notification triggers for approvals.",
      "Mobile App",
      "Priya Sharma",
      "ABC",
      "Medium",
      "2026-11-28",
      ["List trigger events", "Configure FCM / APNs", "Test on TestFlight"],
    ),
    T(
      "TASK-1006",
      "Approval screen UI",
      "Design and build the approval request screen for the mobile app.",
      "Mobile App",
      "Karan Mehta",
      "ABC",
      "Medium",
      "2026-11-29",
      ["Create screen layout", "Add approve / reject actions"],
      {
        status: "Reassigned",
        log: [["16/11/26, 11:00", "Reassigned from Divya Iyer to Karan Mehta"]],
      },
    ),
    T(
      "TASK-1007",
      "Portal login page",
      "Build the customer portal login and password reset pages.",
      "Customer Portal",
      "Chloe Bennett",
      "ABC",
      "Low",
      "2026-10-28",
      ["Build login form", "Add password reset"],
      {
        status: "Completed",
        secs: 3600,
        done: 2,
        log: [
          ["25/10/26, 10:00", "Timer started"],
          ["25/10/26, 11:00", "Timer stopped, 01:00:00 logged"],
          ["25/10/26, 11:01", "Completed: Login and reset pages delivered."],
        ],
      },
    ),
    T(
      "TASK-1008",
      "Invoice history page",
      "Show the customer invoice history with download links.",
      "Customer Portal",
      "Alex Morgan",
      "ABC",
      "Medium",
      "2026-11-02",
      ["Build invoice table", "Add PDF download"],
      {
        status: "Completed",
        secs: 5400,
        done: 2,
        log: [
          ["30/10/26, 09:30", "Timer started"],
          ["30/10/26, 11:00", "Timer stopped, 01:30:00 logged"],
          ["30/10/26, 11:01", "Completed: Invoice history page released."],
        ],
      },
    ),

    // ============ Task management tasks (assigned to ABC) ============
    T(
      "TASK-1101",
      "Build onboarding checklist wizard",
      "Create the step-by-step onboarding checklist wizard for new joiners.",
      "HR Management",
      "ABC",
      "Maya Chen",
      "High",
      "2026-11-24",
      ["Create wizard layout", "Add step validation", "Connect checklist data"],
      {
        status: "In Progress",
        secs: 1260,
        done: 1,
        log: [
          ["17/11/26, 10:30", "Timer started"],
          ["17/11/26, 10:51", "Timer stopped, 00:21:00 logged"],
          ["17/11/26, 10:52", "Work update: Wizard layout created."],
          ["18/11/26, 09:10", "Timer resumed"],
        ],
      },
    ),
    T(
      "TASK-1102",
      "Leave balance report",
      "Generate the monthly leave balance report for all members.",
      "HR Management",
      "ABC",
      "Maya Chen",
      "Medium",
      "2026-11-26",
      ["Query leave data", "Build report table", "Add export"],
      {
        status: "Stopped",
        secs: 2100,
        done: 1,
        log: [
          ["16/11/26, 14:00", "Timer started"],
          ["16/11/26, 14:35", "Timer stopped, 00:35:00 logged"],
          ["16/11/26, 14:36", "Work update: Leave data query completed, report table pending."],
        ],
      },
    ),
    T(
      "TASK-1103",
      "Payroll audit export",
      "Export the payroll audit trail for the finance team.",
      "HR Management",
      "ABC",
      "Maya Chen",
      "High",
      "2026-11-20",
      ["Collect payroll records", "Format audit sheet", "Verify totals"],
      {
        status: "Review",
        secs: 3600,
        done: 3,
        log: [
          ["15/11/26, 10:00", "Timer started"],
          ["15/11/26, 11:00", "Timer stopped, 01:00:00 logged"],
          ["15/11/26, 11:01", "Work update: Payroll records collected and formatted."],
          ["17/11/26, 17:00", "Marked for review by ABC"],
        ],
      },
    ),
    T(
      "TASK-1104",
      "Create ARR cohort chart",
      "Add the ARR cohort retention chart to the executive dashboard.",
      "Analytics Dashboard",
      "ABC",
      "Arun Patel",
      "Medium",
      "2026-11-27",
      ["Prepare cohort data", "Build chart component", "Add tooltips and legend"],
    ),
    T(
      "TASK-1105",
      "Funnel conversion widget",
      "Build the funnel conversion widget for the analytics dashboard.",
      "Analytics Dashboard",
      "ABC",
      "Arun Patel",
      "Low",
      "2026-12-02",
      ["Define funnel steps", "Build widget"],
      {
        status: "Reassigned",
        log: [["17/11/26, 16:00", "Reassigned from Karan Mehta to ABC"]],
      },
    ),
    T(
      "TASK-1106",
      "Ticket SLA dashboard",
      "Create the SLA tracking dashboard for support tickets.",
      "Support Desk",
      "ABC",
      "Neha Gupta",
      "High",
      "2026-11-05",
      ["Collect SLA rules", "Build dashboard", "Add alerts"],
      {
        status: "Completed",
        secs: 4800,
        done: 3,
        log: [
          ["03/11/26, 10:00", "Timer started"],
          ["03/11/26, 11:20", "Timer stopped, 01:20:00 logged"],
          ["03/11/26, 11:21", "Completed: SLA dashboard delivered with breach alerts."],
        ],
      },
    ),
    T(
      "TASK-1107",
      "Customer feedback form",
      "Build the post-resolution customer feedback form.",
      "Support Desk",
      "Chloe Bennett",
      "Neha Gupta",
      "Low",
      "2026-11-04",
      ["Design form", "Connect to tickets"],
      {
        status: "Completed",
        secs: 2400,
        done: 2,
        log: [
          ["02/11/26, 10:00", "Timer started"],
          ["02/11/26, 10:40", "Timer stopped, 00:40:00 logged"],
          ["02/11/26, 10:41", "Completed: Feedback form is live."],
        ],
      },
    ),
  ],
  msgs: {
    "#alpha-engineering": [{ u: "Sneha Rao", x: "Currency cache is live on staging.", t: "09:40" }],
    "#beta-mobile-squad": [{ u: "Priya Sharma", x: "Test builds are on TestFlight.", t: "10:05" }],
    "#gamma-web-team": [{ u: "Chloe Bennett", x: "Portal is released to production.", t: "11:20" }],
    "#core-hr-ops": [{ u: "Maya Chen", x: "Please check the onboarding task today.", t: "09:15" }],
    "#analytics-design": [{ u: "Arun Patel", x: "Cohort data is ready for the chart.", t: "09:55" }],
    "#care-support": [{ u: "Neha Gupta", x: "Great work on the SLA dashboard.", t: "12:10" }],
    "Rahul Varma": [{ u: "Rahul Varma", x: "Export endpoint work is in progress.", t: "09:45" }],
    "Maya Chen": [{ u: "Maya Chen", x: "Hi, please send the payroll audit for review.", t: "09:10" }],
  },
  notifs: [
    {
      id: 1,
      ws: "tt",
      txt: "Sneha Rao marked TASK-1002 for review",
      cat: "Task Review",
      task: "TASK-1002",
      un: true,
      t: "10m ago",
    },
    {
      id: 2,
      ws: "tt",
      txt: "Project Billing Platform assigned to you by Super Admin",
      cat: "Project Updates",
      un: true,
      t: "1h ago",
    },
    {
      id: 3,
      ws: "tt",
      txt: "Project Mobile App assigned to you by Super Admin",
      cat: "Project Updates",
      un: false,
      t: "Yesterday",
    },
    {
      id: 4,
      ws: "tm",
      txt: "Task TASK-1104 assigned to you by Arun Patel",
      cat: "Task Assigned",
      task: "TASK-1104",
      un: true,
      t: "30m ago",
    },
    {
      id: 5,
      ws: "tm",
      txt: "Task TASK-1105 reassigned to you by Arun Patel",
      cat: "Task Assigned",
      task: "TASK-1105",
      un: true,
      t: "2h ago",
    },
  ],
};

function Modal({ title, onClose, children }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <div className="row sp">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="link" onClick={onClose}><Icon n="X" s={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LiveTime({ t, timer }) {
  const [, x] = useState(0);
  const on = !!timer && timer.id === t.id;
  useEffect(() => {
    if (!on) {
      return;
    }
    const i = setInterval(() => x((n) => n + 1), 1000);
    return () => clearInterval(i);
  }, [on]);
  return fmt(t.secs + (on ? (Date.now() - timer.start) / 1000 : 0));
}

const Pill = ({ v }) => <span className={"pill " + v.split(" ")[0]}>{v}</span>;

const Bar = ({ v }) => <div className="bar"><i style={{ width: v + "%" }} /></div>;

function Auth({ c }) {
  const [step, setStep] = useState("in"),
    [err, setErr] = useState(""),
    [sh, setSh] = useState(false);
  const [f, setF] = useState({
    id: "abc@gmail.com",
    pw: "123456",
    name: "",
    addr: "",
    phone: "",
    email: "",
    otp: "",
    user: "",
    pw1: "",
    ws: [],
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const accs = readAccs;
  const login = (u) => {
    const workspaces = (u.ws || []).filter((w) => w === "tt" || w === "tm");
    const account = { ...u, ws: workspaces.length ? workspaces : ["tt"] };
    c.up((d) => {
      d.user = account;
      d.ws = account.ws[0];
    });
  };
  const to = (n) => {
    setErr("");
    setStep(n);
  };
  const steps = ["details", "otp", "cred", "ws"],
    si = steps.indexOf(step);
  const dots = si >= 0 && (
      <div className="dots">
        {steps.map((x, i) => <i key={x} className={i <= si ? "on" : ""} />)}
      </div>
    );
  const msg = err && <div className="err">{err}</div>;

  const signin = (e) => {
    e.preventDefault();
    const id = f.id.trim().toLowerCase();
    if (id === "abc@gmail.com" && f.pw === "123456") {
      return login({ ...DEMO });
    }
    const a = accs().find((x) =>
      (x.email.toLowerCase() === id || x.user.toLowerCase() === id) && x.pw === f.pw);
    if (a) {
      return login(a);
    }
    setErr("Email or username, or password is incorrect. Demo: abc@gmail.com / 123456");
  };

  const confirmOtp = (e) => {
    e.preventDefault();
    if (f.otp !== "123456") {
      return setErr("Incorrect OTP. Use the demo code 123456.");
    }
    to("cred");
  };

  const signup = (e) => {
    e.preventDefault();
    if (f.user.trim().length < 3) {
      return setErr("Username must be at least 3 characters.");
    }
    if (f.pw1.length < 6) {
      return setErr("Password must be at least 6 characters.");
    }
    if (accs().some((x) => x.user === f.user.trim() || x.email === f.email)) {
      return setErr("That username or email is already registered.");
    }
    to("ws");
  };

  const finish = (e) => {
    e.preventDefault();
    if (!f.ws.length) {
      return setErr("Select at least one workspace to continue.");
    }
    const u = {
      name: f.name,
      addr: f.addr,
      phone: f.phone,
      email: f.email,
      user: f.user.trim(),
      pw: f.pw1,
      ws: ["tt", "tm"].filter((w) => f.ws.includes(w)),
    };
    try {
      localStorage.setItem("wf_acc", JSON.stringify([...accs(), u]));
    } catch (x) {}
    login(u);
  };

  // The spotlight and dotted grid in the background follow the cursor
  const onMove = (e) => {
    const el = e.currentTarget,
      r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  };

  return (
    <div className="auth" onMouseMove={onMove}>
      <div className="bg" aria-hidden="true">
        <i className="orb o1" />
        <i className="orb o2" />
        <i className="orb o3" />
        <i className="curve c1" />
        <i className="curve c2" />
        <i className="curve c3" />
        <i className="curve c4" />
        <i className="grid-dots" />
        <i className="glow" />
      </div>
      <div className="hero">
        <div className="logo" style={{ marginBottom: 10 }}>W.</div>
        <b style={{ letterSpacing: ".12em", fontSize: 12 }}>WORK FLOW PLATFORM</b>
        <h1>Welcome to<br />Work Flow.</h1>
        <p>Your work, your teams and your projects, unified in one place.</p>
      </div>
      <div className="box">
        <div className="form">
          {step === "in" && (
              <form key="in" className="sw" onSubmit={signin}>
                <h2>Welcome back</h2>
                <span className="mu">Already have an account? Sign in to continue.</span>
                <label>
                  Email or Username
                  <input
                    type="text"
                    value={f.id}
                    onChange={set("id")}
                    placeholder="Email or username"
                    required
                  />
                </label>
                <label>
                  Password
                  <span className="pw">
                    <input
                      type={sh ? "text" : "password"}
                      value={f.pw}
                      onChange={set("pw")}
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      className="eye"
                      aria-label={sh ? "Hide password" : "Show password"}
                      onClick={() => setSh(!sh)}
                    >
                      <Icon n={sh ? "EyeOff" : "Eye"} s={18} />
                    </button>
                  </span>
                </label>
                {msg}
                <button className="btn">Sign In</button>
                <div className="or">or</div>
                <button type="button" className="btn sec" onClick={() => to("details")}>
                  Create new account
                </button>
                <small className="mu" style={{ textAlign: "center" }}>
                  Demo account: abc@gmail.com / 123456
                </small>
              </form>
            )}
          {step === "details" && (
              <form
                key="d"
                className="sw"
                onSubmit={(e) => {
                  e.preventDefault();
                  to("otp");
                }}
              >
                {dots}
                <h2>Create your account</h2>
                <span className="mu">Tell us about yourself, then verify your email.</span>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={f.name}
                    onChange={set("name")}
                    placeholder="Enter your full name"
                    required
                  />
                </label>
                <label>
                  Address
                  <input
                    type="text"
                    value={f.addr}
                    onChange={set("addr")}
                    placeholder="Enter your address"
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    value={f.phone}
                    onChange={set("phone")}
                    placeholder="Enter your phone number"
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={f.email}
                    onChange={set("email")}
                    placeholder="name@example.com"
                    required
                  />
                </label>
                <button className="btn">Verify</button>
                <button type="button" className="link" onClick={() => to("in")}>
                  Back to sign in
                </button>
              </form>
            )}
          {step === "otp" && (
              <form key="o" className="sw" onSubmit={confirmOtp}>
                {dots}
                <h2>Verify your email</h2>
                <span className="mu">
                  Enter the 6-digit OTP sent to
                  {" "}
                  <b>{f.email}</b>
                  {" "}
                  (demo code: 123456).
                </span>
                <label>
                  OTP
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={f.otp}
                    onChange={(e) => setF({ ...f, otp: e.target.value.replace(/\D/g, "") })}
                    placeholder="6-digit code"
                    required
                  />
                </label>
                {msg}
                <button className="btn">Confirm OTP</button>
                <button type="button" className="link" onClick={() => to("details")}>
                  Edit details
                </button>
              </form>
            )}
          {step === "cred" && (
              <form key="c" className="sw" onSubmit={signup}>
                {dots}
                <h2>Set your login</h2>
                <span className="ok">Email verified</span>
                <label>
                  Username
                  <input
                    type="text"
                    value={f.user}
                    onChange={set("user")}
                    placeholder="Choose a username"
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={f.pw1}
                    onChange={set("pw1")}
                    placeholder="At least 6 characters"
                    required
                  />
                </label>
                {msg}
                <button className="btn">Sign Up</button>
              </form>
            )}
          {step === "ws" && (
              <form key="w" className="sw" onSubmit={finish}>
                {dots}
                <h2>Choose your workspace</h2>
                <span className="mu">
                  Select one or more. You can switch anytime from your profile.
                </span>
                {["tt", "tm"].map((w) => {
                  const on = f.ws.includes(w);

                  return (
                    <label key={w} className={"wso " + (on ? "on" : "")}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setF({ ...f, ws: on ? f.ws.filter((x) => x !== w) : [...f.ws, w] })}
                      />
                      <span className="wi"><Icon n={WSI[w]} s={20} /></span>
                      <span className="wt">
                        <b>{WS[w]}</b>
                        <small>{WSD[w]}</small>
                      </span>
                      <span className="wc">{on && <Icon n="Check" s={14} />}</span>
                    </label>
                  );
                })}
                {msg}
                <button className="btn">Login</button>
              </form>
            )}
        </div>
      </div>
    </div>
  );
}

function Chat({ c, kind, chans }) {
  const [a, setA] = useState(chans[0] || ""),
    [x, setX] = useState(""),
    [file, setFile] = useState(""),
    [rec, setRec] = useState(false),
    [call, setCall] = useState(null),
    [q, setQ] = useState("");
  const list = c.s.msgs[a] || [];

  const send = (e) => {
    e.preventDefault();
    if (!x.trim() && !file) {
      return;
    }
    c.up((d) => {
      (d.msgs[a] = d.msgs[a] || []).push({
        u: c.u.name,
        x: x + (file ? " · Attachment: " + file : ""),
        t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    });
    setX("");
    setFile("");
  };

  return (
    <div className="card chat">
      <div className="chl">
        <div className="search">
          <span><Icon n="Search" s={18} /></span>
          <input
            placeholder={kind === "dm" ? "Search user" : "Search team"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {chans.filter((n) => n.toLowerCase().includes(q.toLowerCase())).map((n) => (
          <button key={n} className={a === n ? "on" : ""} onClick={() => setA(n)}>
            {n}
            {kind === "dm" && <small className="mu"> · online</small>}
          </button>
        ))}
        {!chans.length && <span className="mu">Nothing here yet.</span>}
      </div>
      <div className="cv">
        <div className="row sp" style={{ padding: 10, borderBottom: "1px solid var(--bd)" }}>
          <b>{a}</b>
          <span className="row">
            <button className="btn sm sec" onClick={() => setCall("Audio")}>
              <Icon n="Phone" s={16} />
            </button>
            <button className="btn sm sec" onClick={() => setCall("Video")}>
              <Icon n="Video" s={16} />
            </button>
          </span>
        </div>
        <div className="msgs">
          {list.map((m, i) => (
            <div key={i} className={"m " + (m.u === c.u.name ? "me" : "")}>
              <small>{m.u} · {m.t}</small>
              {m.x}
            </div>
          ))}
          {!list.length && <span className="mu">No messages yet.</span>}
        </div>
        <form className="inp" onSubmit={send}>
          <label className="btn sm sec" style={{ padding: "9px" }}>
            <Icon n="Paperclip" s={16} />
            <input type="file" hidden onChange={(e) => setFile(e.target.files[0]?.name || "")} />
          </label>
          <button
            type="button"
            className={"btn sm " + (rec ? "red" : "sec")}
            onClick={() => {
              if (rec) {
                c.up((d) => {
                  (d.msgs[a] = d.msgs[a] || []).push({
                    u: c.u.name,
                    x: "Voice note (demo, 0:05)",
                    t: "now",
                  });
                });
              }
              setRec(!rec);
            }}
          >
            {rec ? <Icon n="Square" s={16} /> : <Icon n="Mic" s={16} />}
          </button>
          <input
            type="text"
            placeholder={file ? ("Attached: " + file) : "Type a message or paste a link…"}
            value={x}
            onChange={(e) => setX(e.target.value)}
          />
          <button className="btn">Send</button>
        </form>
      </div>
      {call && (
          <Modal title={call + " call (demo)"} onClose={() => setCall(null)}>
            <p>Frontend demo interface for <b>{a}</b>. No real call is connected.</p>
            <button className="btn red" onClick={() => setCall(null)}>End call</button>
          </Modal>
        )}
    </div>
  );
}

let toastFn = null;
const showToast = (m) => {
  if (toastFn) {
    toastFn(m);
  }
};

function ToastHost() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    toastFn = setMsg;
    return () => {
      toastFn = null;
    };
  }, []);
  useEffect(() => {
    if (!msg) {
      return;
    }
    const t = setTimeout(() => setMsg(""), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return msg ? <div className="toast">{msg}</div> : null;
}

// Profile page: round photo with an edit button, then the account details (editable)
function Profile({ c }) {
  const u = c.u;
  const [show, setShow] = useState(false),
    [edit, setEdit] = useState(false),
    [err, setErr] = useState(""),
    [f, setF] = useState({ name: "", phone: "", email: "", user: "", pw: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const pick = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      c.toast("Please choose an image file");
      return;
    }
    const rd = new FileReader();
    rd.onload = () => {
      c.up((d) => {
        d.user.photo = rd.result;
      });
      c.toast("Profile photo updated");
    };
    rd.readAsDataURL(file);
  };

  const start = () => {
    setF({
      name: u.name || "",
      phone: u.phone || "",
      email: u.email || "",
      user: u.user || "",
      pw: u.pw || "",
    });
    setErr("");
    setShow(false);
    setEdit(true);
  };

  const save = (e) => {
    e.preventDefault();
    const name = f.name.trim(),
      phone = f.phone.trim(),
      email = f.email.trim(),
      user = f.user.trim();
    if (!name) {
      return setErr("Enter your name.");
    }
    if (!phone) {
      return setErr("Enter your phone number.");
    }
    if (!email) {
      return setErr("Enter your email.");
    }
    if (user.length < 3) {
      return setErr("Username must be at least 3 characters.");
    }
    if (f.pw.length < 6) {
      return setErr("Password must be at least 6 characters.");
    }
    const accs = readAccs();
    const isDemo = u.email === DEMO.email;
    if (accs.some((x) => x.email !== u.email && (x.user === user || x.email === email))) {
      return setErr("That username or email is already registered.");
    }
    if (!isDemo && (email.toLowerCase() === DEMO.email || user.toLowerCase() === DEMO.user)) {
      return setErr("That username or email is already registered.");
    }
    const next = { name, phone, email, user, pw: f.pw };
    try {
      localStorage.setItem(
        "wf_acc",
        JSON.stringify(accs.map((x) => x.email === u.email ? { ...x, ...next } : x)),
      );
    } catch (x) {}
    const old = u.name;
    c.up((d) => {
      // keep every project, task and chat linked to this person when the name changes
      if (name !== old) {
        d.projects.forEach((p) => {
          if (p.lead === old) {
            p.lead = name;
          }
          p.members = p.members.map((m) => m === old ? name : m);
        });
        d.tasks.forEach((t) => {
          if (t.assignee === old) {
            t.assignee = name;
          }
          if (t.by === old) {
            t.by = name;
          }
        });
        Object.keys(d.msgs).forEach((k) => {
          d.msgs[k].forEach((m) => {
            if (m.u === old) {
              m.u = name;
            }
          });
        });
      }
      d.user = { ...d.user, ...next };
    });
    setEdit(false);
    setShow(false);
    c.toast("Profile updated");
  };

  const rows = [
    ["User", "Name", "name", "text", "Your full name"],
    ["Phone", "Phone number", "phone", "tel", "Phone number"],
    ["Mail", "Email", "email", "email", "name@example.com"],
    ["AtSign", "Username", "user", "text", "Username"],
  ];
  const pw = u.pw || "";

  return (
    <div className="profwrap">
      <div className="card pcard">
        <div className="pbanner" />
        {!edit && (
          <button type="button" className="pedit" onClick={start}>
            <Icon n="Pencil" s={16} />
            Edit profile
          </button>
        )}
        <div className="pavwrap">
          <div className="pavbig">
            {u.photo ? <img src={u.photo} alt="" /> : <span>{ini(u.name)}</span>}
          </div>
          <label className="avedit" title="Edit profile photo">
            <Icon n="Camera" s={18} />
            <input type="file" accept="image/*" hidden onChange={pick} />
          </label>
        </div>
        <form className="pflist" onSubmit={save}>
          {rows.map(([ic, k, key, type, ph]) => (
            <div key={key} className="pfrow">
              <i className="ic"><Icon n={ic} s={20} /></i>
              <div>
                <span className="pfl">{k}</span>
                {edit
                  ? (
                    <input
                      type={type}
                      placeholder={ph}
                      value={f[key]}
                      onChange={set(key)}
                    />
                  )
                  : <span className="pfv">{u[key] || "—"}</span>}
              </div>
            </div>
          ))}
          <div className="pfrow">
            <i className="ic"><Icon n="Lock" s={20} /></i>
            <div>
              <span className="pfl">Password</span>
              {edit
                ? (
                  <input
                    type={show ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={f.pw}
                    onChange={set("pw")}
                  />
                )
                : (
                  <span className={"pfv" + (show ? "" : " dots")}>
                    {show ? (pw || "—") : "•".repeat(Math.max(pw.length, 8))}
                  </span>
                )}
            </div>
            <button
              type="button"
              className="eye"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow(!show)}
            >
              <Icon n={show ? "EyeOff" : "Eye"} s={18} />
            </button>
          </div>
          {edit && (
            <>
              {err && <div className="err" style={{ marginTop: 6 }}>{err}</div>}
              <div className="pacts">
                <button
                  type="button"
                  className="btn sec"
                  onClick={() => {
                    setEdit(false);
                    setShow(false);
                    setErr("");
                  }}
                >
                  Cancel
                </button>
                <button className="btn">Save changes</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function App() {
  // State lives in memory only (no localStorage), so a page reload starts from the demo data again.
  const [s, setS] = useState(seed);
  const [route, setRoute] = useState({ p: "overview" }),
    [hist, setHist] = useState([]),
    [dd, setDd] = useState(false),
    [modal, setModal] = useState(null),
    [flt, setFlt] = useState("All"),
    [tq, setTq] = useState(""),
    [tp, setTp] = useState("All"),
    [mq, setMq] = useState(""),
    [mf, setMf] = useState("All");
  const setToast = showToast;

  const [side, setSide] = useState(() => {
    try {
      return localStorage.getItem("wf_side") === "1";
    } catch (e) {
      return false;
    }
  });
  const profRef = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem("wf_side", side ? "1" : "0");
    } catch (e) {}
  }, [side]);

  useEffect(() => {
    if (!dd) {
      return;
    }
    const onDown = (e) => {
      if (profRef.current && !profRef.current.contains(e.target)) {
        setDd(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDd(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dd]);

  const up = (fn) =>
    setS((p) => {
      const d = JSON.parse(JSON.stringify(p));
      fn(d);
      return d;
    });
  const log = (d, id, txt) => d.tasks.find((t) => t.id === id).log.push({ t: now(), txt });
  const go = (r) => {
    setHist((h) => [...h, route]);
    setRoute(r);
    setDd(false);
  };
  const back = () => {
    if (hist.length) {
      setRoute(hist[hist.length - 1]);
      setHist(hist.slice(0, -1));
    } else {
      setRoute({ p: "overview" });
    }
  };
  const c = { s, up, go, u: s.user, toast: setToast };
  if (!s.user) {
    return <Auth c={c} />;
  }
  const u = s.user,
    ws = s.ws,
    TT = ws === "tt",
    TM = ws === "tm";
  const projects = s.projects.filter((p) => (TT ? p.lead === u.name : p.members.includes(u.name)));
  const pn = projects.map((p) => p.name);
  const tasks = s.tasks.filter((t) => (TT ? pn.includes(t.project) : t.assignee === u.name));
  const secs = (t) =>
    t.secs + (s.timer && s.timer.id === t.id ? (Date.now() - s.timer.start) / 1000 : 0);
  const prog = (p) => {
    const t = s.tasks.filter((x) => x.project === p.name);
    return t.length
      ? Math.round(t.filter((x) => x.status === "Completed").length / t.length * 100)
      : 0;
  };
  const pstat = (p) => {
    const ts = s.tasks.filter((x) => x.project === p.name);
    if (ts.length && ts.every((x) => x.status === "Completed")) {
      return "Completed";
    }
    if (ts.some((x) => !FRESH.includes(x.status))) {
      return "In Progress";
    }
    return "Pending";
  };

  const switchWs = (w) => {
    up((d) => {
      d.ws = w;
    });
    setRoute({ p: "overview" });
    setHist([]);
    setDd(false);
    setToast("Switched to " + WS[w]);
  };

  // ---- Timer workflow helpers ----
  // Stop the running timer (at = the moment the button was clicked). Task becomes "Stopped".
  const stopTimer = (d, at) => {
    if (d.timer) {
      const t = d.tasks.find((x) => x.id === d.timer.id);
      const el = Math.floor(((at || Date.now()) - d.timer.start) / 1000);
      t.secs += el;
      t.status = "Stopped";
      log(d, t.id, "Timer stopped, " + fmt(el) + " logged");
      d.timer = null;
    }
  };

  const startTimer = (t) =>
    up((d) => {
      stopTimer(d);
      const k = d.tasks.find((x) => x.id === t.id);
      log(d, t.id, k.secs > 0 ? "Timer resumed" : "Timer started");
      k.status = "In Progress";
      d.timer = { id: t.id, start: Date.now() };
    });

  // In Progress / Stopped -> Review (no description needed)
  const markReview = (t) => {
    up((d) => {
      if (d.timer && d.timer.id === t.id) {
        stopTimer(d);
      }
      d.tasks.find((x) => x.id === t.id).status = "Review";
      log(d, t.id, "Marked for review by " + u.name);
    });
    setToast("Marked for review");
  };

  // Review -> Completed
  const completeReviewed = (t) => {
    up((d) => {
      const k = d.tasks.find((x) => x.id === t.id);
      k.status = "Completed";
      k.completedAt = now();
      log(d, t.id, "Marked complete by " + u.name);
    });
    setToast("Task marked as completed");
  };

  const nav = [
    ["overview", "LayoutDashboard", "Overview"],
    ["project", "FolderKanban", "Project"],
    ["team", "UsersRound", "Team"],
    ["task", "ListTodo", "Task"],
    ["chat", "MessagesSquare", "Team Chat"],
    ["dm", "MessageCircle", "Direct Message"],
    ["notif", "Bell", "Notification"],
  ];

  const titles = {
    project: "Projects",
    projd: "Project Details",
    team: "Teams",
    task: "Tasks",
    taskd: "Task Details",
    chat: "Team Chat",
    dm: "Direct Message",
    notif: "Notifications",
    profile: "Profile",
  };

  const myNotifs = s.notifs.filter((n) => n.ws === ws);
  const unread = myNotifs.filter((n) => n.un).length;
  const BackBtn = () =>
    route.p === "overview"
      ? null
      : (
        <button className="btn sec sm back" onClick={back}>
          <Icon n="ArrowLeft" s={16} />
          {" "}
          Back
        </button>
      );
  const mems = (pj) => {
    const p = s.projects.find((x) => x.name === pj);
    return p ? p.members : [];
  };

  const statCards = (list, cls) => (
    <div className={"lo-stats " + (cls || "")}>
      {list.map(([a, b, i]) => (
        <div key={a} className="card stat">
          <i className="ic"><Icon n={i} s={20} /></i>
          <div><span>{a}</span><b>{b}</b></div>
        </div>
      ))}
    </div>
  );

  // ============ Modals ============

  const Assign = () => {
    const [f, setF] = useState({
      title: "",
      desc: "",
      project: modal?.project || projects[0]?.name || "",
      assignee: "",
      priority: "Medium",
      due: "2026-11-30",
      items: [],
      ci: "",
    });
    const ms = mems(f.project);
    const as = ms.includes(f.assignee) ? f.assignee : ms[0] || "";
    const addItem = () => {
      const t = f.ci.trim();
      if (t) {
        setF({ ...f, items: [...f.items, t], ci: "" });
      }
    };

    return (
      <Modal title="Assign Task" onClose={() => setModal(null)}>
        {!projects.length
          ? <p className="mu">There are no projects assigned to you yet.</p>
          : (
            <form
              className="grid"
              onSubmit={(e) => {
                e.preventDefault();
                if (!as) {
                  return;
                }
                const id = "TASK-" +
                  (Math.max(1107, ...s.tasks.map((x) => parseInt(x.id.slice(5)) || 0)) + 1);
                up((d) => {
                  d.tasks.unshift(
                    T(id, f.title, f.desc || "Assigned task.", f.project, as, u.name, f.priority, f.due, f.items),
                  );
                });
                setModal(null);
                setToast("Task assigned to " + as);
              }}
            >
              <label>
                Title *
                <input
                  required
                  placeholder="e.g. Implement Webhook retry architecture"
                  value={f.title}
                  onChange={(e) => setF({ ...f, title: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  rows={3}
                  placeholder="Requirements, endpoints, expected outcome..."
                  value={f.desc}
                  onChange={(e) => setF({ ...f, desc: e.target.value })}
                />
              </label>
              <label>
                Project *
                <select
                  value={f.project}
                  onChange={(e) => setF({ ...f, project: e.target.value, assignee: "" })}
                >
                  {projects.map((p) => <option key={p.id}>{p.name}</option>)}
                </select>
              </label>
              <label>
                Assigned to *
                <select value={as} onChange={(e) => setF({ ...f, assignee: e.target.value })}>
                  {ms.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <div className="row">
                <label style={{ flex: 1 }}>
                  Priority
                  <select
                    value={f.priority}
                    onChange={(e) => setF({ ...f, priority: e.target.value })}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </label>
                <label style={{ flex: 1 }}>
                  Due Date
                  <input
                    type="date"
                    value={f.due}
                    onChange={(e) => setF({ ...f, due: e.target.value })}
                  />
                </label>
              </div>
              <div className="cbox">
                <span className="cap">Checklist</span>
                <div className="crow">
                  <input
                    placeholder="Add a checklist item"
                    value={f.ci}
                    onChange={(e) => setF({ ...f, ci: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem();
                      }
                    }}
                  />
                  <button type="button" className="btn sm sec" onClick={addItem}>
                    <Icon n="Plus" s={16} />
                    Add
                  </button>
                </div>
                {f.items.map((t, i) => (
                  <div key={i} className="cli">
                    <Icon n="Check" s={16} />
                    <span>{t}</span>
                    <button
                      type="button"
                      className="link"
                      aria-label="Remove item"
                      onClick={() => setF({ ...f, items: f.items.filter((_, j) => j !== i) })}
                    >
                      <Icon n="X" s={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn">Assign Task</button>
            </form>
          )}
      </Modal>
    );
  };

  // Reassign a task that has not been started yet
  const Reassign = ({ t }) => {
    const [q, setQ] = useState("");
    const ms = mems(t.project).filter((m) =>
      m !== t.assignee && m.toLowerCase().includes(q.toLowerCase()));

    return (
      <Modal title={"Reassign Task · " + t.id} onClose={() => setModal(null)}>
        <div className="mu">{t.title}<br />Currently with <b>{t.assignee}</b></div>
        <div className="search" style={{ maxWidth: "none" }}>
          <span><Icon n="Search" s={18} /></span>
          <input
            autoFocus
            placeholder="Search team members…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="plist">
          {ms.map((m) => (
            <div key={m} className="prow">
              <span className="row"><span className="avatar">{ini(m)}</span>{m}</span>
              <button
                className="btn sm"
                onClick={() => {
                  up((d) => {
                    const k = d.tasks.find((x) => x.id === t.id);
                    k.assignee = m;
                    k.status = "Reassigned";
                    log(d, t.id, `Reassigned from ${t.assignee} to ${m}`);
                  });

                  setModal(null);
                  setToast("Reassigned to " + m);
                  back();
                }}
              >
                Reassign
              </button>
            </div>
          ))}
          {!ms.length && <span className="mu">No matching members.</span>}
        </div>
      </Modal>
    );
  };

  // Description pop-up for "Stop & Save" and "Mark Complete"
  const NoteModal = ({ m }) => {
    const [x, setX] = useState("");
    const stop = m.kind === "stopsave";

    return (
      <Modal
        title={(stop ? "Stop & Save · " : "Mark Complete · ") + m.t.id}
        onClose={() => setModal(null)}
      >
        <form
          className="grid"
          onSubmit={(e) => {
            e.preventDefault();
            if (!x.trim()) {
              return;
            }
            up((d) => {
              if (d.timer && d.timer.id === m.t.id) {
                stopTimer(d, m.at);
              }
              const k = d.tasks.find((y) => y.id === m.t.id);
              if (stop) {
                log(d, k.id, "Work update: " + x.trim());
              } else {
                k.status = "Completed";
                k.completedAt = now();
                log(d, k.id, "Completed: " + x.trim());
              }
            });
            setModal(null);
            setToast(stop ? "Changes saved" : "Task completed");
          }}
        >
          <div className="mu">{m.t.title}</div>
          <label>
            {stop ? "Work description" : "Completion description"}
            <textarea
              required
              rows={4}
              autoFocus
              placeholder={stop
                ? "Describe the work completed during this session..."
                : "Describe the completed work and final outcome..."}
              value={x}
              onChange={(e) => setX(e.target.value)}
            />
          </label>
          <button className="btn">{stop ? "Save Changes" : "Save & Complete"}</button>
        </form>
      </Modal>
    );
  };

  const teamModal = (x) => (
    <Modal title={x.team + " · " + x.name} onClose={() => setModal(null)}>
      <div className="mu">Lead: {x.lead}</div>
      {[x.lead, ...x.members].map((m, i) => {
        const ct = s.tasks.find((t) =>
          t.assignee === m && t.project === x.name && t.status === "In Progress");

        return (
          <div key={m} className="prow">
            <span className="row">
              <span className="avatar">{ini(m)}</span>
              <span>
                {m}
                <br />
                <small className="mu">{ct ? ct.title : i === 0 ? "Lead" : "No active task"}</small>
              </span>
            </span>
            <small className="mu">{["Online", "Away", "Offline"][(i + m.length) % 3]}</small>
          </div>
        );
      })}
      {TT && (
          <button className="btn" onClick={() => setModal({ k: "assign", project: x.name })}>
            Assign Task
          </button>
        )}
    </Modal>
  );

  // Report to Super Admin
  const Report = ({ t }) => {
    const [f, setF] = useState({ cat: "Task Progress", desc: "", prog: "", block: "", act: "", att: "" });

    return (
      <Modal title={"Report to Super Admin · " + t.id} onClose={() => setModal(null)}>
        <form
          className="grid"
          onSubmit={(e) => {
            e.preventDefault();

            up((d) => {
              const k = d.tasks.find((x) => x.id === t.id);
              k.reports.push({ ...f, at: now(), by: u.name, status: k.status });
              log(d, t.id, "Report to Super Admin submitted (" + f.cat + ")");
            });

            setModal(null);
            setToast("Report submitted");
          }}
        >
          <div className="mu">{t.title} · {t.project} · {t.assignee} · {t.status}</div>
          <label>
            Report Category
            <select value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>
              {[
                "Task Progress",
                "Task Delay",
                "Technical Issue",
                "Member Performance",
                "Deadline Risk",
                "Task Completion",
                "Other",
              ].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>
            Report Description
            <textarea
              required
              rows={3}
              placeholder="Explain the current task progress, completed work, issues, delays or important updates for the Super Admin..."
              value={f.desc}
              onChange={(e) => setF({ ...f, desc: e.target.value })}
            />
          </label>
          <label>
            Progress Summary
            <input value={f.prog} onChange={(e) => setF({ ...f, prog: e.target.value })} />
          </label>
          <label>
            Blockers / Issues
            <input value={f.block} onChange={(e) => setF({ ...f, block: e.target.value })} />
          </label>
          <label>
            Recommended Action
            <input value={f.act} onChange={(e) => setF({ ...f, act: e.target.value })} />
          </label>
          <label>
            Optional Attachment
            <input type="file" onChange={(e) => setF({ ...f, att: e.target.files[0]?.name || "" })} />
          </label>
          <button className="btn">Submit Report</button>
        </form>
      </Modal>
    );
  };

  // ============ Task details ============
  // NOTE: these are plain render functions (not inner components) so the page does not
  // re-mount on every update. That is why ticking a checklist item no longer "reloads" the page.

  const taskDetail = () => {
    const t = s.tasks.find((x) => x.id === route.id);
    if (!t) {
      return <div className="card">Task not found.</div>;
    }
    const running = s.timer?.id === t.id;
    const done = t.status === "Completed";
    const items = t.checklist || [];
    const canTick = (t.assignee === u.name || TT) && !done;

    const checklistUI = (
      <>
        <div className="row sp">
          <b>Checklist</b>
          <span className="mu">{items.filter((x) => x.done).length}/{items.length}</span>
        </div>
        <div className="td-check">
          {items.map((it, i) => (
            <label key={i} className="ckrow">
              <input
                type="checkbox"
                checked={it.done}
                disabled={!canTick}
                onChange={() =>
                  up((d) => {
                    const k = d.tasks.find((x) => x.id === t.id);
                    k.checklist[i].done = !k.checklist[i].done;
                  })}
              />
              <span className={it.done ? "done" : ""}>{it.t}</span>
            </label>
          ))}
          {!items.length && <span className="mu td-empty">No checklist items.</span>}
        </div>
      </>
    );

    // ---------- Team & task management ----------
    if (TT) {
      const savedChanges = [...t.log].reverse().filter((l) =>
        l.txt.startsWith("Work update: ") || l.txt.startsWith("Completed: "));

      return (
        <div className="grid td-page">
          {/* LEFT: details */}
          <div className="card td-col td-main">
            <div className="row sp">
              <span className="mu">{t.project} · {t.id}</span>
              <span className="row"><Pill v={t.priority} /><Pill v={t.status} /></span>
            </div>
            <h2>{t.title}</h2>
            <p>{t.desc}</p>

            <div className="td-meta">
              <span>Assigned to : <b>{t.assignee}</b></span>
              <span>Due Date : <b>{t.due}</b></span>
            </div>

            {checklistUI}
          </div>

          {/* RIGHT: time tracking + activity history in ONE container */}
          <div className="card td-col td-right">
            <div className="td-time">
              <b>Time Tracking</b>
              <div className="timer"><LiveTime t={t} timer={s.timer} /></div>
              {running && <div className="live">Timer running</div>}
            </div>

            <div className="td-hist">
              <b>Activity History</b>
              <div className="td-fill">
                {[...t.log].reverse().map((l, i) => (
                  <div key={i} className="log">
                    <small className="mu">{l.t}</small>
                    <br />
                    {l.txt}
                  </div>
                ))}
                {!t.log.length && <span className="mu td-empty">No activity history yet.</span>}
              </div>
            </div>
          </div>

          {/* BOTTOM: saved changes */}
          <div className="card td-col td-saved">
            <b>Saved Changes</b>
            <div className="td-fill">
              {savedChanges.map((l, i) => (
                <div key={i} className="log">
                  <b>{l.t}</b>
                  {l.txt.replace("Work update: ", "")}
                </div>
              ))}
              {!savedChanges.length && <span className="mu td-empty">No saved changes yet.</span>}
            </div>
          </div>
        </div>
      );
    }

    // ---------- Task management ----------
    // To Do / Reassigned -> [Start] [Reassign]
    // In Progress        -> [Stop & Save] [Mark as Review] [Mark Complete]
    // Stopped            -> [Resume] [Mark as Review] [Mark Complete]
    // Review / Completed -> status only
    let ctrl;
    if (done) {
      ctrl = <span className="mu">Task completed.</span>;
    } else if (t.status === "Review") {
      ctrl = <span className="mu">Submitted for review.</span>;
    } else if (FRESH.includes(t.status)) {
      ctrl = (
        <div className="td-ctrlbtns">
          <button className="btn" onClick={() => startTimer(t)}>
            <Icon n="Play" s={16} />
            {" "}
            Start
          </button>
          <button className="btn sec" onClick={() => setModal({ k: "reassign", t })}>
            Reassign
          </button>
        </div>
      );
    } else {
      ctrl = (
        <div className="td-ctrlbtns">
          {running
            ? (
              <button
                className="btn red"
                onClick={() => setModal({ k: "note", kind: "stopsave", t, at: Date.now() })}
              >
                <Icon n="Square" s={16} />
                {" "}
                Stop &amp; Save
              </button>
            )
            : (
              <button className="btn" onClick={() => startTimer(t)}>
                <Icon n="Play" s={16} />
                {" "}
                Resume
              </button>
            )}
          <button className="btn sec" onClick={() => markReview(t)}>Mark as Review</button>
          <button
            className="btn sec"
            onClick={() => setModal({ k: "note", kind: "complete", t, at: Date.now() })}
          >
            Mark Complete
          </button>
        </div>
      );
    }

    return (
      <div className="grid td-page emp">
        <div className="card td-col td-main">
          <span className="mu">{t.project} · {t.id}</span>
          <h2>{t.title}</h2>
          <p>{t.desc}</p>

          <div className="td-meta3">
            <div><small className="mu">Assigned by</small><b>{t.by}</b></div>
            <div><small className="mu">Due Date</small><b>{t.due}</b></div>
            <div><small className="mu">Priority</small><b>{t.priority}</b></div>
          </div>

          {checklistUI}
        </div>

        <div className="card td-col td-ctrl">
          <b>Task Controls</b>
          <div className="td-ctrlbody">
            <Pill v={t.status} />
            <div className="timer"><LiveTime t={t} timer={s.timer} /></div>
            {running && <div className="live">Timer running</div>}
            {ctrl}
          </div>
        </div>
      </div>
    );
  };

  const taskTable = (list, size) => (
    <div className={"card tbl " + (size || "")}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Project</th>
            {!TM && <th>Assignee</th>}
            <th>By</th>
            <th>Priority</th>
            <th>Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
            <tr key={t.id} className="cl" onClick={() => go({ p: "taskd", id: t.id })}>
              <td>{t.id}</td>
              <td><b>{t.title}</b></td>
              <td>{t.project}</td>
              {!TM && <td>{t.assignee}</td>}
              <td>{t.by}</td>
              <td><Pill v={t.priority} /></td>
              <td>{t.due}</td>
              <td><Pill v={t.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!list.length && <p className="mu" style={{ padding: 14 }}>No tasks found.</p>}
    </div>
  );

  let page;
  const p = route.p;
  const reportTask = p === "taskd" && TT ? s.tasks.find((x) => x.id === route.id) : null;

  // ---------- Overview: Team & task management ----------
  if (p === "overview" && TT) {
    const cnt = (st) => tasks.filter((t) => t.status === st).length;
    const reviewList = tasks.filter((t) => t.status === "Review");
    const stats = [
      ["Projects", projects.length, "FolderKanban"],
      ["Team Members", new Set(projects.flatMap((x) => x.members)).size, "UsersRound"],
      ["Total Task", tasks.length, "ListTodo"],
      ["Completed", cnt("Completed"), "Check"],
      ["In Progress", cnt("In Progress"), "Zap"],
      ["Under Review", reviewList.length, "Eye"],
    ];

    page = (
      <div className="grid">
        <h2 className="t">Overview</h2>

        {statCards(stats)}

        <div className="lo-row">
          <div className="card">
            <b>Project Progress</b>
            <div className="lo-scroll">
              {projects.map((x) => (
                <div
                  key={x.id}
                  style={{ margin: "14px 0", cursor: "pointer" }}
                  onClick={() => go({ p: "projd", id: x.id })}
                >
                  <div className="row sp">
                    <span>{x.name}</span>
                    <span className="mu">{prog(x)}%</span>
                  </div>
                  <Bar v={prog(x)} />
                </div>
              ))}
              {!projects.length && <p className="mu">No projects yet.</p>}
            </div>
          </div>

          <div className="card">
            <b>Review ({reviewList.length})</b>
            <div className="lo-scroll">
              {reviewList.map((t) => (
                <div key={t.id} className="lo-review" onClick={() => go({ p: "taskd", id: t.id })}>
                  <span>{t.title}<br /><small className="mu">{t.assignee}</small></span>
                  <Pill v="Review" />
                </div>
              ))}
              {!reviewList.length && <p className="mu">No tasks waiting for review.</p>}
            </div>
          </div>

          <div className="card">
            <b>Quick Actions</b>
            <div className="lo-quick">
              {[
                ["FolderKanban", "View Project", "Open your projects", () => go({ p: "project" })],
                [
                  "UserPlus",
                  "Assign Task",
                  "Delegate to your team",
                  () => setModal({ k: "assign" }),
                ],
                ["UsersRound", "View Teams", "See your teams", () => go({ p: "team" })],
              ].map(([i, a, b, f]) => (
                <button key={a} className="qbtn" onClick={f}>
                  <i><Icon n={i} s={20} /></i>
                  <span><b>{a}</b><small>{b}</small></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <b>Recent Activity</b>
          <div className="lo-scroll" style={{ maxHeight: 300 }}>
            {tasks.map((t) => {
              const st = s.timer?.id === t.id ? "Started" : t.status;

              return (
                <div key={t.id} className="lo-act" onClick={() => go({ p: "taskd", id: t.id })}>
                  <span><b>{t.assignee}</b> : {t.title}</span>
                  <span className={"st " + st.split(" ")[0]}>{st}</span>
                </div>
              );
            })}
            {!tasks.length && <p className="mu">No activity yet.</p>}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Overview: Task management ----------
  if (p === "overview" && TM) {
    const cnt = (st) => tasks.filter((t) => t.status === st).length;
    const cur = (s.timer && tasks.find((t) => t.id === s.timer.id)) ||
      tasks.find((t) => t.status === "In Progress" || t.status === "Stopped") ||
      null;
    const curRun = !!cur && s.timer?.id === cur.id;
    const upcomingList = tasks
      .filter((t) => t.status !== "Completed" && t.status !== "Review" && (!cur || t.id !== cur.id))
      .sort((a, b) => a.due.localeCompare(b.due));
    const stats = [
      ["Open Tasks", tasks.filter((t) => t.status !== "Completed").length, "ListTodo"],
      ["Projects", projects.length, "FolderKanban"],
      ["In Progress", cnt("In Progress"), "Zap"],
      ["Completed", cnt("Completed"), "Check"],
      ["Logged Hours", fmt(tasks.reduce((a, t) => a + secs(t), 0)).slice(0, -3), "Clock"],
    ];

    page = (
      <div className="grid eo-page">
        <h2 className="t">Overview</h2>

        {statCards(stats, "five")}

        <div className="eo-row">
          <div className="card eo-cur">
            <div className="row sp eo-curhead">
              <b>Current Task</b>
              {cur && (
                <span className="row">
                  <Pill v={cur.priority} />
                  <Pill v={cur.status} />
                </span>
              )}
            </div>
            {cur
              ? (
                <div className="eo-curbody">
                  <div
                    className="eo-curinfo"
                    style={{ cursor: "pointer" }}
                    onClick={() => go({ p: "taskd", id: cur.id })}
                  >
                    <h3>{cur.title}</h3>
                    <p className="eo-curdesc">{cur.desc}</p>
                    <div className="eo-curmeta">
                      <span>Project : <b>{cur.project}</b></span>
                      <span>Due Date : <b>{cur.due}</b></span>
                    </div>
                  </div>
                  <div className="eo-curtimer">
                    <div className="timer"><LiveTime t={cur} timer={s.timer} /></div>
                    {curRun
                      ? (
                        <button
                          className="btn red"
                          onClick={() => setModal({ k: "note", kind: "stopsave", t: cur, at: Date.now() })}
                        >
                          <Icon n="Square" s={16} />
                          {" "}
                          Stop &amp; Save
                        </button>
                      )
                      : (
                        <button className="btn" onClick={() => startTimer(cur)}>
                          <Icon n="Play" s={16} />
                          {" "}
                          Resume
                        </button>
                      )}
                  </div>
                </div>
              )
              : <p className="mu eo-none">No active task. Open a task from the list below and start it.</p>}
          </div>

          <div className="card eo-quick">
            <b>Quick Actions</b>
            <div className="lo-quick">
              {[
                ["ClipboardCheck", "View Tasks", "Your assigned tasks", () => go({ p: "task" })],
                ["FolderKanban", "View Project", "Open your projects", () => go({ p: "project" })],
                ["UsersRound", "View Teams", "See your teams", () => go({ p: "team" })],
              ].map(([i, a, b, f]) => (
                <button key={a} className="qbtn" onClick={f}>
                  <i><Icon n={i} s={20} /></i>
                  <span><b>{a}</b><small>{b}</small></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card eo-up">
          <b>Upcoming Task</b>
          <div className="eo-tbl">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingList.map((t) => (
                  <tr key={t.id} className="cl" onClick={() => go({ p: "taskd", id: t.id })}>
                    <td><b>{t.title}</b></td>
                    <td>{t.project}</td>
                    <td>{t.due}</td>
                    <td><Pill v={t.priority} /></td>
                    <td><Pill v={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!upcomingList.length && <p className="mu" style={{ padding: 14 }}>No upcoming tasks.</p>}
          </div>
        </div>
      </div>
    );
  }

  if (p === "project") {
    const ps = (st) => projects.filter((x) => pstat(x) === st).length;

    page = (
      <div className="grid">
        {statCards([
          ["Total Projects", projects.length, "FolderKanban"],
          ["In Progress", ps("In Progress"), "Zap"],
          ["Pending", ps("Pending"), "Clock"],
          ["Completed", ps("Completed"), "Check"],
        ], "four")}
        <ProjList projects={projects} prog={prog} pstat={pstat} go={go} s={s} />
      </div>
    );
  }

  if (p === "projd") {
    const x = s.projects.find((y) => y.id === route.id);

    page = !x
      ? <div className="card">Not found.</div>
      : (
        <div className="grid">
          <div className="card">
            <div className="row sp">
              <div>
                <span className="mu">{x.id}</span>
                <h2 style={{ margin: "2px 0" }}>{x.name}</h2>
              </div>
              <Pill v={pstat(x)} />
            </div>
            <p>{x.desc}</p>
            <div className="mu">Lead <b>{x.lead}</b> · Team {x.team} · Due {x.due}</div>
            <div style={{ margin: "10px 0" }}><Bar v={prog(x)} /></div>
            <div className="row">
              {x.members.map((m) => (
                <span key={m} className="row"><span className="avatar">{ini(m)}</span>{m}</span>
              ))}
            </div>
          </div>
          {taskTable(tasks.filter((t) => t.project === x.name), "mid")}
        </div>
      );
  }

  if (p === "team") {
    const rows = projects.filter((x) =>
      (mf === "All" || x.team === mf) &&
        (x.team + x.name + x.lead + x.members.join(" ")).toLowerCase().includes(mq.toLowerCase()));

    page = (
      <div className="grid">
        {statCards([
          ["Total Teams", projects.length, "UsersRound"],
          ["Total Members", new Set(projects.flatMap((x) => [x.lead, ...x.members])).size, "User"],
          ["Active Tasks", tasks.filter((t) => t.status !== "Completed").length, "ListTodo"],
        ], "three")}
        <div className="toolbar">
          <div className="search">
            <span><Icon n="Search" s={18} /></span>
            <input
              placeholder="Search teams, projects, members…"
              value={mq}
              onChange={(e) => setMq(e.target.value)}
            />
          </div>
          <select value={mf} onChange={(e) => setMf(e.target.value)}>
            <option value="All">All teams</option>
            {[...new Set(projects.map((x) => x.team))].map((x) => <option key={x}>{x}</option>)}
          </select>
          {TT && (
              <button className="btn" onClick={() => setModal({ k: "assign" })}>
                <Icon n="Plus" s={18} />
                Assign Task
              </button>
            )}
        </div>
        <div className="card tbl fix">
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>Project</th>
                <th>Lead</th>
                <th>Members</th>
                <th>Active tasks</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => {
                const ts = s.tasks.filter((t) => t.project === x.name);

                return (
                  <tr key={x.id} className="cl" onClick={() => setModal({ k: "team", x })}>
                    <td><b>{x.team}</b></td>
                    <td>{x.name}</td>
                    <td>{x.lead}</td>
                    <td>
                      <span className="stack-av">
                        {x.members.slice(0, 4).map((m) => (
                          <span key={m} className="avatar">{ini(m)}</span>
                        ))}
                      </span>
                      {" "}
                      <small className="mu">{x.members.length}</small>
                    </td>
                    <td>{ts.filter((t) => t.status !== "Completed").length}</td>
                    <td style={{ minWidth: 110 }}><Bar v={prog(x)} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!rows.length && <p className="mu" style={{ padding: 14 }}>No teams found.</p>}
        </div>
      </div>
    );
  }

  if (p === "task") {
    const fl = tasks.filter((t) =>
      (flt === "All" || t.status === flt) &&
        (tp === "All" || t.priority === tp) &&
        (t.id + t.title + t.project + t.assignee).toLowerCase().includes(tq.toLowerCase()));
    const cnt = (...st) => tasks.filter((t) => st.includes(t.status)).length;

    page = (
      <div className="grid">
        {statCards([
          ["Total Task", tasks.length, "ListTodo"],
          ["To Do", cnt("To Do", "Reassigned"), "ClipboardCheck"],
          ["In Progress", cnt("In Progress"), "Zap"],
          ["Stopped", cnt("Stopped"), "Clock"],
          ["Review", cnt("Review"), "Eye"],
          ["Completed", cnt("Completed"), "Check"],
        ])}
        <div className="toolbar">
          <div className="search">
            <span><Icon n="Search" s={18} /></span>
            <input
              placeholder="Search tasks, projects, people…"
              value={tq}
              onChange={(e) => setTq(e.target.value)}
            />
          </div>
          <select value={flt} onChange={(e) => setFlt(e.target.value)}>
            {["All", ...ST].map((x) => (
              <option key={x} value={x}>{x === "All" ? "All statuses" : x}</option>
            ))}
          </select>
          <select value={tp} onChange={(e) => setTp(e.target.value)}>
            {["All", "High", "Medium", "Low"].map((x) => (
              <option key={x} value={x}>{x === "All" ? "All priorities" : x}</option>
            ))}
          </select>
          {TT && (
              <button className="btn" onClick={() => setModal({ k: "assign" })}>
                <Icon n="Plus" s={18} />
                Assign Task
              </button>
            )}
        </div>
        {taskTable(fl, "fix")}
      </div>
    );
  }

  if (p === "taskd") {
    page = taskDetail();
  }

  if (p === "profile") {
    page = <Profile c={c} />;
  }

  if (p === "chat" || p === "dm") {
    const chans = p === "chat"
      ? [...new Set(projects.map((x) => slug(x.team)))]
      : [...new Set(projects.flatMap((x) => [x.lead, ...x.members]))].filter((n) => n !== u.name);

    page = <Chat key={p + ws} c={c} kind={p} chans={chans} />;
  }

  if (p === "notif") {
    page = (
      <div className="card" style={{ padding: 0 }}>
        <div className="row sp" style={{ padding: 12 }}>
          <b>Notifications ({unread} unread)</b>
          <button
            className="link"
            onClick={() =>
              up((d) =>
                d.notifs.forEach((n) => {
                  if (n.ws === ws) {
                    n.un = false;
                  }
                })
              )}
          >
            Mark all as read
          </button>
        </div>
        {myNotifs.map((n) => (
          <div
            key={n.id}
            className={"notif " + (n.un ? "un" : "")}
            onClick={() => {
              up((d) => {
                d.notifs.find((x) => x.id === n.id).un = false;
              });
              if (n.task) {
                go({ p: "taskd", id: n.task });
              }
            }}
          >
            {n.un && <span className="dot" />}
            <div style={{ flex: 1 }}>
              <b>{n.cat}</b>
              <br />
              {n.txt}
              <br />
              <small className="mu">{n.t}</small>
            </div>
            {n.un && (
                <button
                  className="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    up((d) => {
                      d.notifs.find((x) => x.id === n.id).un = false;
                    });
                  }}
                >
                  Mark read
                </button>
              )}
          </div>
        ))}
        {!myNotifs.length && <p className="mu" style={{ padding: 14 }}>No notifications.</p>}
      </div>
    );
  }

  return (
    <div className={"shell" + (side ? " open" : "")}>
      <aside className={"side" + (side ? " open" : "")}>
        <button
          className="sidetoggle"
          aria-label={side ? "Close sidebar" : "Open sidebar"}
          data-tip={side ? "Close sidebar" : "Open sidebar"}
          onClick={() => {
            setSide(!side);
            setDd(false);
          }}
        >
          <Icon n={side ? "ChevronLeft" : "ChevronRight"} s={16} />
        </button>
        <div className="brand">
          <div className="logo">W.</div>
          {side && <div className="brandtx"><b>Work Flow</b><small>{WS[ws]}</small></div>}
        </div>
        <nav className="navs">
          {nav.map(([k, i, l]) => (
            <button
              key={k}
              aria-label={l}
              data-tip={side ? undefined : l}
              className={"nav " +
                (
                  (p === k || (p === "taskd" && k === "task") || (p === "projd" && k === "project"))
                    ? "on"
                    : ""
                )}
              onClick={() => go({ p: k })}
            >
              <Icon n={i} s={22} />
              {side && <span className="nl">{l}</span>}
              {k === "notif" && unread > 0 && <em className="nd" />}
            </button>
          ))}
        </nav>
        <div className="prof" ref={profRef}>
          {dd && (
              <div className="dd">
                {(u.ws || []).map((w) => (
                  <button key={w} className={w === ws ? "cur" : ""} onClick={() => switchWs(w)}>
                    {WS[w]}
                    {w === ws && <Icon n="Check" s={16} />}
                  </button>
                ))}
                <hr />
                <button className="ddi" onClick={() => go({ p: "profile" })}>
                  <Icon n="User" s={18} />
                  Profile
                </button>
                <button
                  className="ddi"
                  onClick={() => {
                    up((d) => {
                      stopTimer(d);
                      d.user = null;
                    });
                    setRoute({ p: "overview" });
                    setHist([]);
                    setDd(false);
                  }}
                >
                  <Icon n="LogOut" s={18} />
                  Logout
                </button>
              </div>
            )}
          <button
            className="pbtn"
            aria-label="Profile menu"
            data-tip={dd || side ? undefined : u.name}
            onClick={() => setDd(!dd)}
          >
            <span className="pav">
              {u.photo ? <img src={u.photo} alt="" /> : ini(u.name)}
            </span>
            {side && <span className="pn"><b>{u.name}</b><small>Profile</small></span>}
          </button>
        </div>
      </aside>
      <main className="main">
        <div className="page" key={JSON.stringify(route) + ws}>
          {p !== "overview" && (
            <div className="topbar">
              <div className="tb-left">
                <BackBtn />
                <h2 className="t">{titles[p]}</h2>
              </div>
              {reportTask && (
                <div className="tb-right">
                  {reportTask.status === "Review" && (
                    <button className="btn report" onClick={() => completeReviewed(reportTask)}>
                      <Icon n="Check" s={18} />
                      Mark Complete
                    </button>
                  )}
                  <button
                    className="btn report"
                    onClick={() => setModal({ k: "report", t: reportTask })}
                  >
                    <Icon n="Send" s={18} />
                    Report
                  </button>
                </div>
              )}
            </div>
          )}
          {page}
        </div>
      </main>
      {modal?.k === "assign" && <Assign />}
      {modal?.k === "reassign" && <Reassign t={modal.t} />}
      {modal?.k === "note" && <NoteModal m={modal} />}
      {modal?.k === "team" && teamModal(modal.x)}
      {modal?.k === "report" && <Report t={modal.t} />}
      <ToastHost />
    </div>
  );
}

function ProjList({ projects, prog, pstat, go, s }) {
  const [q, setQ] = useState(""),
    [st, setSt] = useState("All");
  const l = projects.filter((p) =>
    (st === "All" || pstat(p) === st) &&
      (p.name + p.team + p.lead).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="toolbar">
        <div className="search">
          <span><Icon n="Search" s={18} /></span>
          <input
            placeholder="Search projects, teams, members…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select value={st} onChange={(e) => setSt(e.target.value)}>
          {["All", "Pending", "In Progress", "Completed"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="card tbl fix">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>Team</th>
              <th>Lead</th>
              <th>Tasks</th>
              <th>Progress</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {l.map((p) => {
              const t = s.tasks.filter((x) => x.project === p.name);

              return (
                <tr key={p.id} className="cl" onClick={() => go({ p: "projd", id: p.id })}>
                  <td>{p.id}</td>
                  <td><b>{p.name}</b></td>
                  <td>{p.team}</td>
                  <td>{p.lead}</td>
                  <td>{t.filter((x) => x.status === "Completed").length}/{t.length}</td>
                  <td style={{ minWidth: 100 }}><Bar v={prog(p)} /></td>
                  <td>{p.due}</td>
                  <td><Pill v={pstat(p)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!l.length && <p className="mu" style={{ padding: 14 }}>No projects.</p>}
      </div>
    </>
  );
}

export default App;