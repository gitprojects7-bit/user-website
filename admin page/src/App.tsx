// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Columns3,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  MessagesSquare,
  Mic,
  Paperclip,
  Phone,
  Plus,
  Printer,
  Search,
  Square,
  UserCheck,
  UserPlus,
  UserX,
  UsersRound,
  Video,
  Wallet,
  X,
  Zap,
  AtSign,
  Camera,
  Lock,
  LogOut,
  Mail,
  Pencil,
  User,
} from "lucide-react";
import "./style.css";

// ============================================================
// Constants and demo data
// ============================================================

// Frontend demo: nothing is saved to localStorage. Every page refresh starts again
// from the demo data below (only the demo login works until a backend is connected).

// ============================================================
// Icons (lucide-react)
// ============================================================

const LIB = {
  ArrowLeft,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Columns3,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  MessagesSquare,
  Mic,
  Paperclip,
  Phone,
  Plus,
  Printer,
  Search,
  Square,
  UserCheck,
  UserPlus,
  UserX,
  UsersRound,
  Video,
  Wallet,
  X,
  Zap,
  AtSign,
  Camera,
  Lock,
  LogOut,
  Mail,
  Pencil,
  User,
};

function Icon({ n, s = 20 }) {
  const C = LIB[n];
  return C ? <C size={s} strokeWidth={1.8} /> : null;
}

const ST = ["To Do", "In Progress", "Review", "Completed"],
  PEOPLE = [
    "Arun Patel",
    "Rahul Varma",
    "Sneha Rao",
    "Priya Sharma",
    "Maya Chen",
    "Alex Morgan",
    "Chloe Bennett",
    "Karan Mehta",
  ];

const SQ = [
  "Alpha Engineering",
  "Beta Mobile Squad",
  "Core HR & Ops",
  "Analytics & Design",
  "Customer Success",
];

const now = () => new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });

const ini = (n) => n.split(" ").map((x) => x[0]).join("").slice(0, 2);

