// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Columns3,
  Eye,
  EyeOff,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  MessagesSquare,
  Mic,
  Paperclip,
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

const K = "wf_state_v1",
  WS = {
    lead: "Team & Invoice",
    employee: "Invoice",
  };

// ============================================================
// Icons (lucide-react)
// ============================================================

const LIB = {
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  ListTodo,
  Columns3,
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
  Briefcase,
  ClipboardCheck,
  Eye,
  UserPlus,
  Send,
  Play,
  Square,
  EyeOff,
  ChevronLeft,
  ChevronRight,
};

function Icon({ n, s = 20 }) {
  const C = LIB[n];
  return C ? <C size={s} strokeWidth={1.8} /> : null;
}

const WSD = {
  lead: "Lead your teams, assign tasks, review submissions and report progress.",
  employee: "View assigned projects and tasks, track time and submit work for review.",
};

const WSI = { lead: "UsersRound", employee: "User" };

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

const SQ = ["Alpha Engineering", "Beta Mobile Squad", "Core HR & Ops", "Analytics & Design"];

const now = () => new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });

const ini = (n) => n.split(" ").map((x) => x[0]).join("").slice(0, 2);

const fmt = (s) => {
  s = Math.floor(s);
  const h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60);
  return `${h}:${String(m).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
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
      desc: "Deliver per acceptance checklist and update the team.",
      secs,
      log: [{ t: "01/11/26", txt: "Task assigned by " + by }],
      reports: [],
      checklist: [],
    }
  );

const seed = {
  user: null,
  ws: null,
  timer: null,
  stopped: null,
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
    T(
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
  ],
  msgs: {
    "#alpha-engineering": [{ u: "Sneha Rao", x: "Currency cache is live on staging.", t: "09:40" }],
    "#beta-mobile": [{ u: "Priya Sharma", x: "Test builds are on TestFlight.", t: "10:05" }],
    "Rahul Varma": [{ u: "Rahul Varma", x: "Export endpoint almost done.", t: "09:45" }],
    "Priya Sharma": [],
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
  ],
};

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(K)) || seed;
  } catch (e) {
    return seed;
  }
};

const USERS_BASE = PEOPLE.map((n) => ({
  name: n,
  email: n.toLowerCase().replace(/ /g, ".") + "@workflow.com",
  username: n.split(" ")[0].toLowerCase(),
}));

function getUsers() {
  let accs = [];
  try {
    accs = JSON.parse(localStorage.getItem("wf_acc") || "[]");
  } catch (e) {}
  const extra = accs
    .filter((x) => !USERS_BASE.some((b) => b.email === x.email))
    .map((x) => ({ name: x.name, email: x.email, username: x.user }));
  return [...USERS_BASE, ...extra];
}

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

const ICONS = {
  "Total Projects": "FolderKanban",
  "Total Teams": "UsersRound",
  "Total Employees": "User",
  "Active Tasks": "Zap",
  "Completed": "Check",
  "Pending": "Clock",
  "Projects": "FolderKanban",
  "Team Members": "UsersRound",
  "Total Tasks": "ListTodo",
  "In Progress": "Zap",
  "Under Review": "Eye",
  "Logged Hours": "Clock",
  "Tasks": "ListTodo",
  "Upcoming": "Clock",
  "In Progress Projects": "Zap",
  "Completed Projects": "Check",
};

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
  const accs = () => {
    try {
      return JSON.parse(localStorage.getItem("wf_acc") || "[]");
    } catch (x) {
      return [];
    }
  };
  const login = (u) => {
    const workspaces = (u.ws || []).filter((w) => w === "lead" || w === "employee");
    const account = { ...u, ws: workspaces.length ? workspaces : ["lead"] };
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
      return login({
        name: "Arun Patel",
        email: "abc@gmail.com",
        ws: ["lead", "employee"],
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
      ws: ["lead", "employee"].filter((w) => f.ws.includes(w)),
    };
    try {
      localStorage.setItem("wf_acc", JSON.stringify([...accs(), u]));
    } catch (x) {}
    login(u);
  };

  return (
    <div className="auth">
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
                {["lead", "employee"].map((w) => {
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

function App() {
  const [s, setS] = useState(load),
    [userRoute, setUserRoute] = useState({ p: "overview" }),
    [userHist, setUserHist] = useState([]),
    [dd, setDd] = useState(false),
    [modal, setModal] = useState(null),
    [flt, setFlt] = useState("All"),
    [tq, setTq] = useState(""),
    [tp, setTp] = useState("All"),
    [mq, setMq] = useState(""),
    [mf, setMf] = useState("All");
  const route = userRoute;
  const setRoute = setUserRoute;
  const hist = userHist;
  const setHist = setUserHist;
  const setToast = showToast;

  useEffect(() => {
    try {
      localStorage.setItem(K, JSON.stringify(s));
    } catch (e) {}
  }, [s]);
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
  useEffect(() => {
    if (s.user && (s.ws === "manager" || !["lead", "employee"].includes(s.ws))) {
      up((d) => {
        d.ws = "lead";
        d.user.ws = [...new Set([...(d.user.ws || []), "lead"])].filter(
          (w) => w === "lead" || w === "employee",
        );
      });
    }
  }, [s.user, s.ws]);
  const note = (d, txt, cat, task) =>
    d.notifs.unshift({ id: Date.now() + Math.random(), txt, cat, task, un: true, t: "just now" });
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
    ws = s.ws === "manager" ? "lead" : s.ws,
    M = false,
    L = ws === "lead",
    E = ws === "employee";
  const projects = s.projects.filter((p) =>
    M || (L ? p.lead === u.name : p.members.includes(u.name)));
  const pn = projects.map((p) => p.name);
  const tasks = s.tasks.filter((t) => M || (L ? pn.includes(t.project) : t.assignee === u.name));
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
    if (ts.some((x) => x.status !== "To Do")) {
      return "In Progress";
    }
    return "Pending";
  };

  const switchWs = (w) => {
    if (w !== "lead" && w !== "employee") {
      return;
    }
    up((d) => {
      d.ws = w;
    });
    setRoute({ p: "overview" });
    setHist([]);
    setDd(false);
    setToast("Switched to " + WS[w]);
  };

  const stopTimer = (d) => {
    if (d.timer) {
      const t = d.tasks.find((x) => x.id === d.timer.id);
      t.secs += Math.floor((Date.now() - d.timer.start) / 1000);
      log(d, t.id, "Timer stopped, " + fmt((Date.now() - d.timer.start) / 1000) + " logged");
      d.stopped = t.id;
      d.timer = null;
    }
  };

  const nav = [
    ["overview", "LayoutDashboard", "Overview"],
    ["project", "FolderKanban", "Project"],
    ["team", "UsersRound", "Team"],
    ["task", "ListTodo", "Task"],
    ...(M ? [["board", "Columns3", "Team Board"]] : []),
    ["chat", "MessagesSquare", "Team Chat"],
    ["dm", "MessageCircle", "Direct Message"],
    ["notif", "Bell", "Notification"],
  ];

  const unread = s.notifs.filter((n) => n.un).length;
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
    return p ? p.members.filter((m) => M || m !== u.name || true) : [];
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
                    desc: f.desc || "Assigned task.",
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
                    if (d.timer && d.timer.id === t.id) {
                      stopTimer(d);
                    }
                    const k = d.tasks.find((x) => x.id === t.id);
                    k.assignee = m;
                    log(d, t.id, `Reassigned from ${t.assignee} to ${m} by ${u.name}`);
                    note(d, `${t.id} reassigned to ${m}`, "Task Assigned", t.id);
                  });

                  setModal(null);
                  setToast("Reassigned to " + m);
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

  const TeamModal = ({ x }) => (
    <Modal title={x.team + " · " + x.name} onClose={() => setModal(null)}>
      <div className="mu">Lead: {x.lead}</div>
      {x.members.map((m, i) => {
        const ct = s.tasks.find((t) =>
          t.assignee === m && t.project === x.name && t.status === "In Progress");

        return (
          <div key={m} className="prow">
            <span className="row">
              <span className="avatar">{ini(m)}</span>
              <span>{m}<br /><small className="mu">{ct ? ct.title : "No active task"}</small></span>
            </span>
            <small className="mu">{["Online", "Away", "Offline"][(i + m.length) % 3]}</small>
          </div>
        );
      })}
      {(M || L) && (
          <button className="btn" onClick={() => setModal({ k: "assign" })}>Assign Task</button>
        )}
    </Modal>
  );

  const Report = ({ t }) => {
    const [f, setF] = useState({ cat: "Task Progress", desc: "", prog: "", block: "", act: "" });

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
              note(d, `${u.name} reported on ${t.id} (${f.cat})`, "Team Lead Report", t.id);
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
                "Employee Performance",
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
            <input type="file" onChange={(e) => setF({ ...f, att: e.target.files[0]?.name })} />
          </label>
          <button className="btn">Submit Report</button>
        </form>
      </Modal>
    );
  };

  const TaskDetail = () => {
    const t = s.tasks.find((x) => x.id === route.id);
    const [chg, setChg] = useState(""),
      [cf, setCf] = useState(null);
    if (!t) {
      return <div className="card">Task not found.</div>;
    }
    const mine = E && t.assignee === u.name || L && t.assignee === u.name && false;
    const running = s.timer?.id === t.id;
    const canWork = t.assignee === u.name &&
      !M &&
      t.status !== "Completed" &&
      t.status !== "Review";

    return (
      <div className="grid">
        <div className="card">
          <div className="row sp">
            <div>
              <span className="mu">{t.id} · {t.project}</span>
              <h2 style={{ margin: "4px 0" }}>{t.title}</h2>
            </div>
            <span className="row"><Pill v={t.priority} /><Pill v={t.status} /></span>
          </div>
          <p>{t.desc}</p>
          <div className="row mu">
            Assigned by
            {" "}
            <b>{t.by}</b>
            {" "}
            · Assignee
            {" "}
            <b>{t.assignee}</b>
            {" "}
            · Due
            {" "}
            <b>{t.due}</b>
          </div>
          {canRe(t) && (
              <button
                className="btn sec sm"
                style={{ marginTop: 10 }}
                onClick={() => setModal({ k: "reassign", t })}
              >
                Reassign Task
              </button>
            )}
        </div>
        <div className="card">
          <div className="row sp">
            <b>Checklist</b>
            <span className="mu">
              {(t.checklist || []).filter((x) => x.done).length}/{(t.checklist || []).length}
            </span>
          </div>
          {(t.checklist || []).map((it, i) => (
            <label key={i} className="ckrow">
              <input
                type="checkbox"
                checked={it.done}
                disabled={!(t.assignee === u.name || L || M)}
                onChange={() =>
                  up((d) => {
                    const k = d.tasks.find((x) => x.id === t.id);
                    k.checklist[i].done = !k.checklist[i].done;
                  })}
              />
              <span className={it.done ? "done" : ""}>{it.t}</span>
            </label>
          ))}
          {!(t.checklist || []).length && <span className="mu">No checklist items.</span>}
        </div>
        <div className="grid g2">
          <div className="card">
            <b>Time Tracking</b>
            <div className="timer"><LiveTime t={t} timer={s.timer} /></div>
            {running && <div className="live">Timer running</div>}
            {canWork && (
                <div className="row" style={{ marginTop: 8 }}>
                  {!running
                    ? (
                      <button
                        className="btn"
                        onClick={() =>
                          up((d) => {
                            stopTimer(d);
                            const k = d.tasks.find((x) => x.id === t.id);
                            k.status = "In Progress";
                            d.timer = { id: t.id, start: Date.now() };
                            d.stopped = null;
                            log(d, t.id, "Timer started");
                          })}
                      >
                        <Icon n="Play" s={16} />
                        {" "}
                        Start Timer
                      </button>
                    )
                    : (
                      <button className="btn red" onClick={() => up(stopTimer)}>
                        <Icon n="Square" s={16} />
                        {" "}
                        Stop Timer
                      </button>
                    )}
                  <button className="btn sec" onClick={() => setCf({ n: "", w: "" })}>
                    Mark Complete
                  </button>
                </div>
              )}
            {s.stopped === t.id && (
                <div className="grid" style={{ marginTop: 10 }}>
                  <textarea
                    rows={3}
                    placeholder="Describe the work completed during this session..."
                    value={chg}
                    onChange={(e) => setChg(e.target.value)}
                  />
                  <button
                    className="btn"
                    onClick={() => {
                      if (!chg.trim()) {
                        return;
                      }
                      up((d) => {
                        log(d, t.id, "Work update: " + chg);
                        d.stopped = null;
                      });
                      setChg("");
                      setToast("Changes saved");
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
          </div>
          <div className="card">
            <b>Review &amp; Reports</b>
            {t.status === "Review" &&
              (L || M) && (
                <div className="row" style={{ margin: "8px 0" }}>
                  <button
                    className="btn"
                    onClick={() => {
                      up((d) => {
                        d.tasks.find((x) => x.id === t.id).status = "Completed";
                        log(d, t.id, "Approved by " + u.name);
                        note(d, `${t.id} approved`, "Task Review", t.id);
                      });
                      setToast("Approved");
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn sec"
                    onClick={() => {
                      up((d) => {
                        d.tasks.find((x) => x.id === t.id).status = "In Progress";
                        log(d, t.id, "Changes requested by " + u.name);
                        note(d, `Changes requested on ${t.id}`, "Task Review", t.id);
                      });
                      setToast("Changes requested");
                    }}
                  >
                    Request Changes
                  </button>
                </div>
              )}
            {L && (
                <div style={{ margin: "8px 0" }}>
                  <button className="btn" onClick={() => setModal({ k: "report", t })}>
                    <Icon n="Send" s={16} />
                    {" "}
                    Report to Super Admin
                  </button>
                </div>
              )}
            {(L || M) &&
              t.reports.map((r, i) => (
                <div key={i} className="log">
                  <b>{r.cat}</b>
                  {" "}
                  ·
                  {" "}
                  {r.at}
                  <br />
                  {r.desc}
                  {r.block && <><br />Blockers: {r.block}</>}
                  {r.act && <><br />Action: {r.act}</>}
                </div>
              ))}
            {E && !t.reports.length && <span className="mu">No reports.</span>}
          </div>
        </div>
        <div className="card">
          <b>Activity History</b>
          {[...t.log].reverse().map((l, i) => (
            <div key={i} className="log"><small className="mu">{l.t}</small><br />{l.txt}</div>
          ))}
        </div>
        {cf && (
            <Modal title="Complete task" onClose={() => setCf(null)}>
              <form
                className="grid"
                onSubmit={(e) => {
                  e.preventDefault();

                  up((d) => {
                    stopTimer(d);
                    const k = d.tasks.find((x) => x.id === t.id);
                    k.status = "Review";
                    k.completedAt = now();
                    log(
                      d,
                      t.id,
                      `Submitted for review. Notes: ${cf.n} | Summary: ${cf.w}` +
                        (cf.f ? ` | File: ${cf.f}` : ""),
                    );
                    note(d, `${u.name} submitted ${t.id} for review`, "Task Review", t.id);
                  });

                  setCf(null);
                  setToast("Submitted for review");
                }}
              >
                <label>
                  Completion Notes
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the completed work, important changes and final outcome..."
                    value={cf.n}
                    onChange={(e) => setCf({ ...cf, n: e.target.value })}
                  />
                </label>
                <label>
                  Work Summary
                  <input
                    required
                    value={cf.w}
                    onChange={(e) => setCf({ ...cf, w: e.target.value })}
                  />
                </label>
                <label>
                  Supporting Attachment (optional)
                  <input
                    type="file"
                    onChange={(e) => setCf({ ...cf, f: e.target.files[0]?.name })}
                  />
                </label>
                <button className="btn">Submit for Review</button>
              </form>
            </Modal>
          )}
      </div>
    );
  };

  const canRe = (t) =>
    t.status !== "Completed" &&
      (M || (L && pn.includes(t.project)) || (E && t.assignee === u.name && t.status !== "Review"));

  const TaskTable = ({ list, size }) => (
    <div className={"card tbl " + (size || "")}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Project</th>
            {!E && <th>Assignee</th>}
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
              {!E && <td>{t.assignee}</td>}
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
    const d = tasks.filter((t) => t.status === "Completed").length,
      ip = tasks.filter((t) => t.status === "In Progress").length,
      rv = tasks.filter((t) => t.status === "Review").length,
      pe = tasks.filter((t) => t.status === "To Do").length;

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = tasks.filter((t) => t.status !== "Completed" && t.due >= today).length;

    const stats = M
      ? [
        ["Total Projects", s.projects.length],
        ["Total Teams", new Set(s.projects.map((x) => x.team)).size],
        ["Total Tasks", s.tasks.length],
        ["In Progress Projects", s.projects.filter((x) => pstat(x) === "In Progress").length],
        ["Completed Projects", s.projects.filter((x) => pstat(x) === "Completed").length],
      ]
      : L
        ? [
          ["Projects", projects.length],
          ["Team Members", new Set(projects.flatMap((x) => x.members)).size],
          ["Total Tasks", tasks.length],
          ["Completed", d],
          ["In Progress", ip],
          ["Under Review", rv],
        ]
        : [
          ["Projects", projects.length],
          ["Tasks", tasks.length],
          ["In Progress", ip],
          ["Upcoming", upcoming],
          ["Logged Hours", fmt(tasks.reduce((a, t) => a + secs(t), 0)).slice(0, -3)],
        ];

    page = (
      <div className="grid">
        <h2 className="t" style={{ margin: 0 }}>Overview</h2>
        <div className="grid g4">
          {stats.map(([a, b]) => (
            <div key={a} className="card stat">
              <i className="ic"><Icon n={ICONS[a] || "Zap"} s={22} /></i>
              <div><span>{a}</span><b>{b}</b></div>
            </div>
          ))}
        </div>
        <div className="card">
          <b>Quick Actions</b>
          <div className="qgrid">
            {(
              M
                ? [
                  ["Plus", "Create Project", "Start a new project", () => setModal({ k: "proj" })],
                  [
                    "UserPlus",
                    "Assign Task",
                    "Delegate work to a member",
                    () => setModal({ k: "assign" }),
                  ],
                  ["Columns3", "View Team Board", "Kanban of all tasks", () => go({ p: "board" })],
                ]
                : L
                  ? [
                    [
                      "FolderKanban",
                      "View Project",
                      "Open your projects",
                      () => go({ p: "project" }),
                    ],
                    [
                      "UserPlus",
                      "Assign Task",
                      "Delegate to your team",
                      () => setModal({ k: "assign" }),
                    ],
                    [
                      "Columns3",
                      "View Team Board",
                      "Kanban of team tasks",
                      () => go({ p: "board" }),
                    ],
                  ]
                  : [
                    [
                      "ClipboardCheck",
                      "View Tasks",
                      "Your assigned tasks",
                      () => go({ p: "task" }),
                    ],
                    ["Columns3", "View Team Board", "See team workflow", () => go({ p: "board" })],
                  ]
            ).map(([i, a, b, f]) => (
              <button key={a} className="qbtn" onClick={f}>
                <i><Icon n={i} s={20} /></i>
                <span><b>{a}</b><small>{b}</small></span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid g2">
          <div className="card">
            <b>Project Progress</b>
            {projects.map((x) => (
              <div
                key={x.id}
                style={{ margin: "10px 0", cursor: "pointer" }}
                onClick={() => go({ p: "projd", id: x.id })}
              >
                <div className="row sp">
                  <span>{x.name}</span>
                  <span className="mu">{prog(x)}%</span>
                </div>
                <Bar v={prog(x)} />
              </div>
            ))}
          </div>
          <div className="card">
            <b>{E ? "My Current Tasks" : "Recent Activity"}</b>
            {tasks.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="row sp"
                style={{ padding: "6px 0", borderTop: "1px solid var(--bd)", cursor: "pointer" }}
                onClick={() => go({ p: "taskd", id: t.id })}
              >
                <span><b>{t.assignee}</b> · {t.title}</span>
                <Pill v={t.status} />
              </div>
            ))}
          </div>
        </div>
        {L &&
          rv > 0 && (
            <div className="card">
              <b>Pending Review ({rv})</b>
              {tasks.filter((t) => t.status === "Review").map((t) => (
                <div key={t.id} className="row sp" style={{ padding: "6px 0" }}>
                  <span>{t.title} · {t.assignee}</span>
                  <button className="btn sm" onClick={() => go({ p: "taskd", id: t.id })}>
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
      </div>
    );
  }

  if (p === "project") {
    page = (
      <div className="grid">
        <div className="row sp">
          <h2 className="t">Projects</h2>
          {M && (
              <button className="btn" onClick={() => setModal({ k: "proj" })}>
                + Create Project
              </button>
            )}
        </div>
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
            {M && (
                <div className="row" style={{ marginTop: 10 }}>
                  <button
                    className="btn red sm"
                    onClick={() => {
                      if (confirm("Delete project?")) {
                        up((d) => {
                          d.projects = d.projects.filter((y) => y.id !== x.id);
                        });
                        back();
                        setToast("Project deleted");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
          </div>
          <TaskTable
            list={s.tasks.filter((t) => t.project === x.name && (M || tasks.includes(t)))}
            size="mid"
          />
        </div>
      );
  }

  if (p === "team") {
    const rows = projects.filter((x) =>
      (mf === "All" || x.team === mf) &&
        (x.team + x.name + x.lead + x.members.join(" ")).toLowerCase().includes(mq.toLowerCase()));

    page = (
      <div className="grid">
        <div className="row sp">
          <h2 className="t">Teams</h2>
          {(M || L) && (
              <button className="btn" onClick={() => setModal({ k: "assign" })}>
                + Assign Task
              </button>
            )}
        </div>
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

    page = (
      <div className="grid">
        <div className="row sp">
          <h2 className="t">Tasks</h2>
          {(M || L) && (
              <button className="btn" onClick={() => setModal({ k: "assign" })}>
                + Assign Task
              </button>
            )}
        </div>
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
        </div>
        <TaskTable list={fl} size="fix" />
      </div>
    );
  }

  if (p === "taskd") {
    page = <TaskDetail key={route.id} />;
  }

  if (p === "board") {
    const [fp, fa] = [0, 0];

    page = (
      <div className="grid">
        <h2 className="t" style={{ margin: 0 }}>Team Board</h2>
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
                    disabled={E}
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

  if (p === "chat" || p === "dm") {
    page = <Chat key={p + ws} c={c} kind={p} />;
  }

  if (p === "notif") {
    page = (
      <div className="card" style={{ padding: 0 }}>
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
                <b>{u.name}</b>
                <br />
                <small className="mu">{u.email}</small>
                <br />
                <small className="mu">Current: {WS[ws]}</small>
                <hr />
                {(u.ws || []).filter((w) => w === "lead" || w === "employee").map((w) => (
                  <button key={w} className={w === ws ? "cur" : ""} onClick={() => switchWs(w)}>
                    {WS[w]}
                    {w === ws && <Icon n="Check" s={16} />}
                  </button>
                ))}
                <hr />
                <button
                  onClick={() => {
                    setDd(false);
                    setToast("Profile: " + u.name + " · " + u.email);
                  }}
                >
                  Profile Settings
                </button>
                <button
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
            <span className="pav">{ini(u.name)}</span>
            {side && <span className="pn"><b>{u.name}</b><small>Profile</small></span>}
          </button>
        </div>
      </aside>
      <main className="main">
        <div className="page" key={JSON.stringify(route) + ws}><BackBtn />{page}</div>
      </main>
      {modal?.k === "assign" && <Assign />}
      {modal?.k === "reassign" && <Reassign t={modal.t} />}
      {modal?.k === "team" && <TeamModal x={modal.x} />}
      {modal?.k === "proj" && <NewProject />}
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
                  <td><b>{p.name}</b><br /><small className="mu">{p.desc}</small></td>
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