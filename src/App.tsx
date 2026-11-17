// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
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

const WS = {
  lead: "Team & task management",
  employee: "Task management",
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
};

function Icon({ n, s = 20 }) {
  const C = LIB[n];
  return C ? <C size={s} strokeWidth={1.8} /> : null;
}

const WSD = {
  lead: "Lead your teams, assign tasks and report progress to the Super Admin.",
  employee: "View assigned projects and tasks, track time and complete your work.",
};

const WSI = { lead: "UsersRound", employee: "User" };

// There is no "Review" status in these workspaces
const ST = ["To Do", "In Progress", "Stopped", "Completed"];

const now = () => new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });

const ini = (n) => n.split(" ").map((x) => x[0]).join("").slice(0, 2);

const slug = (n) => "#" + n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const fmt = (s) => {
  s = Math.floor(s);
  const h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// Fresh task: status "To Do" and timer 0 (every task starts from scratch)
const T = (id, title, desc, project, assignee, by, priority, due, items) =>
  (
    {
      id,
      title,
      project,
      assignee,
      by,
      priority,
      due,
      status: "To Do",
      desc,
      secs: 0,
      log: [{ t: "17/11/2026", txt: "Task assigned by " + by }],
      reports: [],
      checklist: items.map((t) => ({ t, done: false })),
    }
  );

// Projects are created by the Super Admin (separate web page).
// "members" does NOT include the team lead, the lead is the "lead" field.
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
  ],
  tasks: [
    // Assigned by ABC (Team & task management workspace)
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
    ),
    T(
      "TASK-1002",
      "Design push notification triggers",
      "Define and implement the push notification triggers for approvals.",
      "Mobile App",
      "Priya Sharma",
      "ABC",
      "Medium",
      "2026-11-28",
      ["List trigger events", "Configure FCM / APNs", "Test on TestFlight"],
    ),
    // Assigned to ABC (Task management workspace)
    T(
      "TASK-1003",
      "Build onboarding checklist wizard",
      "Create the step-by-step onboarding checklist wizard for new joiners.",
      "HR Management",
      "ABC",
      "Maya Chen",
      "High",
      "2026-11-24",
      ["Create wizard layout", "Add step validation", "Connect checklist data"],
    ),
    T(
      "TASK-1004",
      "Create ARR cohort chart",
      "Add the ARR cohort retention chart to the executive dashboard.",
      "Analytics Dashboard",
      "ABC",
      "Arun Patel",
      "Medium",
      "2026-11-27",
      ["Prepare cohort data", "Build chart component", "Add tooltips and legend"],
    ),
  ],
  msgs: {
    "#alpha-engineering": [{ u: "Sneha Rao", x: "Currency cache is live on staging.", t: "09:40" }],
    "#beta-mobile-squad": [{ u: "Priya Sharma", x: "Test builds are on TestFlight.", t: "10:05" }],
    "#core-hr-ops": [{ u: "Maya Chen", x: "Please check the onboarding task today.", t: "09:15" }],
    "#analytics-design": [{ u: "Arun Patel", x: "Cohort data is ready for the chart.", t: "09:55" }],
    "Rahul Varma": [{ u: "Rahul Varma", x: "Export endpoint work is ready to start.", t: "09:45" }],
    "Maya Chen": [{ u: "Maya Chen", x: "Hi, your task is assigned.", t: "09:10" }],
  },
  notifs: [
    {
      id: 1,
      ws: "lead",
      txt: "Project Billing Platform assigned to you by Super Admin",
      cat: "Project Updates",
      un: true,
      t: "1h ago",
    },
    {
      id: 2,
      ws: "lead",
      txt: "Project Mobile App assigned to you by Super Admin",
      cat: "Project Updates",
      un: false,
      t: "Yesterday",
    },
    {
      id: 3,
      ws: "employee",
      txt: "Task TASK-1003 assigned to you by Maya Chen",
      cat: "Task Assigned",
      task: "TASK-1003",
      un: true,
      t: "10m ago",
    },
    {
      id: 4,
      ws: "employee",
      txt: "Task TASK-1004 assigned to you by Arun Patel",
      cat: "Task Assigned",
      task: "TASK-1004",
      un: true,
      t: "30m ago",
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
        name: "ABC",
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

function App() {
  // State lives in memory only (no localStorage), so a page reload starts from scratch.
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
    L = ws === "lead",
    E = ws === "employee";
  const projects = s.projects.filter((p) => (L ? p.lead === u.name : p.members.includes(u.name)));
  const pn = projects.map((p) => p.name);
  const tasks = s.tasks.filter((t) => (L ? pn.includes(t.project) : t.assignee === u.name));
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
    up((d) => {
      d.ws = w;
    });
    setRoute({ p: "overview" });
    setHist([]);
    setDd(false);
    setToast("Switched to " + WS[w]);
  };

  // Stop the running timer: task becomes "Stopped" and waits for the work description
  const stopTimer = (d) => {
    if (d.timer) {
      const t = d.tasks.find((x) => x.id === d.timer.id);
      const el = Math.floor((Date.now() - d.timer.start) / 1000);
      t.secs += el;
      t.status = "Stopped";
      log(d, t.id, "Timer stopped, " + fmt(el) + " logged");
      d.stopped = t.id;
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
      d.stopped = null;
    });

  const nav = [
    ["overview", "LayoutDashboard", "Overview"],
    ["project", "FolderKanban", "Project"],
    ["team", "UsersRound", "Team"],
    ["task", "ListTodo", "Task"],
    ["chat", "MessagesSquare", "Team Chat"],
    ["dm", "MessageCircle", "Direct Message"],
    ["notif", "Bell", "Notification"],
  ];

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
                  (Math.max(1004, ...s.tasks.map((x) => parseInt(x.id.slice(5)) || 0)) + 1);
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

  // Employee: reassign a task that has not been started yet
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
                    k.status = "To Do";
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

  const TeamModal = ({ x }) => (
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
                <small className="mu">{ct ? ct.title : i === 0 ? "Team Lead" : "No active task"}</small>
              </span>
            </span>
            <small className="mu">{["Online", "Away", "Offline"][(i + m.length) % 3]}</small>
          </div>
        );
      })}
      {L && (
          <button className="btn" onClick={() => setModal({ k: "assign", project: x.name })}>
            Assign Task
          </button>
        )}
    </Modal>
  );

  // Team lead: report to Super Admin
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
            <input type="file" onChange={(e) => setF({ ...f, att: e.target.files[0]?.name || "" })} />
          </label>
          <button className="btn">Submit Report</button>
        </form>
      </Modal>
    );
  };

  const TaskDetail = () => {
    const t = s.tasks.find((x) => x.id === route.id);
    const [chg, setChg] = useState(""),
      [dn, setDn] = useState(null);
    if (!t) {
      return <div className="card">Task not found.</div>;
    }
    const running = s.timer?.id === t.id;
    const done = t.status === "Completed";
    const items = t.checklist || [];
    const canTick = (t.assignee === u.name || L) && !done;

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

    // ---------- Team & task management (lead) ----------
    if (L) {
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

    // ---------- Task management (employee) ----------
    // To Do   -> [Start] [Reassign]
    // Running -> [Stop & Save] [Mark Complete]
    // Stopped -> [Resume] [Mark Complete]   (loops until Mark Complete)
    const needSave = s.stopped === t.id && t.status === "Stopped";

    let ctrl;
    if (done) {
      ctrl = <span className="mu">Task completed.</span>;
    } else if (needSave) {
      ctrl = (
        <div className="td-form">
          <label>
            Work description
            <textarea
              rows={4}
              autoFocus
              placeholder="Describe the work completed during this session..."
              value={chg}
              onChange={(e) => setChg(e.target.value)}
            />
          </label>
          <button
            className="btn"
            disabled={!chg.trim()}
            onClick={() => {
              if (!chg.trim()) {
                return;
              }
              up((d) => {
                log(d, t.id, "Work update: " + chg.trim());
                d.stopped = null;
              });
              setChg("");
              setToast("Changes saved");
            }}
          >
            Save Changes
          </button>
        </div>
      );
    } else if (dn !== null) {
      ctrl = (
        <div className="td-form">
          <label>
            Completion description
            <textarea
              rows={4}
              autoFocus
              placeholder="Describe the completed work and final outcome..."
              value={dn}
              onChange={(e) => setDn(e.target.value)}
            />
          </label>
          <button
            className="btn"
            disabled={!dn.trim()}
            onClick={() => {
              if (!dn.trim()) {
                return;
              }
              up((d) => {
                if (d.timer && d.timer.id === t.id) {
                  stopTimer(d);
                }
                const k = d.tasks.find((x) => x.id === t.id);
                k.status = "Completed";
                k.completedAt = now();
                log(d, t.id, "Completed: " + dn.trim());
                d.stopped = null;
              });
              setDn(null);
              setToast("Task completed");
            }}
          >
            Save &amp; Complete
          </button>
          <button className="btn sec" onClick={() => setDn(null)}>Cancel</button>
        </div>
      );
    } else if (t.status === "To Do") {
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
    } else if (running) {
      ctrl = (
        <div className="td-ctrlbtns">
          <button className="btn red" onClick={() => up(stopTimer)}>
            <Icon n="Square" s={16} />
            {" "}
            Stop &amp; Save
          </button>
          <button className="btn sec" onClick={() => setDn("")}>Mark Complete</button>
        </div>
      );
    } else {
      ctrl = (
        <div className="td-ctrlbtns">
          <button className="btn" onClick={() => startTimer(t)}>
            <Icon n="Play" s={16} />
            {" "}
            Resume
          </button>
          <button className="btn sec" onClick={() => setDn("")}>Mark Complete</button>
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
  const reportTask = p === "taskd" && L ? s.tasks.find((x) => x.id === route.id) : null;

  // ---------- Overview: Team & task management (lead) ----------
  if (p === "overview" && L) {
    const cnt = (st) => tasks.filter((t) => t.status === st).length;
    const reported = tasks.filter((t) => t.reports.length);
    const stats = [
      ["Projects", projects.length, "FolderKanban"],
      ["Team Members", new Set(projects.flatMap((x) => x.members)).size, "UsersRound"],
      ["Total Task", tasks.length, "ListTodo"],
      ["Completed", cnt("Completed"), "Check"],
      ["In Progress", cnt("In Progress"), "Zap"],
      ["Stopped", cnt("Stopped"), "Clock"],
    ];

    page = (
      <div className="grid">
        <h2 className="t">Overview</h2>

        <div className="lo-stats">
          {stats.map(([a, b, i]) => (
            <div key={a} className="card stat">
              <i className="ic"><Icon n={i} s={20} /></i>
              <div><span>{a}</span><b>{b}</b></div>
            </div>
          ))}
        </div>

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
            <b>Reports to Super Admin ({reported.reduce((a, t) => a + t.reports.length, 0)})</b>
            <div className="lo-scroll">
              {reported.map((t) => (
                <div key={t.id} className="lo-review" onClick={() => go({ p: "taskd", id: t.id })}>
                  <span>{t.title}<br /><small className="mu">{t.assignee}</small></span>
                  <span className="mu">{t.reports.length} sent</span>
                </div>
              ))}
              {!reported.length && <p className="mu">No reports sent yet.</p>}
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

  // ---------- Overview: Task management (employee) ----------
  if (p === "overview" && E) {
    const cnt = (st) => tasks.filter((t) => t.status === st).length;
    const cur = (s.timer && tasks.find((t) => t.id === s.timer.id)) ||
      tasks.find((t) => t.status === "In Progress" || t.status === "Stopped") ||
      null;
    const curRun = !!cur && s.timer?.id === cur.id;
    const curPending = !!cur && s.stopped === cur.id && cur.status === "Stopped";
    const upcomingList = tasks
      .filter((t) => t.status !== "Completed" && (!cur || t.id !== cur.id))
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

        <div className="lo-stats five">
          {stats.map(([a, b, i]) => (
            <div key={a} className="card stat">
              <i className="ic"><Icon n={i} s={20} /></i>
              <div><span>{a}</span><b>{b}</b></div>
            </div>
          ))}
        </div>

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
                          onClick={() => {
                            up(stopTimer);
                            go({ p: "taskd", id: cur.id });
                          }}
                        >
                          <Icon n="Square" s={16} />
                          {" "}
                          Stop &amp; Save
                        </button>
                      )
                      : curPending
                      ? (
                        <button className="btn" onClick={() => go({ p: "taskd", id: cur.id })}>
                          Save Changes
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
    page = (
      <div className="grid">
        <div className="row sp">
          <h2 className="t">Projects</h2>
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
          </div>
          <TaskTable list={tasks.filter((t) => t.project === x.name)} size="mid" />
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
          {L && (
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
          {L && (
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
                <b>{u.name}</b>
                <br />
                <small className="mu">{u.email}</small>
                <br />
                <small className="mu">Current: {WS[ws]}</small>
                <hr />
                {(u.ws || []).map((w) => (
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
                      d.stopped = null;
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
        <div className="page" key={JSON.stringify(route) + ws}>
          {p !== "overview" && (
            <div className="topbar">
              <BackBtn />
              {reportTask && (
                <button
                  className="btn report"
                  onClick={() => setModal({ k: "report", t: reportTask })}
                >
                  <Icon n="Send" s={18} />
                  Report
                </button>
              )}
            </div>
          )}
          {page}
        </div>
      </main>
      {modal?.k === "assign" && <Assign />}
      {modal?.k === "reassign" && <Reassign t={modal.t} />}
      {modal?.k === "team" && <TeamModal x={modal.x} />}
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
        {!l.length && <p className="mu" style={{ padding: 14 }}>No projects.</p>}
      </div>
    </>
  );
}

export default App;