const fmt = (s) => {
  s = Math.floor(s);
  const h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60);
  return `${h}:${String(m).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
};

// ============================================================
// Invoice helpers
// ============================================================

const money = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// No decimals, Indian grouping (e.g. ₹42,65,000)
const money0 = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const fdate = (s) => {
  if (!s) {
    return "—";
  }
  const d = new Date(s + "T00:00:00");
  return isNaN(d) ? s : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const pad2 = (n) => String(n).padStart(2, "0");

const isoOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

// Indian financial year runs April to March
const fyOf = (iso) => {
  const [y, m] = iso.split("-").map(Number);
  const st = m >= 4 ? y : y - 1;
  return `FY ${st}-${pad2((st + 1) % 100)}`;
};

const FYS = ["FY 2023-24", "FY 2024-25", "FY 2025-26", "FY 2026-27", "FY 2027-28"];

const INV_STATUS = ["Paid", "Pending", "Overdue", "Draft"];

const calc = (items, cg, sg) => {
  const sub = items.reduce((a, i) => a + (Number(i.q) || 0) * (Number(i.r) || 0), 0);
  const c1 = sub * (Number(cg) || 0) / 100,
    s1 = sub * (Number(sg) || 0) / 100;
  return { sub, c1, s1, total: sub + c1 + s1 };
};

const blankParty = { name: "", gst: "", addr: "", phone: "", email: "" };

// Demo company details (pre-filled in the Create invoice form)
const SELLER = {
  name: "Work Flow Technologies Pvt Ltd",
  gst: "33AABCW4821K1Z5",
  addr: "12, Anna Salai, Teynampet, Chennai, Tamil Nadu 600018",
  phone: "+91 98765 43210",
  email: "accounts@workflow.com",
};

// items: [particulars, HSN/SAC, qty, price]
const INV = (no, name, date, fy, items, due, status) => {
  const its = items.map(([p, h, q, r]) => ({ p, h, q: String(q), r: String(r) }));
  const d = no.slice(-4);
  return {
    id: no,
    no,
    fy,
    date,
    due,
    status,
    seller: { ...SELLER },
    buyer: {
      name,
      gst: "33AABC" + d + "F1Z" + (Number(d) % 9 + 1),
      addr: "Plot " + (Number(d) % 90 + 10) + ", Industrial Estate, Chennai, Tamil Nadu 600032",
      phone: "+91 98" + d + " " + String(Number(d) * 37).slice(0, 5),
      email: "accounts@" + name.toLowerCase().replace(/[^a-z]/g, "") + ".in",
    },
    items: its,
    cgst: "9",
    sgst: "9",
    total: calc(its, "9", "9").total,
    by: "Arun Patel",
  };
};

// Each task has its own description (shown on the task details page)
const DEF_DESC = "Deliver per acceptance checklist and update the team.";

const TDESC = {
  "TASK-1042":
    "Build a REST endpoint that exports invoices as PDF and CSV, with date range and status filters.",
  "TASK-1043":
    "Set up USD, EUR and INR billing with live rate caching and a currency selector on every invoice.",
  "TASK-1044":
    "Compile sprint highlights, demo outcomes and open action items for the sprint review meeting.",
  "TASK-1045":
    "Add push notification triggers for task assignments, due-date reminders and approval requests.",
  "TASK-1046":
    "Create a step-by-step onboarding checklist wizard for new joiners with progress tracking.",
  "TASK-1047":
    "Build an ARR cohort retention chart for the executive analytics dashboard.",
  "TASK-1039":
    "Integrate OAuth2 Google sign-in with token refresh and secure session handling.",
  "TASK-1048":
    "Design the client onboarding screens: welcome, company profile and first project setup.",
  "TASK-1049":
    "Set up a CI pipeline that builds and signs the iOS and Android test builds on every merge.",
  "TASK-1050":
    "Implement the leave balance calculation with carry-forward and holiday calendar rules.",
  "TASK-1051":
    "Write unit tests for the GST tax rule engine covering CGST, SGST and IGST cases.",
  "TASK-1052":
    "Finalise the executive KPI dashboard layout with revenue, churn and pipeline widgets.",
  "TASK-1053":
    "Build the payroll audit report export with department-wise filters and CSV download.",
  "TASK-1054":
    "Add a customer feedback form with rating, category and optional attachment upload.",
  "TASK-1038":
    "Review the billing database schema, indexes and migration scripts before release.",
};

const T = (id, title, project, assignee, by, priority, due, status, secs = 0) =>
  (
    {
      id,
      title,
      project,
      assignee,
      by,
      priority,
      due,
      status,
      desc: TDESC[id] || DEF_DESC,
      secs,
      log: [{ t: "01/11/26", txt: "Task assigned by " + by }],
      reports: [],
      checklist: [],
    }
  );

const seed = {
  user: null,
  projects: [
    {
      id: "P-1",
      name: "Billing Platform",
      desc: "Multi-currency billing with tax automation.",
      lead: "Arun Patel",
      team: SQ[0],
      members: ["Arun Patel", "Rahul Varma", "Sneha Rao", "Alex Morgan"],
      due: "2026-12-20",
      status: "In Progress",
    },
    {
      id: "P-2",
      name: "Mobile App",
      desc: "iOS and Android approvals app.",
      lead: "Priya Sharma",
      team: SQ[1],
      members: ["Priya Sharma", "Arun Patel", "Karan Mehta"],
      due: "2026-12-05",
      status: "In Progress",
    },
    {
      id: "P-3",
      name: "HR Management",
      desc: "Leave, timesheets and payroll audit.",
      lead: "Maya Chen",
      team: SQ[2],
      members: ["Maya Chen", "Arun Patel"],
      due: "2027-01-10",
      status: "Pending",
    },
    {
      id: "P-4",
      name: "Analytics Dashboard",
      desc: "Executive metrics and forecasts.",
      lead: "Arun Patel",
      team: SQ[3],
      members: ["Arun Patel", "Chloe Bennett"],
      due: "2027-01-25",
      status: "In Progress",
    },
    {
      id: "P-5",
      name: "Customer Portal",
      desc: "Self-service portal for client onboarding and feedback.",
      lead: "Karan Mehta",
      team: SQ[4],
      members: ["Karan Mehta", "Sneha Rao", "Alex Morgan", "Chloe Bennett"],
      due: "2027-02-15",
      status: "In Progress",
    },
  ],
  tasks: [
    T(
      "TASK-1042",
      "Implement invoice export endpoint",
      "Billing Platform",
      "Rahul Varma",
      "Arun Patel",
      "High",
      "2026-11-15",
      "In Progress",
      2538,
    ),
    {
      ...T(
        "TASK-1043",
        "Configure multi-currency billing",
        "Billing Platform",
        "Sneha Rao",
        "Arun Patel",
        "High",
        "2026-11-10",
        "Review",
        2320,
      ),
      // Demo report as the team lead would submit it
      reports: [
        {
          cat: "Task Progress",
          at: "11/11/26, 10:30 AM",
          by: "Sneha Rao",
          desc: "Multi-currency billing is configured for USD, EUR and INR with live rate caching.",
          sum: "Rate cache and currency selector done. Invoice totals convert correctly.",
          block: "Waiting for finance to confirm the rounding rules.",
          act: "Review the conversion logic and approve for release.",
          file: "",
        },
      ],
    },
    T(
      "TASK-1044",
      "Prepare sprint review notes",
      "Billing Platform",
      "Arun Patel",
      "Arun Patel",
      "Medium",
      "2026-11-12",
      "To Do",
    ),
    T(
      "TASK-1045",
      "Push notification triggers",
      "Mobile App",
      "Arun Patel",
      "Priya Sharma",
      "High",
      "2026-11-18",
      "In Progress",
      3300,
    ),
    T(
      "TASK-1046",
      "Onboarding checklist wizard",
      "HR Management",
      "Arun Patel",
      "Maya Chen",
      "Medium",
      "2026-11-20",
      "To Do",
    ),
    T(
      "TASK-1047",
      "ARR cohort chart",
      "Analytics Dashboard",
      "Chloe Bennett",
      "Arun Patel",
      "Low",
      "2026-11-25",
      "To Do",
    ),
    T(
      "TASK-1039",
      "OAuth2 Google login",
      "Billing Platform",
      "Alex Morgan",
      "Arun Patel",
      "High",
      "2026-10-30",
      "Completed",
      4500,
    ),
    T(
      "TASK-1048",
      "Design client onboarding screens",
      "Customer Portal",
      "Chloe Bennett",
      "Karan Mehta",
      "Medium",
      "2026-11-22",
      "In Progress",
      1860,
    ),
    {
      ...T(
        "TASK-1049",
        "Set up CI pipeline for mobile builds",
        "Mobile App",
        "Karan Mehta",
        "Priya Sharma",
        "High",
        "2026-11-16",
        "Review",
        5400,
      ),
      reports: [
        {
          cat: "Task Progress",
          at: "11/17/26, 04:15 PM",
          by: "Karan Mehta",
          desc: "CI pipeline now builds, signs and uploads iOS and Android test builds on every merge to main.",
          sum: "Pipeline runs in about 9 minutes. Signing keys are stored as encrypted secrets.",
          block: "Android keystore rotation is pending approval from the security team.",
          act: "Approve the pipeline and schedule the keystore rotation for next sprint.",
          file: "ci-pipeline-run.log",
        },
      ],
    },
    T(
      "TASK-1050",
      "Leave balance calculation module",
      "HR Management",
      "Maya Chen",
      "Arun Patel",
      "Medium",
      "2026-11-28",
      "In Progress",
      2700,
    ),
    T(
      "TASK-1051",
      "Tax rule engine unit tests",
      "Billing Platform",
      "Alex Morgan",
      "Arun Patel",
      "Low",
      "2026-12-02",
      "To Do",
    ),
    T(
      "TASK-1052",
      "Executive KPI dashboard layout",
      "Analytics Dashboard",
      "Chloe Bennett",
      "Arun Patel",
      "High",
      "2026-11-14",
      "Completed",
      7200,
    ),
    {
      ...T(
        "TASK-1053",
        "Payroll audit report export",
        "HR Management",
        "Arun Patel",
        "Maya Chen",
        "High",
        "2026-11-26",
        "Review",
        3900,
      ),
      reports: [
        {
          cat: "Completion Report",
          at: "11/18/26, 11:05 AM",
          by: "Arun Patel",
          desc: "Payroll audit export is ready with department filters and CSV download.",
          sum: "Tested with 1,200 sample records. Export finishes in under 3 seconds.",
          block: "No blockers.",
          act: "Review the CSV column order and approve for release.",
          file: "",
        },
      ],
    },
    T(
      "TASK-1054",
      "Customer feedback form",
      "Customer Portal",
      "Sneha Rao",
      "Karan Mehta",
      "Low",
      "2026-12-05",
      "To Do",
    ),
    T(
      "TASK-1038",
      "Database schema review",
      "Billing Platform",
      "Rahul Varma",
      "Arun Patel",
      "Medium",
      "2026-10-25",
      "Completed",
      3600,
    ),
  ],
  invoices: [
    INV("INV-2026-1059", "Nilgiri Tea Company", "2026-11-17", "FY 2026-27", [
      ["Website redesign - phase 1", "9983", 1, 85000],
    ], "2026-12-17", "Draft"),
    INV("INV-2026-1058", "Orbit Retail Pvt Ltd", "2026-11-14", "FY 2026-27", [
      ["Inventory app development", "9983", 1, 145000],
      ["Cloud hosting (3 months)", "998315", 3, 6500],
    ], "2026-12-14", "Pending"),
    INV("INV-2026-1057", "Greenleaf Foods", "2026-11-06", "FY 2026-27", [
      ["Billing software licence", "997331", 5, 12000],
      ["Onboarding and training", "9992", 1, 18000],
    ], "2026-12-06", "Paid"),
    INV("INV-2026-1056", "Kaveri Textiles", "2026-10-22", "FY 2026-27", [
      ["ERP integration support", "9983", 1, 92000],
    ], "2026-11-21", "Pending"),
    INV("INV-2026-1055", "Sundaram Logistics", "2026-10-10", "FY 2026-27", [
      ["Fleet tracking dashboard", "9983", 1, 128000],
      ["Mobile app maintenance", "9987", 2, 15000],
    ], "2026-11-09", "Overdue"),
    INV("INV-2026-1054", "Bluewave Systems", "2026-09-19", "FY 2026-27", [
      ["API development", "9983", 1, 76000],
    ], "2026-10-19", "Overdue"),
    INV("INV-2026-1053", "Madurai Silks", "2026-09-02", "FY 2026-27", [
      ["E-commerce maintenance", "9987", 3, 14000],
    ], "2026-10-02", "Paid"),
    INV("INV-2026-1052", "Zenith Clinics", "2026-08-12", "FY 2026-27", [
      ["Appointment booking module", "9983", 1, 98000],
      ["SMS gateway setup", "9983", 1, 9500],
    ], "2026-09-11", "Paid"),
    INV("INV-2026-1051", "Lotus Interiors", "2026-07-21", "FY 2026-27", [
      ["Portfolio website", "9983", 1, 54000],
    ], "2026-08-20", "Paid"),
    INV("INV-2026-1050", "Annapurna Caterers", "2026-06-15", "FY 2026-27", [
      ["Order management system", "9983", 1, 110000],
    ], "2026-07-15", "Paid"),
    INV("INV-2026-1049", "Coastal Ventures", "2026-05-08", "FY 2026-27", [
      ["Annual support contract", "9987", 1, 60000],
    ], "2026-06-07", "Paid"),
    INV("INV-2025-1048", "Northstar Studio", "2025-05-18", "FY 2025-26", [
      ["Brand website", "9983", 1, 72000],
      ["Content migration", "9983", 1, 14000],
    ], "2025-06-17", "Paid"),
    INV("INV-2025-1046", "Meridian Health Co.", "2025-05-12", "FY 2025-26", [
      ["Patient portal development", "9983", 1, 135000],
    ], "2025-06-11", "Overdue"),
    INV("INV-2025-1042", "Aster & Finch", "2025-04-22", "FY 2025-26", [
      ["UI/UX design package", "9983", 1, 48000],
    ], "2025-05-22", "Paid"),
    INV("INV-2025-1040", "Juniper & Stone", "2025-03-28", "FY 2024-25", [
      ["Marketing site", "9983", 1, 39000],
    ], "2025-04-27", "Paid"),
  ],
  company: { ...blankParty },
  msgs: {
    "#alpha-engineering": [
      { u: "Sneha Rao", x: "Currency cache is live on staging.", t: "09:40" },
      { u: "Arun Patel", x: "Great. Please add the rounding notes to the task.", t: "09:52" },
      { u: "Rahul Varma", x: "Export endpoint will be ready for review by evening.", t: "10:15" },
    ],
    "#beta-mobile": [
      { u: "Priya Sharma", x: "Test builds are on TestFlight.", t: "10:05" },
      { u: "Karan Mehta", x: "CI pipeline is green on main.", t: "10:30" },
    ],
    "#billing-platform": [
      { u: "Alex Morgan", x: "Tax engine tests start tomorrow.", t: "11:10" },
      { u: "Arun Patel", x: "Sprint review is on Friday at 4 PM.", t: "11:20" },
    ],
    "Rahul Varma": [
      { u: "Rahul Varma", x: "Export endpoint almost done.", t: "09:45" },
      { u: "Arun Patel", x: "Thanks, ping me once it is on staging.", t: "09:50" },
    ],
    "Priya Sharma": [{ u: "Priya Sharma", x: "Can you review the CI report today?", t: "10:40" }],
    "Sneha Rao": [{ u: "Sneha Rao", x: "Submitted TASK-1043 for review.", t: "Yesterday" }],
    "Maya Chen": [{ u: "Maya Chen", x: "Please check the payroll audit export.", t: "11:35" }],
    "Karan Mehta": [],
  },
  notifs: [
    {
      id: 1,
      txt: "Task TASK-1044 assigned to you",
      cat: "Task Assigned",
      task: "TASK-1044",
      un: true,
      t: "10m ago",
    },
    {
      id: 2,
      txt: "Billing Platform reached 60% progress",
      cat: "Project Updates",
      un: true,
      t: "1h ago",
    },
    {
      id: 3,
      txt: "Sneha Rao submitted TASK-1043 for review",
      cat: "Task Review",
      task: "TASK-1043",
      un: false,
      t: "Yesterday",
    },
    {
      id: 4,
      txt: "Karan Mehta submitted TASK-1049 for review",
      cat: "Task Review",
      task: "TASK-1049",
      un: true,
      t: "Yesterday",
    },
    {
      id: 5,
      txt: "Arun Patel submitted TASK-1053 for review",
      cat: "Task Review",
      task: "TASK-1053",
      un: true,
      t: "2h ago",
    },
    {
      id: 6,
      txt: "Invoice INV-2026-1055 for Sundaram Logistics is overdue",
      cat: "Invoice",
      un: false,
      t: "2 days ago",
    },
  ],
};

// Always start from a fresh copy of the demo data (nothing is read from localStorage)
const load = () => JSON.parse(JSON.stringify(seed));

// Accounts created through Sign Up live only in memory until the page is refreshed
let ACCS = [];

const USERS_BASE = PEOPLE.map((n) => ({
  name: n,
  email: n.toLowerCase().replace(/ /g, ".") + "@workflow.com",
  username: n.split(" ")[0].toLowerCase(),
}));

function getUsers() {
  const extra = ACCS
    .filter((x) => !USERS_BASE.some((b) => b.email === x.email))
    .map((x) => ({ name: x.name, email: x.email, username: x.user }));
  return [...USERS_BASE, ...extra];
}

// Unique people across every project
const allMembers = (projects) => [...new Set(projects.flatMap((p) => p.members))];

// Demo presence: the logged-in admin is always online, everyone else is derived from the name
const presence = (name, me) => {
  if (name === me) {
    return "Online";
  }
  const sum = [...name].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return sum % 3 === 0 ? "Offline" : "Online";
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

const Pill = ({ v }) => <span className={"pill " + v.split(" ")[0]}>{v}</span>;

const Bar = ({ v }) => <div className="bar"><i style={{ width: v + "%" }} /></div>;

// Row of metric cards. items: [icon, label, value, optional small text]
function Metrics({ items }) {
  return (
    <div className="mtr" style={{ "--n": items.length }}>
      {items.map(([ic, a, b, sub]) => (
        <div key={a} className="card stat sm">
          <i className="ic"><Icon n={ic} s={22} /></i>
          <div>
            <span>{a}</span>
            <b>{b}</b>
            {sub !== undefined && <small>{sub}</small>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Back button + page title on one line; optional actions sit on the right
function PageHead({ c, title, children }) {
  return (
    <div className="phead">
      <button className="btn sec sm back" onClick={c.back}>
        <Icon n="ArrowLeft" s={16} />
        Back
      </button>
      <h2 className="t">{title}</h2>
      {children && <div className="phr">{children}</div>}
    </div>
  );
}

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
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const accs = () => ACCS;
  const login = (u) =>
    c.up((d) => {
      d.user = u;
    });
  const to = (n) => {
    setErr("");
    setStep(n);
  };
  const steps = ["details", "otp", "cred"],
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
      return login({
        name: "Arun Patel",
        email: "abc@gmail.com",
        phone: "+91 98765 43210",
        user: "arun.patel",
        pw: "123456",
      });
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
    const u = {
      name: f.name,
      addr: f.addr,
      phone: f.phone,
      email: f.email,
      user: f.user.trim(),
      pw: f.pw1,
    };
    ACCS = [...ACCS, u];
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
        <b style={{ letterSpacing: ".12em", fontSize: 12 }}>WORK FLOW ADMIN</b>
        <h1>Welcome to<br />Work Flow</h1>
        <p>Manage your projects, teams and tasks from one admin panel.</p>
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
        </div>
      </div>
    </div>
  );
}

function Chat({ c, kind }) {
  const chans = kind === "chat"
    ? ["#alpha-engineering", "#beta-mobile", "#billing-platform"]
    : PEOPLE.filter((p) => p !== c.u.name);
  const [a, setA] = useState(chans[0]),
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

// ============================================================
// Invoice pages
// ============================================================

function InvoiceList({ c }) {
  const [q, setQ] = useState(""),
    [fy, setFy] = useState("All"),
    [st, setSt] = useState("All");
  const invs = c.s.invoices || [];
  const years = [...new Set(invs.map((i) => i.fy))].sort().reverse();
  const list = invs.filter((i) =>
    (fy === "All" || i.fy === fy) &&
      (st === "All" || i.status === st) &&
      (i.no + " " + i.buyer.name).toLowerCase().includes(q.toLowerCase()));

  const by = (x) => invs.filter((i) => i.status === x);
  const amt = (arr) => money0(arr.reduce((a, i) => a + i.total, 0));
  const metrics = [
    ["FileText", "Total Invoices", invs.length, amt(invs)],
    ["Clock", "Pending", by("Pending").length, amt(by("Pending"))],
    ["Bell", "Overdue", by("Overdue").length, amt(by("Overdue"))],
    ["Check", "Paid", by("Paid").length, amt(by("Paid"))],
  ];

  return (
    <div className="grid fit">
      <PageHead c={c} title="Invoices" />
      <Metrics items={metrics} />
      <div className="toolbar invtb">
        <div className="search">
          <span><Icon n="Search" s={18} /></span>
          <input
            placeholder="Search invoice no., client…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select value={fy} onChange={(e) => setFy(e.target.value)}>
          <option value="All">All financial years</option>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
        <select value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="All">All statuses</option>
          {INV_STATUS.map((x) => <option key={x}>{x}</option>)}
        </select>
        <button className="btn" onClick={() => c.go({ p: "invoicenew" })}>
          <Icon n="Plus" s={18} />
          Create invoice
        </button>
      </div>
      <div className="card tbl fix">
        <table>
          <thead>
            <tr>
              <th>Invoice no.</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Financial year</th>
              <th className="num">Amount</th>
              <th>Due date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((i) => (
              <tr key={i.id} className="cl" onClick={() => c.go({ p: "invoiced", id: i.id })}>
                <td className="invno">{i.no}</td>
                <td><b>{i.buyer.name}</b></td>
                <td>{fdate(i.date)}</td>
                <td>{i.fy}</td>
                <td className="num"><b>{money(i.total)}</b></td>
                <td>{fdate(i.due)}</td>
                <td><Pill v={i.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="mu" style={{ padding: 14 }}>No invoices found.</p>}
      </div>
    </div>
  );
}

function InvoiceForm({ c, edit }) {
  const invs = c.s.invoices || [];
  const nextNo = (fy) => {
    const seq = Math.max(1000, ...invs.map((i) => parseInt(String(i.no).slice(-4)) || 0)) + 1;
    return `INV-${fy.slice(3, 7)}-${seq}`;
  };

  const [f, setF] = useState(() => {
    if (edit) {
      return {
        fy: edit.fy,
        no: edit.no,
        date: edit.date,
        due: edit.due,
        seller: { ...edit.seller },
        buyer: { ...edit.buyer },
        items: edit.items.map((x) => ({ ...x })),
        cgst: edit.cgst,
        sgst: edit.sgst,
      };
    }
    const d = new Date(),
      dd = new Date();
    dd.setDate(dd.getDate() + 30);
    const date = isoOf(d),
      fy = fyOf(date);
    return {
      fy,
      no: nextNo(fy),
      date,
      due: isoOf(dd),
      seller: { ...blankParty },
      buyer: { ...blankParty },
      items: [1, 2, 3].map(() => ({ p: "", h: "9983", q: "1", r: "" })),
      cgst: "9",
      sgst: "9",
    };
  });
  const [err, setErr] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const party = (w, k) => (e) => setF({ ...f, [w]: { ...f[w], [k]: e.target.value } });
  const item = (i, k) => (e) =>
    setF({ ...f, items: f.items.map((x, j) => j === i ? { ...x, [k]: e.target.value } : x) });

  const setFy = (e) => {
    const fy = e.target.value;
    setF({ ...f, fy, no: edit ? f.no : nextNo(fy) });
  };
  const setDate = (e) => {
    const date = e.target.value;
    const fy = date ? fyOf(date) : f.fy;
    setF({ ...f, date, fy, no: edit || fy === f.fy ? f.no : nextNo(fy) });
  };

  const t = calc(f.items, f.cgst, f.sgst);

  const save = (status) => {
    const items = f.items.filter((x) => x.p.trim() || Number(x.r));
    const no = f.no.trim();
    if (!no) {
      return setErr("Enter an invoice number.");
    }
    if (!f.buyer.name.trim()) {
      return setErr("Enter the customer name.");
    }
    if (status !== "Draft" && !f.seller.name.trim()) {
      return setErr("Enter your company name.");
    }
    if (!items.length) {
      return setErr("Add at least one line item.");
    }
    if (items.some((x) => !x.p.trim())) {
      return setErr("Every line item needs particulars.");
    }
    if (f.due && f.date && f.due < f.date) {
      return setErr("Due date cannot be before the invoice date.");
    }
    if (invs.some((i) => i.no === no && i.id !== edit?.id)) {
      return setErr("That invoice number already exists.");
    }
    const tt = calc(items, f.cgst, f.sgst);
    const inv = {
      id: edit ? edit.id : no,
      no,
      fy: f.fy,
      date: f.date,
      due: f.due,
      status,
      seller: f.seller,
      buyer: f.buyer,
      items,
      cgst: f.cgst,
      sgst: f.sgst,
      total: tt.total,
      by: edit?.by || c.u.name,
    };
    c.up((d) => {
      d.invoices = d.invoices || [];
      const k = d.invoices.findIndex((x) => x.id === inv.id);
      if (k >= 0) {
        d.invoices[k] = inv;
      } else {
        d.invoices.unshift(inv);
      }
      d.company = f.seller;
      if (status !== "Draft") {
        d.notifs.unshift({
          id: Date.now() + Math.random(),
          txt: `Invoice ${no} generated for ${inv.buyer.name}`,
          cat: "Invoice",
          un: true,
          t: "just now",
        });
      }
    });
    c.toast(status === "Draft" ? "Draft saved" : "Invoice generated");
    if (status === "Draft") {
      c.back();
    } else {
      c.replace({ p: "invoiced", id: inv.id });
    }
  };

  // Plain function (not a component) so inputs keep focus while typing
  const partyFields = (w) => (
    <div className="fg">
      <label>
        {w === "seller" ? "Company name" : "Customer name"}
        <input
          placeholder={w === "seller" ? "Company name" : "Customer or company"}
          value={f[w].name}
          onChange={party(w, "name")}
        />
      </label>
      <label>
        GST
        <input placeholder="GST number" value={f[w].gst} onChange={party(w, "gst")} />
      </label>
      <label className="full">
        Address
        <input
          placeholder="Street, city, state, postal code"
          value={f[w].addr}
          onChange={party(w, "addr")}
        />
      </label>
      <label>
        Phone
        <input placeholder="Phone number" value={f[w].phone} onChange={party(w, "phone")} />
      </label>
      <label>
        Email
        <input
          type="email"
          placeholder="Email address"
          value={f[w].email}
          onChange={party(w, "email")}
        />
      </label>
    </div>
  );

  return (
    <div className="grid fit">
      <PageHead c={c} title={edit ? "Edit draft invoice" : "Create invoice"} />
      <form
        className="invf"
        onSubmit={(e) => {
          e.preventDefault();
          save("Pending");
        }}
      >
        {/* Row 1: invoice details across the full width */}
        <div className="card invdet">
          <h3>Invoice details</h3>
          <div className="fg fg4">
            <label>
              Financial year
              <select value={f.fy} onChange={setFy}>
                {FYS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </label>
            <label>
              Invoice no.
              <input value={f.no} onChange={set("no")} />
            </label>
            <label>
              Invoice date
              <input type="date" value={f.date} onChange={setDate} />
            </label>
            <label>
              Due date
              <input type="date" value={f.due} onChange={set("due")} />
            </label>
          </div>
        </div>

        {/* Row 2 left: seller on top, bill to below */}
        <div className="invl">
          <div className="card">
            <h3>Seller / company details</h3>
            {partyFields("seller")}
          </div>
          <div className="card">
            <h3>Bill to</h3>
            {partyFields("buyer")}
          </div>
        </div>

        {/* Row 2 right: line items and totals */}
        <div className="card invr">
          <div className="row sp" style={{ marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Line items</h3>
            <span className="mu">Amounts shown in INR</span>
          </div>
          <div className="liscr">
            <div className="li">
              <table>
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Particulars</th>
                    <th>HSN/SAC</th>
                    <th>Qty</th>
                    <th className="num">Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {f.items.map((it, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <input
                          placeholder="Description"
                          value={it.p}
                          onChange={item(i, "p")}
                        />
                      </td>
                      <td><input value={it.h} onChange={item(i, "h")} /></td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={it.q}
                          onChange={item(i, "q")}
                        />
                      </td>
                      <td>
                        <input
                          className="r"
                          type="number"
                          min="0"
                          step="any"
                          placeholder="0"
                          value={it.r}
                          onChange={item(i, "r")}
                        />
                      </td>
                      <td style={{ width: 36 }}>
                        {f.items.length > 1 && (
                          <button
                            type="button"
                            className="link"
                            aria-label="Remove item"
                            onClick={() =>
                              setF({ ...f, items: f.items.filter((_, j) => j !== i) })}
                          >
                            <Icon n="X" s={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="btn sm sec"
              style={{ marginTop: 10 }}
              onClick={() =>
                setF({ ...f, items: [...f.items, { p: "", h: "9983", q: "1", r: "" }] })}
            >
              <Icon n="Plus" s={16} />
              Add item
            </button>
          </div>
          <div className="itot">
            <div className="tr"><span>Sub total</span><b>{money(t.sub)}</b></div>
            <div className="tr">
              <span className="pc">
                CGST
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={f.cgst}
                  onChange={set("cgst")}
                />
                %
              </span>
              <b>{money(t.c1)}</b>
            </div>
            <div className="tr">
              <span className="pc">
                SGST
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={f.sgst}
                  onChange={set("sgst")}
                />
                %
              </span>
              <b>{money(t.s1)}</b>
            </div>
            <div className="tr grand"><span>Total Amount</span><span>{money(t.total)}</span></div>
          </div>
        </div>

        {/* Row 3: Save draft under the left column, Generate invoice under the right */}
        <div className="invact">
          <div className="al">
            {err && <div className="err">{err}</div>}
            <button type="button" className="btn sec" onClick={() => save("Draft")}>
              Save draft
            </button>
          </div>
          <div className="ar">
            <button className="btn">Generate invoice</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function InvoiceView({ c, id }) {
  const inv = (c.s.invoices || []).find((x) => x.id === id);
  if (!inv) {
    return <div className="card">Invoice not found.</div>;
  }
  const t = calc(inv.items, inv.cgst, inv.sgst);

  // Browser print dialog doubles as "Save as PDF"; the title becomes the file name
  const print = (hint) => {
    const old = document.title;
    document.title = inv.no;
    const restore = () => {
      document.title = old;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    if (hint) {
      c.toast("In the print window, choose “Save as PDF” as the destination");
    }
    setTimeout(() => window.print(), hint ? 400 : 0);
  };

  const who = (p, fb) => (
    <>
      <b>{p.name || fb}</b>
      {p.addr && <div>{p.addr}</div>}
      {p.gst && <div>GST: {p.gst}</div>}
      {p.phone && <div>{p.phone}</div>}
      {p.email && <div>{p.email}</div>}
    </>
  );

  return (
    <div className="grid">
      <div className="row sp noprint">
        <div className="row" style={{ gap: 14, flexWrap: "nowrap" }}>
          <button className="btn sec sm" onClick={c.back}>
            <Icon n="ArrowLeft" s={16} />
            Back
          </button>
          <div>
            <span className="mu">Invoice · {inv.fy}</span>
            <h2 className="t">{inv.no}</h2>
          </div>
        </div>
        <span className="row">
          <Pill v={inv.status} />
          {inv.status === "Draft" && (
            <button
              className="btn sec sm"
              onClick={() => c.go({ p: "invoicenew", id: inv.id })}
            >
              Edit draft
            </button>
          )}
          {inv.status !== "Paid" && inv.status !== "Draft" && (
            <button
              className="btn sec sm"
              onClick={() => {
                c.up((d) => {
                  d.invoices.find((x) => x.id === inv.id).status = "Paid";
                });
                c.toast("Marked as paid");
              }}
            >
              <Icon n="Check" s={16} />
              Mark as paid
            </button>
          )}
          <button className="btn sec sm" onClick={() => print(false)}>
            <Icon n="Printer" s={16} />
            Print
          </button>
          <button className="btn sm" onClick={() => print(true)}>
            <Icon n="Download" s={16} />
            Download PDF
          </button>
        </span>
      </div>

      <div className="card inv-doc">
        <div className="inv-top">
          <div>
            <h1>INVOICE</h1>
            <span className="mu">{inv.no}</span>
          </div>
          <div className="inv-meta">
            <span>Invoice date: <b>{fdate(inv.date)}</b></span>
            <span>Due date: <b>{fdate(inv.due)}</b></span>
            <span>Financial year: <b>{inv.fy}</b></span>
            <span>Status: <b>{inv.status}</b></span>
          </div>
        </div>
        <div className="inv-parties">
          <div>
            <span className="cap mu">FROM</span>
            {who(inv.seller, "—")}
          </div>
          <div>
            <span className="cap mu">BILL TO</span>
            {who(inv.buyer, "—")}
          </div>
        </div>
        <table className="inv-tbl">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Particulars</th>
              <th>HSN/SAC</th>
              <th className="num">Qty</th>
              <th className="num">Price</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((it, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{it.p}</td>
                <td>{it.h}</td>
                <td className="num">{it.q}</td>
                <td className="num">{money(it.r)}</td>
                <td className="num">{money((Number(it.q) || 0) * (Number(it.r) || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="itot">
          <div className="tr"><span>Sub total</span><b>{money(t.sub)}</b></div>
          <div className="tr"><span>CGST ({Number(inv.cgst) || 0}%)</span><b>{money(t.c1)}</b></div>
          <div className="tr"><span>SGST ({Number(inv.sgst) || 0}%)</span><b>{money(t.s1)}</b></div>
          <div className="tr grand"><span>Total Amount</span><span>{money(t.total)}</span></div>
        </div>
        <p className="mu" style={{ marginBottom: 0, fontSize: 12 }}>
          Amounts shown in INR. This is a computer generated invoice.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Overview page
// ============================================================

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const Ring = ({ v, size = 38 }) => {
  const r = 15,
    len = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle className="rg-bg" cx="20" cy="20" r={r} />
      <circle
        className="rg-fg"
        cx="20"
        cy="20"
        r={r}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - v / 100)}
        transform="rotate(-90 20 20)"
      />
      <text className="rg-tx" x="20" y="23.2" textAnchor="middle">{v}%</text>
    </svg>
  );
};

// Sizes itself to whatever container it sits in, so the chart always fills the card
function LineChart({ vals, labels }) {
  const ref = useRef(null);
  const [sz, setSz] = useState({ w: 600, h: 190 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return;
    }
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      if (r.width > 0 && r.height > 0) {
        setSz({ w: Math.round(r.width), h: Math.round(r.height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = sz.w,
    H = sz.h,
    pl = 54,
    pr = 16,
    pt = 12,
    pb = 28;
  const mx = Math.max(...vals, 1);
  const rough = mx / 4,
    mag = Math.pow(10, Math.floor(Math.log10(rough))),
    nr = rough / mag;
  const step = (nr <= 1 ? 1 : nr <= 2 ? 2 : nr <= 5 ? 5 : 10) * mag;
  const n = Math.max(1, Math.ceil(mx / step));
  const top = step * n;
  const x = (i) => pl + i * (W - pl - pr) / Math.max(1, vals.length - 1);
  const y = (v) => pt + (1 - v / top) * (H - pt - pb);
  const pts = vals.map((v, i) => [x(i), y(v)]);
  const line = pts
    .map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1))
    .join(" ");
  const area = `${line} L${x(vals.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
  const lbl = (v) =>
    v === 0 ? "₹0" : "₹" + (v >= 100000 ? v / 100000 + "L" : v >= 1000 ? v / 1000 + "k" : v);
  const ticks = Array.from({ length: n + 1 }, (_, i) => step * i);

  return (
    <div ref={ref} className="chartbox">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {ticks.map((v) => (
          <g key={v}>
            <line className="ch-grid" x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} />
            <text className="ch-lbl" x={pl - 8} y={y(v) + 4} textAnchor="end">{lbl(v)}</text>
          </g>
        ))}
        <path className="ch-area" d={area} />
        <path className="ch-line" d={line} />
        {pts.map((q, i) => (
          <circle key={i} className="ch-dot" cx={q[0]} cy={q[1]} r="3.5">
            <title>{labels[i]}: {money(vals[i])}</title>
          </circle>
        ))}
        {labels.map((l, i) => (
          <text key={l} className="ch-lbl" x={x(i)} y={H - 8} textAnchor="middle">{l}</text>
        ))}
      </svg>
    </div>
  );
}

function Overview({ c, setModal, prog }) {
  const { s, go } = c;
  const invs = s.invoices || [];
  const live = invs.filter((i) => i.status !== "Draft");
  const [fy, setFy] = useState(() => {
    const last = live.map((i) => i.date).sort().pop();
    return fyOf(last || isoOf(new Date()));
  });

  const sum = (arr) => arr.reduce((a, i) => a + i.total, 0);
  const ym = isoOf(new Date()).slice(0, 7);

  const stats = [
    ["FileText", "Invoices This Month", money0(sum(live.filter((i) => i.date.startsWith(ym))))],
    [
      "Clock",
      "Outstanding",
      money0(sum(live.filter((i) => i.status === "Pending" || i.status === "Overdue"))),
    ],
    ["FolderKanban", "Total Projects", s.projects.length],
    ["UsersRound", "Total Team Members", allMembers(s.projects).length],
    ["Eye", "Under Review", s.tasks.filter((t) => t.status === "Review").length],
  ];

  const st0 = Number(fy.slice(3, 7));
  const keys = MONTHS.map((_, k) => `${k < 9 ? st0 : st0 + 1}-${pad2((k + 3) % 12 + 1)}`);
  const vals = keys.map((k) => sum(live.filter((i) => i.date.startsWith(k))));

  const actions = [
    ["Plus", "Create Project", "Start a new project", () => setModal({ k: "proj" })],
    ["UserPlus", "Assign Task", "Delegate work to a member", () => setModal({ k: "assign" })],
    ["FileText", "Create Invoice", "Generate a new invoice", () => go({ p: "invoicenew" })],
    ["Columns3", "View Team Board", "Kanban of all tasks", () => go({ p: "board" })],
  ];

  const rows = [
    ...[...invs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8)
      .map((i) => ({
        k: "inv-" + i.id,
        act: "Invoice " + i.no,
        who: i.buyer.name,
        owner: i.by || "Admin",
        upd: fdate(i.date),
        st: i.status,
        open: () => go({ p: "invoiced", id: i.id }),
      })),
    ...s.tasks.map((t) => ({
      k: t.id,
      act: t.title,
      who: t.project,
      owner: t.assignee,
      upd: t.log.length ? t.log[t.log.length - 1].t : "—",
      st: t.status,
      open: () => go({ p: "taskd", id: t.id }),
    })),
  ];

  return (
    <div className="grid ovw">
      <h2 className="t">Overview</h2>

      <Metrics items={stats} />

      <div className="ovmid">
        <div className="card">
          <div className="chd">
            <b>Monthly Overview</b>
            <select value={fy} onChange={(e) => setFy(e.target.value)}>
              {FYS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="scr chart"><LineChart vals={vals} labels={MONTHS} /></div>
        </div>

        <div className="card">
          <div className="chd"><b>Project Progress</b></div>
          <div className="scr">
            {s.projects.map((x) => (
              <div key={x.id} className="prr" onClick={() => go({ p: "projd", id: x.id })}>
                <span>{x.name}</span>
                <Ring v={prog(x)} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="chd"><b>Quick Actions</b></div>
          <div className="qcol scr">
            {actions.map(([i, a, b, fn]) => (
              <button key={a} className="qbtn" onClick={fn}>
                <i><Icon n={i} s={18} /></i>
                <span><b>{a}</b><small>{b}</small></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card act">
        <b className="acth">Recent Activity</b>
        <div className="actscr">
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Project / Client</th>
                <th>Owner</th>
                <th>Updated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className="cl" onClick={r.open}>
                  <td><b>{r.act}</b></td>
                  <td>{r.who}</td>
                  <td>{r.owner}</td>
                  <td>{r.upd}</td>
                  <td><Pill v={r.st} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
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
    if (ACCS.some((x) => x.email !== u.email && (x.user === user || x.email === email))) {
      return setErr("That username or email is already registered.");
    }
    const next = { name, phone, email, user, pw: f.pw };
    ACCS = ACCS.map((x) => x.email === u.email ? { ...x, ...next } : x);
    c.up((d) => {
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
    <div className="grid fit">
      <PageHead c={c} title="Profile" />
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
    </div>
  );
}

// Pages that must never scroll as a whole (only their inner lists scroll)
const FIT_PAGES = [
  "profile",
  "invoice",
  "invoicenew",
  "project",
  "projd",
  "team",
  "task",
  "taskd",
  "board",
  "chat",
  "dm",
  "notif",
];

function App() {
  const [s, setS] = useState(load),
    [route, setRoute] = useState({ p: "overview" }),
    [hist, setHist] = useState([]),
    [dd, setDd] = useState(false),
    [modal, setModal] = useState(null),
    [flt, setFlt] = useState("All"),
    [tq, setTq] = useState(""),
    [tp, setTp] = useState("All"),
    [mq, setMq] = useState(""),
    [mf, setMf] = useState("All");
  const setToast = showToast;

  const [side, setSide] = useState(false);
  const profRef = useRef(null);

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
  const note = (d, txt, cat, task) =>
    d.notifs.unshift({ id: Date.now() + Math.random(), txt, cat, task, un: true, t: "just now" });
  const log = (d, id, txt) => d.tasks.find((t) => t.id === id).log.push({ t: now(), txt });
  const go = (r) => {
    setHist((h) => [...h, route]);
    setRoute(r);
    setDd(false);
  };
  // Swap the current page without adding a history entry
  const replace = (r) => {
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
  const c = { s, up, go, replace, back, u: s.user, toast: setToast };
  if (!s.user) {
    return <Auth c={c} />;
  }
  const u = s.user;
  const projects = s.projects;
  const tasks = s.tasks;
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
    if (ts.some((x) => x.status !== "To Do")) {
      return "In Progress";
    }
    return "Pending";
  };

  const nav = [
    ["overview", "LayoutDashboard", "Overview"],
    ["invoice", "FileText", "Invoice"],
    ["project", "FolderKanban", "Project"],
    ["team", "UsersRound", "Team"],
    ["task", "ListTodo", "Task"],
    ["board", "Columns3", "Team Board"],
    ["chat", "MessagesSquare", "Team Chat"],
    ["dm", "MessageCircle", "Direct Message"],
    ["notif", "Bell", "Notification"],
  ];

  const unread = s.notifs.filter((n) => n.un).length;
  const mems = (pj) => {
    const p = s.projects.find((x) => x.name === pj);
    return p ? p.members : [];
  };

  const Assign = () => {
    const [f, setF] = useState({
      title: "",
      desc: "",
      project: projects[0]?.name || "",
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
          ? <p className="mu">There are no projects yet. Create a project first.</p>
          : (
            <form
              className="grid"
              onSubmit={(e) => {
                e.preventDefault();
                if (!as) {
                  return;
                }
                const id = "TASK-" +
                  (Math.max(1100, ...s.tasks.map((x) => parseInt(x.id.slice(5)) || 0)) + 1);
                up((d) => {
                  d.tasks.unshift({
                    ...T(id, f.title, f.project, as, u.name, f.priority, f.due, "To Do"),
                    desc: f.desc.trim() || "Assigned task.",
                    checklist: f.items.map((t) => ({ t, done: false })),
                  });
                  note(d, `${u.name} assigned you ${id}`, "Task Assigned", id);
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

  const NewProject = () => {
    const [f, setF] = useState({
      name: "",
      desc: "",
      due: "2026-12-31",
      team: "",
      members: [],
      lead: "",
    });
    const [draft, setDraft] = useState([]);
    const [q, setQ] = useState("");
    const [err, setErr] = useState("");
    const shown = getUsers().filter((x) =>
      (x.name + " " + x.email + " " + x.username).toLowerCase().includes(q.toLowerCase()));
    const dirty = draft.length !== f.members.length || draft.some((n) => !f.members.includes(n));

    const saveMembers = () => {
      if (!draft.length) {
        return setErr("Select at least one team member.");
      }
      setErr("");
      setF({ ...f, members: draft, lead: draft.includes(f.lead) ? f.lead : "" });
    };

    return (
      <Modal title="Create Project" onClose={() => setModal(null)}>
        <form
          className="grid"
          onSubmit={(e) => {
            e.preventDefault();
            if (s.projects.some((x) => x.name.toLowerCase() === f.name.trim().toLowerCase())) {
              return setErr("A project with this name already exists.");
            }
            if (!f.members.length || dirty) {
              return setErr("Select the team members and click Save.");
            }
            if (!f.lead) {
              return setErr("Choose a team lead.");
            }
            up((d) => {
              const n = Math.max(0, ...d.projects.map((x) => parseInt(x.id.slice(2)) || 0)) + 1;
              d.projects.unshift({
                id: "P-" + n,
                name: f.name.trim(),
                desc: f.desc,
                lead: f.lead,
                team: f.team.trim(),
                members: f.members,
                due: f.due,
                status: "Pending",
              });
              note(d, `Project ${f.name.trim()} created`, "Project Updates");
            });
            setModal(null);
            setToast("Project created");
          }}
        >
          <label>
            Project Name *
            <input
              required
              placeholder="e.g. NextGen Client App"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              rows={2}
              placeholder="Scope, objectives, and deliverables..."
              value={f.desc}
              onChange={(e) => setF({ ...f, desc: e.target.value })}
            />
          </label>
          <div className="row">
            <label style={{ flex: 1 }}>
              Due Date
              <input
                type="date"
                value={f.due}
                onChange={(e) => setF({ ...f, due: e.target.value })}
              />
            </label>
            <label style={{ flex: 1 }}>
              Team Name *
              <input
                required
                placeholder="e.g. Alpha Engineering"
                value={f.team}
                onChange={(e) => setF({ ...f, team: e.target.value })}
              />
            </label>
          </div>
          <div className="mp">
            <span className="cap">Select Team Members</span>
            <div className="search" style={{ maxWidth: "none" }}>
              <span><Icon n="Search" s={18} /></span>
              <input
                placeholder="Search email or user name"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="mlist">
              {shown.map((x) => (
                <label key={x.email} className="mrow">
                  <span className="mn">
                    <span className="avatar">{ini(x.name)}</span>
                    <span><b>{x.name}</b><small className="mu">{x.email}</small></span>
                  </span>
                  <input
                    type="checkbox"
                    checked={draft.includes(x.name)}
                    onChange={() =>
                      setDraft(
                        draft.includes(x.name)
                          ? draft.filter((n) => n !== x.name)
                          : [...draft, x.name],
                      )}
                  />
                </label>
              ))}
              {!shown.length && <span className="mu">No matching users.</span>}
            </div>
            <div className="mfoot">
              <span>{draft.length} selected{!dirty && f.members.length > 0 && " · saved"}</span>
              <button type="button" className="btn sm" onClick={saveMembers}>Save</button>
            </div>
          </div>
          <label>
            Team Lead *
            <select
              value={f.lead}
              disabled={!f.members.length}
              onChange={(e) => setF({ ...f, lead: e.target.value })}
            >
              <option value="">
                {f.members.length ? "Select team lead" : "Save team members first"}
              </option>
              {f.members.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          {err && <div className="err">{err}</div>}
          <button className="btn">Create Project</button>
        </form>
      </Modal>
    );
  };

  const TeamModal = ({ x }) => (
    <Modal title={x.team + " · " + x.name} onClose={() => setModal(null)}>
      <div className="mu">Lead: {x.lead}</div>
      {x.members.map((m) => {
        const ct = s.tasks.find((t) =>
          t.assignee === m && t.project === x.name && t.status === "In Progress");

        return (
          <div key={m} className="prow">
            <span className="row">
              <span className="avatar">{ini(m)}</span>
              <span>{m}<br /><small className="mu">{ct ? ct.title : "No active task"}</small></span>
            </span>
            <small className="mu">{presence(m, u.name)}</small>
          </div>
        );
      })}
      <button className="btn" onClick={() => setModal({ k: "assign" })}>Assign Task</button>
    </Modal>
  );

  // Task details: clean label/value layout. Review tasks get the lead's report beside it.
  const TaskDetail = () => {
    const t = s.tasks.find((x) => x.id === route.id);
    if (!t) {
      return (
        <div className="grid fit">
          <PageHead c={c} title="Task Details" />
          <div className="card">Task not found.</div>
        </div>
      );
    }
    const team = (s.projects.find((x) => x.name === t.project) || {}).team || "—";
    const inReview = t.status === "Review";
    const reps = [...(t.reports || [])].reverse();

    const person = (n) => (
      <span className="who">
        <span className="avatar">{ini(n)}</span>
        {n}
      </span>
    );
    const cell = (k, v) => (
      <div className="tdcell">
        <span className="cap">{k}</span>
        <div>{v}</div>
      </div>
    );
    const field = (k, v, full) => (
      <div className={"kv" + (full ? " full" : "")}>
        <span className="cap">{k}</span>
        <div>{v}</div>
      </div>
    );

    return (
      <div className="grid fit">
        <PageHead c={c} title="Task Details" />
        <div className={"tdrow " + (inReview ? "two" : "one")}>
          <div className="card tdc dc">
            <div className="tdtop">
              <span className="tdid">{t.id}</span>
              <Pill v={t.status} />
            </div>
            <h3 className="tdtitle">{t.title}</h3>
            <p className="tddesc">{t.desc || "—"}</p>
            <div className="tdgrid">
              {cell("Project", t.project)}
              {cell("Team", team)}
              {cell("Assigned By", person(t.by))}
              {cell("Assigned To", person(t.assignee))}
              {cell("Priority", <Pill v={t.priority} />)}
              {cell("Due Date", t.due)}
            </div>
          </div>

          {inReview && (
            <div className="card tdc rc">
              <div className="tdtop">
                <span className="tdid">Team Lead Report</span>
                {reps.length > 0 && <small className="mu">{reps[0].at || ""}</small>}
              </div>
              {!reps.length
                ? <div className="emptyrep">No report has been submitted yet.</div>
                : (
                  <div className="repscr">
                    {reps.map((r, i) => (
                      <div key={i} className="rep">
                        <div className="kvg">
                          {field("Category", r.cat ? <Pill v={r.cat} /> : "—")}
                          {field("Submitted By", person(r.by || t.assignee))}
                          {field("Report Description", r.desc || "—", true)}
                          {field("Progress Summary", r.sum || r.summary || r.progress || "—", true)}
                          {field("Blockers / Issues", r.block || "—", true)}
                          {field("Recommended Action", r.act || "—", true)}
                          {field(
                            "Attachment",
                            r.file || r.attachment
                              ? (
                                <span className="row">
                                  <Icon n="Paperclip" s={16} />
                                  {r.file || r.attachment}
                                </span>
                              )
                              : "No attachment",
                            true,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TaskTable = ({ list, size }) => (
    <div className={"card tbl " + (size || "")}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Project</th>
            <th>Assignee</th>
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
              <td>{t.assignee}</td>
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

  if (p === "overview") {
    page = <Overview c={c} setModal={setModal} prog={prog} />;
  }

  if (p === "invoice") {
    page = <InvoiceList c={c} />;
  }

  if (p === "invoicenew") {
    const ed = route.id ? (s.invoices || []).find((x) => x.id === route.id) : null;
    page = <InvoiceForm key={route.id || "new"} c={c} edit={ed} />;
  }

  if (p === "invoiced") {
    page = <InvoiceView key={route.id} c={c} id={route.id} />;
  }

  if (p === "project") {
    const pj = projects.map(pstat);
    const pm = [
      ["FolderKanban", "Total Projects", projects.length],
      ["Zap", "In Progress", pj.filter((x) => x === "In Progress").length],
      ["Clock", "Pending", pj.filter((x) => x === "Pending").length],
      ["Check", "Completed", pj.filter((x) => x === "Completed").length],
    ];

    page = (
      <div className="grid fit">
        <PageHead c={c} title="Projects" />
        <Metrics items={pm} />
        <ProjList
          projects={projects}
          prog={prog}
          pstat={pstat}
          go={go}
          s={s}
          onCreate={() => setModal({ k: "proj" })}
        />
      </div>
    );
  }

  if (p === "projd") {
    const x = s.projects.find((y) => y.id === route.id);

    page = !x
      ? (
        <div className="grid fit">
          <PageHead c={c} title="Project" />
          <div className="card">Not found.</div>
        </div>
      )
      : (
        <div className="grid fit">
          <PageHead c={c} title="Project Details" />
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
          <TaskTable
            list={s.tasks.filter((t) => t.project === x.name)}
            size="mid"
          />
        </div>
      );
  }

  if (p === "team") {
    const rows = projects.filter((x) =>
      (mf === "All" || x.team === mf) &&
        (x.team + x.name + x.lead + x.members.join(" ")).toLowerCase().includes(mq.toLowerCase()));

    const ppl = allMembers(projects);
    const online = ppl.filter((m) => presence(m, u.name) === "Online").length;
    const tm = [
      ["UsersRound", "Total Team", new Set(projects.map((x) => x.team)).size],
      ["UserPlus", "Total Members", ppl.length],
      ["UserCheck", "Active", online],
      ["UserX", "Offline", ppl.length - online],
    ];

    page = (
      <div className="grid fit">
        <PageHead c={c} title="Teams" />
        <Metrics items={tm} />
        <div className="toolbar">
          <div className="search">
            <span><Icon n="Search" s={18} /></span>
            <input
              placeholder="Search teams, leads, members…"
              value={mq}
              onChange={(e) => setMq(e.target.value)}
            />
          </div>
          <select value={mf} onChange={(e) => setMf(e.target.value)}>
            <option value="All">All teams</option>
            {[...new Set(projects.map((x) => x.team))].map((x) => <option key={x}>{x}</option>)}
          </select>
          <button className="btn" onClick={() => setModal({ k: "assign" })}>
            <Icon n="Plus" s={18} />
            Assign Task
          </button>
        </div>
        <div className="card tbl fix">
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>Project</th>
                <th>Lead</th>
                <th>Members</th>
                <th>Tasks</th>
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
                    <td><b>{ts.length}</b></td>
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

    const cnt = (x) => tasks.filter((t) => t.status === x).length;
    const km = [
      ["ListTodo", "Total Tasks", tasks.length],
      ["Square", "To Do", cnt("To Do")],
      ["Zap", "In Progress", cnt("In Progress")],
      ["Check", "Completed", cnt("Completed")],
      ["Eye", "Review", cnt("Review")],
    ];

    page = (
      <div className="grid fit">
        <PageHead c={c} title="Tasks" />
        <Metrics items={km} />
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
          <button className="btn" onClick={() => setModal({ k: "assign" })}>
            <Icon n="Plus" s={18} />
            Assign Task
          </button>
        </div>
        <TaskTable list={fl} size="fix" />
      </div>
    );
  }

  if (p === "taskd") {
    page = <TaskDetail key={route.id} />;
  }

  if (p === "board") {
    page = (
      <div className="grid fit">
        <PageHead c={c} title="Team Board" />
        <div className="kan">
          {ST.map((col) => (
            <div key={col} className="col">
              <b>{col} ({tasks.filter((t) => t.status === col).length})</b>
              {tasks.filter((t) => t.status === col).map((t) => (
                <div key={t.id} className="kc" onClick={() => go({ p: "taskd", id: t.id })}>
                  <b>{t.title}</b>
                  <small className="mu">{t.id} · {t.project}</small>
                  <div className="row sp"><span>{t.assignee}</span><Pill v={t.priority} /></div>
                  <select
                    onClick={(e) => e.stopPropagation()}
                    value={t.status}
                    onChange={(e) => {
                      const v = e.target.value;
                      up((d) => {
                        d.tasks.find((x) => x.id === t.id).status = v;
                        log(d, t.id, `Moved to ${v} on board`);
                      });
                    }}
                  >
                    {ST.map((z) => <option key={z}>{z}</option>)}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (p === "profile") {
    page = <Profile c={c} />;
  }

  if (p === "chat" || p === "dm") {
    page = <Chat key={p} c={c} kind={p} />;
  }

  if (p === "notif") {
    page = (
      <div className="card notifp" style={{ padding: 0 }}>
        <div className="row sp" style={{ padding: 12 }}>
          <b>Notifications ({unread} unread)</b>
          <button className="link" onClick={() => up((d) => d.notifs.forEach((n) => n.un = false))}>
            Mark all as read
          </button>
        </div>
        {s.notifs.map((n) => (
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
      </div>
    );
  }

  const navOn = (k) =>
    p === k ||
    (p === "taskd" && k === "task") ||
    (p === "projd" && k === "project") ||
    ((p === "invoicenew" || p === "invoiced") && k === "invoice");

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
          {side && <div className="brandtx"><b>Work Flow</b><small>Admin Panel</small></div>}
        </div>
        <nav className="navs">
          {nav.map(([k, i, l]) => (
            <button
              key={k}
              aria-label={l}
              data-tip={side ? undefined : l}
              className={"nav " + (navOn(k) ? "on" : "")}
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
                <button onClick={() => go({ p: "profile" })}>
                  <Icon n="User" s={18} />
                  Profile
                </button>
                <button
                  onClick={() => {
                    up((d) => {
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
            {side && <span className="pn"><b>{u.name}</b><small>Admin</small></span>}
          </button>
        </div>
      </aside>
      <main className="main">
        <div
          className={"page" + (FIT_PAGES.includes(p) ? " fit" : "")}
          key={JSON.stringify(route)}
        >
          {["chat", "dm", "notif"].includes(p) && (
            <PageHead
              c={c}
              title={p === "chat" ? "Team Chat" : p === "dm" ? "Direct Message" : "Notifications"}
            />
          )}
          {page}
        </div>
      </main>
      {modal?.k === "assign" && <Assign />}
      {modal?.k === "team" && <TeamModal x={modal.x} />}
      {modal?.k === "proj" && <NewProject />}
      <ToastHost />
    </div>
  );
}

function ProjList({ projects, prog, pstat, go, s, onCreate }) {
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
            placeholder="Search projects, teams, leads…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select value={st} onChange={(e) => setSt(e.target.value)}>
          {["All", "Pending", "In Progress", "Completed"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button className="btn" onClick={onCreate}>
          <Icon n="Plus" s={18} />
          Create Project
        </button>
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
        {!l.length && <p className="mu">No projects.</p>}
      </div>
    </>
  );
}

export default App;