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
  username: string;
  password: string;
};


type BoardCard = {
  id: string;
  title: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  column: "To do" | "In progress" | "Review" | "Completed";
};

type ChatMessage = {
  id: string;
  sender: string;
  senderInitials: string;
  text: string;
  time: string;
  isSelf?: boolean;
};

type TimeLogEntry = {
  id: string;
  time: string;
  user: string;
  userInitials: string;
  activity: string;
  task: string;
  duration: string;
  event: "Started" | "Stopped" | "Updated" | "Completed" | "Comment";
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Team Lead" | "Member" | "Admin";
  activeTasks: number;
  status: "Active" | "Away" | "Offline";
};

type AppNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  type: "task" | "chat" | "mention" | "system";
};

type Task = {
  id: string;
  title: string;
  project: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: "In progress" | "To do" | "Review" | "Completed";
  assignedBy?: string;
  assignedByInitials?: string;
  projectCode?: string;
  projectBadgeColor?: string;
  description?: string;
  acceptanceChecklist?: { id: string; text: string; completed: boolean }[];
  timeSpentSeconds?: number;
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
    id: "TASK-1043",
    title: "Update customer onboarding flow",
    project: "Client Portal",
    projectCode: "C",
    projectBadgeColor: "#d8f3ec",
    assignedBy: "Maya Chen",
    assignedByInitials: "MC",
    due: "Today",
    priority: "High",
    status: "In progress",
    description:
      "Redesign mobile responsive cards and simplify team invitation steps during onboarding.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Responsive audit on mobile and tablet", completed: true },
      { id: "chk-2", text: "Email validation on multi-invite input", completed: false },
    ],
    timeSpentSeconds: 42 * 60 + 18,
  },
  {
    id: "TASK-1044",
    title: "Prepare sprint review notes",
    project: "Team Workspace",
    projectCode: "T",
    projectBadgeColor: "#dcf4e4",
    assignedBy: "Arun Patel",
    assignedByInitials: "AP",
    due: "Tomorrow",
    priority: "Medium",
    status: "To do",
    description: "Aggregate completed deliverables, milestone charts, and blocker retrospectives.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Export Jira burndown chart", completed: false },
      { id: "chk-2", text: "Share slide deck draft with leads", completed: false },
    ],
    timeSpentSeconds: 0,
  },
  {
    id: "TASK-1045",
    title: "Review notification settings",
    project: "Work Flow App",
    projectCode: "W",
    projectBadgeColor: "#d7f3ea",
    assignedBy: "Priya Shah",
    assignedByInitials: "PS",
    due: "26 Oct",
    priority: "Low",
    status: "Review",
    description: "Validate granular notification preference toggles across email, web push, and in-app feeds.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Test mute notification window", completed: true },
      { id: "chk-2", text: "Verify database preference sync", completed: true },
    ],
    timeSpentSeconds: 15 * 60,
  },
  {
    id: "TASK-1046",
    title: "Complete API documentation",
    project: "Platform Upgrade",
    projectCode: "P",
    projectBadgeColor: "#d8f2ee",
    assignedBy: "Maya Chen",
    assignedByInitials: "MC",
    due: "27 Oct",
    priority: "High",
    status: "To do",
    description: "Document public webhook payloads and developer token authentication methods.",
    acceptanceChecklist: [
      { id: "chk-1", text: "OpenAPI 3.1 specification sync", completed: false },
      { id: "chk-2", text: "cURL code snippets verified", completed: false },
    ],
    timeSpentSeconds: 0,
  },
  {
    id: "TASK-1049",
    title: "Polish the workspace overview",
    project: "Work Flow App",
    projectCode: "W",
    projectBadgeColor: "#d7f3ea",
    assignedBy: "Arun Patel",
    assignedByInitials: "AP",
    due: "29 Oct",
    priority: "Medium",
    status: "In progress",
    description: "Refine dashboard layout, metric cards hierarchy, and theme consistency across all pages.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Inspect all primary action buttons", completed: true },
      { id: "chk-2", text: "Ensure full responsiveness on tablet view", completed: false },
    ],
    timeSpentSeconds: 24 * 60,
  },
  {
    id: "TASK-1042",
    title: "Implement invoice export endpoint",
    project: "Client Portal",
    projectCode: "C",
    projectBadgeColor: "#d8f3ec",
    assignedBy: "Maya Chen",
    assignedByInitials: "MC",
    due: "30 Oct",
    priority: "High",
    status: "In progress",
    description:
      "Create a secure endpoint to export invoice line items to Excel. Include invoice metadata, tax breakdown, totals, and validation errors.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Correct invoice and financial year", completed: false },
      { id: "chk-2", text: "GST totals match invoice preview", completed: false },
      { id: "chk-3", text: "Permission check and error handling", completed: false },
      { id: "chk-4", text: "Automated tests added", completed: false },
    ],
    timeSpentSeconds: 18 * 60 + 42,
  },
];


const initialBoardCards: BoardCard[] = [
  { id: "tb-1", title: "Review GST rules", project: "Invoice module", assignee: "A. Kumar", assigneeInitials: "AK", due: "Today", priority: "High", column: "To do" },
  { id: "tb-2", title: "Client update note", project: "Northstar portal", assignee: "K. Meena", assigneeInitials: "KM", due: "14 Oct", priority: "Medium", column: "To do" },
  { id: "tb-3", title: "Invoice export API", project: "Billing Portal", assignee: "Dhi Kumar", assigneeInitials: "DK", due: "Today", priority: "High", column: "In progress" },
  { id: "tb-4", title: "Quote PDF layout", project: "Billing Portal", assignee: "S. Raj", assigneeInitials: "SR", due: "13 Oct", priority: "Medium", column: "In progress" },
  { id: "tb-5", title: "Tax calculation tests", project: "Billing Portal", assignee: "Priya Sharma", assigneeInitials: "PS", due: "Today", priority: "High", column: "Review" },
  { id: "tb-6", title: "Auth middleware", project: "Northstar portal", assignee: "Rahul Kumar", assigneeInitials: "RK", due: "Done", priority: "Low", column: "Completed" },
  { id: "tb-7", title: "Base UI shell", project: "Marketing site", assignee: "Dhi Kumar", assigneeInitials: "DK", due: "Done", priority: "Low", column: "Completed" },
];

const initialChannels = [
  { id: "ch-alpha", name: "Team Alpha", description: "Sprint updates", unreadCount: 3 },
  { id: "ch-beta", name: "Team Beta", description: "Design review", unreadCount: 0 },
  { id: "ch-delta", name: "Team Delta", description: "Daily stand-up", unreadCount: 1 },
  { id: "ch-billing", name: "Billing Portal", description: "Feature discussion", unreadCount: 0 },
];

const initialChatMessages: Record<string, ChatMessage[]> = {
  "ch-alpha": [
    { id: "m-1", sender: "Priya S.", senderInitials: "PS", text: "Please share the API test status.", time: "10:18 AM" },
    { id: "m-2", sender: "You", senderInitials: "AD", text: "Tests are passing locally; CI run is next.", time: "10:22 AM", isSelf: true },
    { id: "m-3", sender: "Kiran M.", senderInitials: "KM", text: "I can review the PR after lunch.", time: "10:29 AM" },
  ],
  "ch-beta": [
    { id: "m-b1", sender: "Maya Chen", senderInitials: "MC", text: "Figma wireframes updated for mobile navigation.", time: "09:40 AM" },
  ],
  "ch-delta": [
    { id: "m-d1", sender: "Rahul K.", senderInitials: "RK", text: "Working on Northstar portal client notes today.", time: "09:15 AM" },
  ],
  "ch-billing": [
    { id: "m-bl1", sender: "Priya S.", senderInitials: "PS", text: "Reviewing tax invoice export endpoint requirements.", time: "08:50 AM" },
  ],
};

const initialDirectContacts = [
  { id: "dm-priya", name: "Priya Sharma", initials: "PS", role: "Team Lead", status: "Online" },
  { id: "dm-kiran", name: "Kiran Menon", initials: "KM", role: "QA Engineer", status: "Online" },
  { id: "dm-rahul", name: "Rahul Kumar", initials: "RK", role: "Frontend Dev", status: "Away" },
  { id: "dm-maya", name: "Maya Chen", initials: "MC", role: "Product Manager", status: "Online" },
  { id: "dm-arun", name: "Arun Patel", initials: "AP", role: "Backend Dev", status: "Offline" },
];

const initialDirectMessages: Record<string, ChatMessage[]> = {
  "dm-priya": [
    { id: "dm-1", sender: "Priya Sharma", senderInitials: "PS", text: "Please share the API test status.", time: "10:18 AM" },
    { id: "dm-2", sender: "You", senderInitials: "AD", text: "Tests are passing locally; CI run is next.", time: "10:22 AM", isSelf: true },
    { id: "dm-3", sender: "Priya Sharma", senderInitials: "PS", text: "Great! Please link the PR when ready so we can merge before sprint demo.", time: "10:25 AM" },
  ],
  "dm-kiran": [
    { id: "dm-k1", sender: "Kiran Menon", senderInitials: "KM", text: "Attached the automated invoice test coverage report.", time: "09:50 AM" },
  ],
  "dm-rahul": [
    { id: "dm-r1", sender: "Rahul Kumar", senderInitials: "RK", text: "Completed the client history timeline component.", time: "Yesterday" },
  ],
  "dm-maya": [
    { id: "dm-m1", sender: "Maya Chen", senderInitials: "MC", text: "Checking sprint goals for this Thursday release.", time: "Yesterday" },
  ],
  "dm-arun": [
    { id: "dm-a1", sender: "Arun Patel", senderInitials: "AP", text: "Database migration completed for invoice totals.", time: "23 Oct" },
  ],
};

const initialTimeLogs: TimeLogEntry[] = [
  { id: "tl-1", time: "10:42", user: "Dhi Kumar", userInitials: "DK", activity: "Started task timer", task: "Invoice export", duration: "01:24:36", event: "Started" },
  { id: "tl-2", time: "10:17", user: "Priya Sharma", userInitials: "PS", activity: "Reassigned task", task: "GST review", duration: "—", event: "Updated" },
  { id: "tl-3", time: "09:52", user: "Kiran Menon", userInitials: "KM", activity: "Marked complete", task: "API tests", duration: "00:42:10", event: "Completed" },
  { id: "tl-4", time: "Yesterday", user: "Rahul Kumar", userInitials: "RK", activity: "Added comment", task: "Client update", duration: "—", event: "Comment" },
  { id: "tl-5", time: "Yesterday", user: "Dhi Kumar", userInitials: "DK", activity: "Stopped timer", task: "Invoice export", duration: "00:36:12", event: "Stopped" },
  { id: "tl-6", time: "24 Oct", user: "Maya Chen", userInitials: "MC", activity: "Created task", task: "Workspace overview", duration: "—", event: "Started" },
  { id: "tl-7", time: "23 Oct", user: "Arun Patel", userInitials: "AP", activity: "Logged time", task: "Sprint notes", duration: "02:15:00", event: "Stopped" },
];

const initialTeamMembers: TeamMember[] = [
  { id: "tm-1", name: "Priya Sharma", email: "priya@company.in", role: "Team Lead", activeTasks: 4, status: "Active" },
  { id: "tm-2", name: "Dhi Kumar", email: "dhi@company.in", role: "Member", activeTasks: 3, status: "Active" },
  { id: "tm-3", name: "Kiran Menon", email: "kiran@company.in", role: "Member", activeTasks: 2, status: "Active" },
  { id: "tm-4", name: "Rahul Kumar", email: "rahul@company.in", role: "Member", activeTasks: 5, status: "Active" },
  { id: "tm-5", name: "Meena Raj", email: "meena@company.in", role: "Member", activeTasks: 1, status: "Active" },
  { id: "tm-6", name: "Arun Patel", email: "arun@company.in", role: "Member", activeTasks: 3, status: "Active" },
];

const initialNotifications: AppNotification[] = [
  { id: "n-1", title: "Task assigned to you", detail: "Priya Sharma assigned you TASK-1042: Implement invoice export endpoint", time: "2 min ago", unread: true, type: "task" },
  { id: "n-2", title: "API Tests completed", detail: "Kiran Menon marked API test cases as Completed in Billing Portal", time: "18 min ago", unread: true, type: "task" },
  { id: "n-3", title: "Team Alpha update", detail: "New message in Team Alpha sprint channel: Sprint review notes", time: "42 min ago", unread: true, type: "chat" },
  { id: "n-4", title: "Mention in Northstar Portal", detail: "Rahul Kumar mentioned you in client progress notes", time: "1 hr ago", unread: false, type: "mention" },
  { id: "n-5", title: "Timesheet summary ready", detail: "Weekly time audit recorded 18h 35m across 12 tasks", time: "Yesterday", unread: false, type: "system" },
];

const activities = [
  { title: "Maya created a new task", time: "4 min ago", icon: "＋" },
  { title: "Arun shared sprint notes", time: "16 min ago", icon: "↗" },
  { title: "Design team updated a board", time: "38 min ago", icon: "▤" },
  { title: "New message from Priya", time: "1 hr ago", icon: "✉" },
];

type AuthStep = "welcome" | "signin" | "signup-profile" | "verify-phone" | "signup-credentials" | "forgot";

function TeamIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function App() {
  const [authStep, setAuthStep] = useState<AuthStep>("welcome");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [loginId, setLoginId] = useState("");
  const [activePage, setActivePage] = useState<PageName>("Dashboard");
  const [pageHistory, setPageHistory] = useState<PageName[]>([]);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [elapsed, setElapsed] = useState(42 * 60 + 18);
  const [timerRunning, setTimerRunning] = useState(true);
  const [notice, setNotice] = useState("");

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.closest('button') || target.closest('a') || target.closest('input') || target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'A')) {
        setCursorHovered(true);
      } else {
        setCursorHovered(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<"all" | "assigned-to-me">("all");
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>("all");
  const [taskFilterPriority, setTaskFilterPriority] = useState<string>("all");
  const [taskSearchQuery, setTaskSearchQuery] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("TASK-1042");
  const [taskTimerActive, setTaskTimerActive] = useState<boolean>(false);

  // Team Board state
  const [boardCards, setBoardCards] = useState<BoardCard[]>(initialBoardCards);

  // Team Chat state
  const [activeChannelId, setActiveChannelId] = useState<string>("ch-alpha");
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [chatInputText, setChatInputText] = useState<string>("");

  // Direct Messages state
  const [activeDmContactId, setActiveDmContactId] = useState<string>("dm-priya");
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>(initialDirectMessages);
  const [dmInputText, setDmInputText] = useState<string>("");

  // Time Logs state
  const [timeLogs, setTimeLogs] = useState<TimeLogEntry[]>(initialTimeLogs);
  const [timeLogUserFilter, setTimeLogUserFilter] = useState<string>("all");
  const [timeLogEventFilter, setTimeLogEventFilter] = useState<string>("all");

  // Team Members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState<boolean>(false);
  const [taskActionModal, setTaskActionModal] = useState<"complete" | "reassign" | "stop-timer" | null>(null);
  const [taskActionNote, setTaskActionNote] = useState<string>("");
  const [taskReassignTo, setTaskReassignTo] = useState<string>("");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskProject, setNewTaskProject] = useState<string>("Billing Portal");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>("Dhi Kumar");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newTaskDue, setNewTaskDue] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [newTaskChecklist, setNewTaskChecklist] = useState<string>("");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<"Team Lead" | "Member" | "Admin">("Member");

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [notificationFilter, setNotificationFilter] = useState<"all" | "unread">("all");

  // User Profile & Settings state
  const [profileDepartment, setProfileDepartment] = useState<string>("Product & Engineering");
  const [profileTimezone, setProfileTimezone] = useState<string>("IST (UTC+05:30)");
  const [workspaceNameSetting, setWorkspaceNameSetting] = useState<string>("Work Flow Workspace");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState<boolean>(true);


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
  const initials = userName.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!taskTimerActive || !selectedTaskId) return;
    const interval = window.setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === selectedTaskId
            ? { ...t, timeSpentSeconds: (t.timeSpentSeconds || 0) + 1 }
            : t
        )
      );
    }, 1000);
    return () => window.clearInterval(interval);
  }, [taskTimerActive, selectedTaskId]);

  useEffect(() => {
    if (!timerRunning || !isLoggedIn) return;
    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
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
    return [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
  };

  const enterDashboard = () => {
    setIsLoggedIn(true);
    setActivePage("Dashboard");
    setPageHistory([]);
    setSearch("");
    setProfileOpen(false);
    setNotice("");
  };

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const existingAccount = savedAccount();
    const identifier = loginId.trim().toLowerCase();
    const validDemo = identifier === "abc@gmail.com" && password === "123456";
    const validNewAccount = existingAccount &&
      (existingAccount.email.toLowerCase() === identifier || (existingAccount.username || "").toLowerCase() === identifier) &&
      existingAccount.password === password;
    if (validDemo || validNewAccount) {
      setLoginId(""); setPassword(""); enterDashboard();
    } else {
      setNotice("That username or password doesn't match. Try again or reset your password.");
    }
  };

  const handleCreateProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthStep("verify-phone");
    setNotice("For this frontend demo, enter any 4-digit code to continue.");
  };

  const handleVerifyPhone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp.trim().length < 4) { setNotice("Enter a 4-digit verification code."); return; }
    setNotice("");
    setOtp("");
    setAuthStep("signup-credentials");
  };

  const handleCreateAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newAccount: Account = { name, email, phone, username, password };
    try {
      localStorage.setItem("workflowAccount", JSON.stringify(newAccount));
    } catch {
      setNotice("Could not save the account in this browser.");
      return;
    }
    enterDashboard();
  };

  const handleForgotPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const existingAccount = savedAccount();
    const id = loginId.trim().toLowerCase();
    const matches = existingAccount && (existingAccount.email.toLowerCase() === id || (existingAccount.username || "").toLowerCase() === id);
    if (matches) setNotice("Account found. Password reset is a frontend-only demo; return to sign in to continue.");
    else setNotice("No account found for that username or email.");
  };

  const navigateTo = (page: PageName) => {
    if (page === activePage) { setProfileOpen(false); return; }
    setPageHistory((history) => [...history, activePage]);
    setActivePage(page); setProfileOpen(false); setSearch("");
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const previous = pageHistory[pageHistory.length - 1];
      setPageHistory((history) => history.slice(0, -1));
      setActivePage(previous); setProfileOpen(false);
    } else if (activePage !== "Dashboard") setActivePage("Dashboard");
  };

  const logout = () => {
    setIsLoggedIn(false); setAuthStep("signin"); setEmail(""); setPassword("");
    setLoginId(""); setActivePage("Dashboard"); setPageHistory([]); setProfileOpen(false); setNotice("");
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.project} ${task.due} ${task.priority} ${task.status}`.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredMenu = menuItems.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
  const markTimerSaved = () => { setTimerRunning(false); setNotice("Time entry saved successfully."); };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const toggleChecklistItem = (checkId: string) => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              acceptanceChecklist: (t.acceptanceChecklist || []).map((c) =>
                c.id === checkId ? { ...c, completed: !c.completed } : c
              ),
            }
          : t
      )
    );
  };

  const toggleTaskTimer = () => {
    setTaskTimerActive((prev) => !prev);
    setNotice(taskTimerActive ? "Task timer paused." : "Task timer started.");
  };

  const markTaskCompleted = () => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, status: t.status === "Completed" ? "In progress" : "Completed" }
          : t
      )
    );
    setNotice(
      selectedTask.status === "Completed"
        ? `Task ${selectedTask.id} moved back to In progress.`
        : `Task ${selectedTask.id} marked as completed!`
    );
  };

  const reassignTask = () => {
    if (!selectedTask) return;
    setNotice(`Reassign workflow opened for ${selectedTask.id}`);
  };


  const activeChannel = initialChannels.find((channel) => channel.id === activeChannelId) || initialChannels[0];
  const activeDmContact = initialDirectContacts.find((contact) => contact.id === activeDmContactId) || initialDirectContacts[0];
  const visibleNotifications = notifications.filter((item) => notificationFilter === "all" || item.unread);

  const sendChatMessage = (event: FormEvent) => {
    event.preventDefault();
    const text = chatInputText.trim();
    if (!text) return;
    const message: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "You",
      senderInitials: initials || "AD",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };
    setChatMessages((previous) => ({ ...previous, [activeChannelId]: [...(previous[activeChannelId] || []), message] }));
    setChatInputText("");
  };

  const sendDirectMessage = (event: FormEvent) => {
    event.preventDefault();
    const text = dmInputText.trim();
    if (!text) return;
    const message: ChatMessage = {
      id: `dm-${Date.now()}`,
      sender: "You",
      senderInitials: initials || "AD",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };
    setDirectMessages((previous) => ({ ...previous, [activeDmContactId]: [...(previous[activeDmContactId] || []), message] }));
    setDmInputText("");
  };

  const createTaskFromForm = (event: FormEvent) => {
    event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    const assignee = newTaskAssignee;
    const assigneeInitials = assignee.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    const newTask: Task = {
      id: `TASK-${1050 + tasks.length}`,
      title,
      project: newTaskProject,
      due: newTaskDue || "Tomorrow",
      priority: newTaskPriority,
      status: "To do",
      assignedBy: assignee,
      assignedByInitials: assigneeInitials,
      projectCode: newTaskProject.charAt(0).toUpperCase(),
      projectBadgeColor: "#dcf2ec",
      description: newTaskDescription.trim(),
      acceptanceChecklist: newTaskChecklist.split("\n").map((text, index) => ({ id: `new-${Date.now()}-${index}`, text: text.trim(), completed: false })).filter((item) => item.text),
      timeSpentSeconds: 0,
    };
    setTasks((previous) => [newTask, ...previous]);
    setBoardCards((previous) => [{ id: `tb-${Date.now()}`, title, project: newTaskProject, assignee, assigneeInitials, due: newTask.due, priority: newTaskPriority, column: "To do" }, ...previous]);
    setSelectedTaskId(newTask.id);
    setNewTaskTitle(""); setNewTaskDescription(""); setNewTaskChecklist(""); setNewTaskDue(""); setNewTaskPriority("Medium");
    setShowCreateTaskModal(false);
    setNotice(`Task “${title}” created and assigned to ${assignee}.`);
    navigateTo("My Tasks");
  };

  const addTeamMember = (event: FormEvent) => {
    event.preventDefault();
    const memberName = newMemberName.trim();
    const memberEmail = newMemberEmail.trim();
    if (!memberName || !memberEmail) return;
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: memberName,
      email: memberEmail,
      role: newMemberRole,
      activeTasks: 0,
      status: "Active",
    };
    setTeamMembers((previous) => [...previous, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("Member");
    setShowAddMemberModal(false);
    setNotice(`${memberName} was added to Team Alpha.`);
  };

  const markAllNotificationsRead = () => {
    setNotifications((previous) => previous.map((item) => ({ ...item, unread: false })));
    setNotice("All notifications marked as read.");
  };

  if (!isLoggedIn) {
    const authTitle: Record<AuthStep, string> = {
      welcome: "Your team workspace starts here.",
      signin: "Sign in to your account",
      "signup-profile": "Create your account",
      "verify-phone": "Verify your phone",
      "signup-credentials": "Choose your sign-in details",
      forgot: "Reset your password",
    };
    const authSubtitle: Record<AuthStep, string> = {
      welcome: "Organize work, bring your team together, and keep everything moving.",
      signin: "Enter your details to access your team workspace.",
      "signup-profile": "Tell us a little about yourself to get started.",
      "verify-phone": `We'll verify ${phone || "your phone number"} before you continue.`,
      "signup-credentials": "Choose a username and password for your new account.",
      forgot: "Enter your username or email to check for your account.",
    };

    return (
      <main className={`auth-page auth-step-${authStep}`}>

        {/* Interactive cursor-following atmospheric blur spotlight */}
        <div 
          className="cursor-spotlight-blur" 
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            opacity: cursorPos.x >= 0 ? 1 : 0
          }}
        />

        <section className="brand-panel">
          <div className="brand">
            <span className="brand-logo" aria-label="Team"><TeamIcon /></span>
            <div><strong>WORK FLOW</strong><small>INVOICE + TEAM</small></div>
          </div>
          <div className="brand-message" key={authStep === "welcome" ? "brand-welcome" : "brand-auth"}>
            <span className="brand-eyebrow">TEAM PORTAL</span>
            <h1>Welcome to<br />Work Flow.</h1>
            <p>Your work, your team, and your business — all in one place.</p>
            {authStep === "welcome" && (
              <button
                className="welcome-signin-button"
                type="button"
                onClick={() => {
                  setAuthStep("signin");
                  setNotice("");
                }}
              >
                <span>Sign in</span>
                <span className="button-arrow">→</span>
              </button>
            )}
          </div>
          <small className="brand-footer">A better way to work together.</small>
        </section>

        <section className="form-panel">
          {authStep !== "welcome" && (
            <div className="form-content">
            <div className="form-step-inner" key={authStep}>
              <span className="eyebrow">{authStep.startsWith("signup") || authStep === "verify-phone" ? "GET STARTED" : authStep === "forgot" ? "ACCOUNT RECOVERY" : "WELCOME BACK"}</span>
              <h2>{authTitle[authStep]}</h2>
              <p className="subtitle">{authSubtitle[authStep]}</p>

              {authStep === "signin" && <form onSubmit={handleSignIn}>
                <label htmlFor="loginId">Username or email</label>
                <input id="loginId" type="text" placeholder="Enter your username or email" autoComplete="username" value={loginId} onChange={(event) => setLoginId(event.target.value)} required />
                <div className="form-label-row"><label htmlFor="loginPassword">Password</label><button type="button" className="inline-link" onClick={() => { setAuthStep("forgot"); setNotice(""); }}>Forgot password?</button></div>
                <div className="password-field"><input id="loginPassword" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" className="show-password" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Hide" : "Show"}</button></div>
                <button className="submit-button" type="submit"><span>Sign in</span><span className="button-arrow">→</span></button>
              </form>}

              {authStep === "signup-profile" && <form onSubmit={handleCreateProfile}>
                <label htmlFor="fullName">Full name</label><input id="fullName" type="text" placeholder="Enter your full name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
                <label htmlFor="signupEmail">Email address</label><input id="signupEmail" type="email" placeholder="name@example.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <label htmlFor="phone">Phone number</label><input id="phone" type="tel" placeholder="Enter your phone number" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
                <button className="submit-button" type="submit"><span>Continue to phone verification</span><span className="button-arrow">→</span></button>
              </form>}

              {authStep === "verify-phone" && <form onSubmit={handleVerifyPhone}>
                <div className="verification-note"><span className="verification-icon">✓</span><div><strong>Phone verification</strong><small>Frontend demo only: no SMS is sent.</small></div></div>
                <label htmlFor="otp">4-digit verification code</label><input id="otp" type="text" inputMode="numeric" maxLength={6} placeholder="Enter any 4-digit code" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} required />
                <button className="submit-button" type="submit"><span>Verify and continue</span><span className="button-arrow">→</span></button>
              </form>}

              {authStep === "signup-credentials" && <form onSubmit={handleCreateAccount}>
                <label htmlFor="username">Username</label><input id="username" type="text" placeholder="Choose a username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
                <label htmlFor="newPassword">Password</label><div className="password-field"><input id="newPassword" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required /><button type="button" className="show-password" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Hide" : "Show"}</button></div>
                <button className="submit-button" type="submit"><span>Create account</span><span className="button-arrow">→</span></button>
              </form>}

              {authStep === "forgot" && <form onSubmit={handleForgotPassword}>
                <label htmlFor="recoveryId">Username or email</label><input id="recoveryId" type="text" placeholder="Enter your username or email" value={loginId} onChange={(event) => setLoginId(event.target.value)} required />
                <button className="submit-button" type="submit"><span>Find account</span><span className="button-arrow">→</span></button>
              </form>}

              {notice && <p className="auth-notice" role="status">{notice}</p>}
              <p className="switch-form">
                {authStep === "signin" ? <>New to Work Flow? <button type="button" onClick={() => { setAuthStep("signup-profile"); setNotice(""); }}>Create new account →</button></> : authStep === "forgot" ? <>Remembered your password? <button type="button" onClick={() => { setAuthStep("signin"); setNotice(""); }}>Back to sign in →</button></> : <>Already have an account? <button type="button" onClick={() => { setAuthStep("signin"); setNotice(""); setPassword(""); }}>Sign in →</button></>}
              </p>
              <footer>© 2026 Work Flow. All rights reserved.</footer>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo" aria-label="Team"><TeamIcon /></span>
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
                  : activePage === "My Tasks"
                    ? "My tasks"
                    : activePage === "Team Board"
                      ? "Team board"
                      : activePage === "Create Task"
                        ? `${selectedTask?.id || "TASK-1042"} · ${selectedTask?.project || "BILLING PORTAL"}`
                        : activePage === "Team Chat"
                          ? "Team chat"
                          : activePage === "Direct Messages"
                            ? "Direct messages"
                            : activePage === "Time Logs"
                              ? "Activity & time logs"
                              : activePage === "Team Members"
                                ? "Team members & permissions"
                                : activePage === "Notifications"
                                  ? "Notifications"
                                  : activePage === "Profile"
                                    ? "Profile & account"
                                    : "Workspace settings"}
              </h1>
              <p>
                {activePage === "Dashboard"
                  ? "Personal work queue, active timer, team updates, and upcoming deadlines."
                  : activePage === "My Tasks"
                    ? "Search and filter assigned, created, and delegated tasks."
                    : activePage === "Team Board"
                      ? "See team work by status, owner, priority, and due date."
                      : activePage === "Create Task"
                        ? (selectedTask?.title || "Implement invoice export endpoint")
                        : activePage === "Team Chat"
                          ? "Group conversations, mentions, attachments, and read state."
                          : activePage === "Direct Messages"
                            ? "One-to-one communication with teammates."
                            : activePage === "Time Logs"
                              ? "Audit task changes and review recorded time by task and date."
                              : activePage === "Team Members"
                                ? "Leads can add members; role permissions control who can assign or reassign."
                                : activePage === "Notifications"
                                  ? "Workspace notifications, mentions, and updates."
                                  : activePage === "Profile"
                                    ? "Manage your personal profile, credentials, and work assignments."
                                    : "Configure workspace branding, members default rules, and integrations."}
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder={
                  activePage === "Dashboard"
                    ? "Search anything in dashboard..."
                    : activePage === "My Tasks"
                      ? "Search tasks, project, assignee..."
                      : `Search in ${activePage.toLowerCase()}...`
                }
                aria-label={`Search ${activePage}`}
                value={activePage === "My Tasks" ? taskSearchQuery : search}
                onChange={(event) => {
                  if (activePage === "My Tasks") {
                    setTaskSearchQuery(event.target.value);
                  } else {
                    setSearch(event.target.value);
                  }
                }}
              />
              {(activePage === "My Tasks" ? taskSearchQuery : search) && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    if (activePage === "My Tasks") {
                      setTaskSearchQuery("");
                    } else {
                      setSearch("");
                    }
                  }}
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
              <div className="section-heading dashboard-meta-heading">
                <div className="dashboard-meta-pill">
                  <span className="meta-dot"></span>
                  <span>Active Workspace</span>
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
                        <tr
                          key={task.id || task.title}
                          className="clickable-task-row"
                          onClick={() => {
                            setSelectedTaskId(task.id);
                            navigateTo("Create Task");
                          }}
                          title="Click to view task details & controls"
                        >
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
          ) : activePage === "My Tasks" ? (
            <section className="my-tasks-page">
              {/* Header block strictly matching reference screenshot */}
              <div className="tasks-page-header">
                <div className="tasks-page-title-group">
                  <span className="tasks-pre-heading">YOUR WORKSPACE</span>
                  <h1 className="tasks-main-heading">My tasks</h1>
                  <p className="tasks-sub-heading">
                    Keep your priorities clear and your next steps moving.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-new-task-green"
                  onClick={() => setShowCreateTaskModal(true)}
                >
                  <span className="plus-sign">+</span>
                  <span>New task</span>
                </button>
              </div>

              {/* Filter bar card */}
              <div className="tasks-filter-bar-card">
                <div className="tasks-search-field">
                  <svg
                    className="search-mag-icon"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search tasks or projects"
                    value={taskSearchQuery}
                    onChange={(e) => setTaskSearchQuery(e.target.value)}
                  />
                  {taskSearchQuery && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setTaskSearchQuery("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="tasks-filter-controls">
                  <label className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={taskFilterAssignee === "assigned-to-me"}
                      onChange={(e) =>
                        setTaskFilterAssignee(e.target.checked ? "assigned-to-me" : "all")
                      }
                    />
                    <span className="custom-check-pill" />
                    <span className="check-text">Assigned to me</span>
                  </label>

                  <div className="filter-dropdown-pill">
                    <span className="pill-prefix">Status</span>
                    <select
                      value={taskFilterStatus}
                      onChange={(e) => setTaskFilterStatus(e.target.value)}
                    >
                      <option value="all">All statuses</option>
                      <option value="In progress">In progress</option>
                      <option value="To do">To do</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <span className="dropdown-caret">⌄</span>
                  </div>

                  <div className="filter-dropdown-pill">
                    <span className="pill-prefix">Priority</span>
                    <select
                      value={taskFilterPriority}
                      onChange={(e) => setTaskFilterPriority(e.target.value)}
                    >
                      <option value="all">All priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <span className="dropdown-caret">⌄</span>
                  </div>

                  <button
                    type="button"
                    className="filter-reset-link"
                    onClick={() => {
                      setTaskSearchQuery("");
                      setTaskFilterAssignee("all");
                      setTaskFilterStatus("all");
                      setTaskFilterPriority("all");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Table meta count and sorting indicator */}
              {(() => {
                const currentFiltered = tasks.filter((task) => {
                  const query = taskSearchQuery.toLowerCase().trim();
                  const matchesSearch =
                    !query ||
                    `${task.title} ${task.project} ${task.assignedBy || ""} ${task.due} ${task.priority} ${task.status}`
                      .toLowerCase()
                      .includes(query);
                  const matchesStatus =
                    taskFilterStatus === "all" || task.status === taskFilterStatus;
                  const matchesPriority =
                    taskFilterPriority === "all" || task.priority === taskFilterPriority;
                  const matchesAssignee =
                    taskFilterAssignee === "all" ||
                    (task.assignedBy &&
                      (task.assignedBy.toLowerCase().includes("arun") ||
                        task.assignedBy.toLowerCase().includes("director") ||
                        task.assignedBy === "You"));
                  return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
                });

                return (
                  <>
                    <div className="tasks-list-meta-row">
                      <span className="tasks-count-label">
                        <strong>{currentFiltered.length}</strong> tasks
                      </span>
                      <span className="tasks-sort-label">Sorted by due date</span>
                    </div>

                    <div className="tasks-table-container-card">
                      <table className="screenshot-tasks-table">
                        <thead>
                          <tr>
                            <th scope="col" className="col-task">TASK</th>
                            <th scope="col" className="col-project">PROJECT</th>
                            <th scope="col" className="col-assigned">ASSIGNED BY</th>
                            <th scope="col" className="col-due">DUE DATE</th>
                            <th scope="col" className="col-priority">PRIORITY</th>
                            <th scope="col" className="col-status">STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFiltered.map((task) => {
                            const isToday = task.due.toLowerCase() === "today";
                            const pCode =
                              task.projectCode ||
                              (task.project.charAt(0) || "P").toUpperCase();
                            const assignInitials =
                              task.assignedByInitials ||
                              (task.assignedBy
                                ? task.assignedBy
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "TM");

                            return (
                              <tr
                                key={task.id}
                                className="screenshot-task-row"
                                onClick={() => {
                                  setSelectedTaskId(task.id);
                                  navigateTo("Create Task");
                                }}
                                title="Click to view and edit task"
                              >
                                <td className="cell-task">
                                  <div className="cell-task-inner">
                                    <span
                                      className="task-circle-indicator"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTasks((prev) =>
                                          prev.map((t) =>
                                            t.id === task.id
                                              ? {
                                                  ...t,
                                                  status:
                                                    t.status === "Completed"
                                                      ? "In progress"
                                                      : "Completed",
                                                }
                                              : t
                                          )
                                        );
                                      }}
                                      title={
                                        task.status === "Completed"
                                          ? "Mark incomplete"
                                          : "Mark complete"
                                      }
                                    >
                                      <span className="sub-ring">
                                        {task.status === "Completed" ? "✓" : "○"}
                                      </span>
                                    </span>
                                    <span className="task-title-text">{task.title}</span>
                                  </div>
                                </td>

                                <td className="cell-project">
                                  <div className="cell-project-inner">
                                    <span
                                      className="project-code-badge"
                                      style={{
                                        backgroundColor:
                                          task.projectBadgeColor || "#dcf2ec",
                                      }}
                                    >
                                      {pCode}
                                    </span>
                                    <span className="project-name-text">{task.project}</span>
                                  </div>
                                </td>

                                <td className="cell-assigned">
                                  <div className="cell-assigned-inner">
                                    <span className="assignee-avatar-badge">
                                      {assignInitials}
                                    </span>
                                    <span className="assignee-name-text">
                                      {task.assignedBy || "Unassigned"}
                                    </span>
                                  </div>
                                </td>

                                <td className="cell-due">
                                  <span
                                    className={`due-date-text ${
                                      isToday ? "due-today-accent" : ""
                                    }`}
                                  >
                                    {task.due}
                                  </span>
                                </td>

                                <td className="cell-priority">
                                  <span
                                    className={`priority-capsule ${task.priority.toLowerCase()}`}
                                  >
                                    {task.priority}
                                  </span>
                                </td>

                                <td className="cell-status">
                                  <span
                                    className={`status-capsule ${task.status
                                      .toLowerCase()
                                      .replace(" ", "-")}`}
                                  >
                                    {task.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}

                          {currentFiltered.length === 0 && (
                            <tr>
                              <td colSpan={6} className="empty-tasks-state">
                                No tasks match your current filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </section>
          ) : activePage === "Team Board" ? (
            <section className="team-board-page">
              <div className="board-toolbar-row">
                <div className="board-filter-note"><span className="board-live-dot" /> Live team workflow <span className="board-team-count">{teamMembers.length} members</span></div>
                <button type="button" className="btn-new-task-green" onClick={() => setShowCreateTaskModal(true)}><span className="plus-sign">+</span><span>New task</span></button>
              </div>
              <div className="kanban-board">
                {(["To do", "In progress", "Review", "Completed"] as const).map((column) => {
                  const columnCards = boardCards.filter((card) => card.column === column);
                  return (
                    <section className={`kanban-column kanban-${column.toLowerCase().replace(" ", "-")}`} key={column}>
                      <header className="kanban-column-header">
                        <div><span className="column-status-dot" /><h2>{column}</h2></div>
                        <span className="kanban-count">{columnCards.length}</span>
                      </header>
                      <div className="kanban-cards">
                        {columnCards.length ? columnCards.map((card) => (
                          <article className="kanban-card" key={card.id}>
                            <div className="kanban-card-topline"><span className={`priority-dot priority-${card.priority.toLowerCase()}`} /> <span>{card.priority} priority</span><button type="button" aria-label={`Open ${card.title}`} onClick={() => { const match = tasks.find((task) => task.title.toLowerCase().includes(card.title.toLowerCase().split(" ")[0])); if (match) { setSelectedTaskId(match.id); navigateTo("Create Task"); } else setNotice(`${card.title} selected.`); }}>•••</button></div>
                            <button type="button" className="kanban-card-title" onClick={() => { const match = tasks.find((task) => task.title.toLowerCase().includes(card.title.toLowerCase().split(" ")[0])); if (match) { setSelectedTaskId(match.id); navigateTo("Create Task"); } else setNotice(`${card.title} selected.`); }}>{card.title}</button>
                            <span className="kanban-project-label">{card.project}</span>
                            <div className="kanban-card-footer"><div className="kanban-assignee"><span className="assignee-avatar-badge">{card.assigneeInitials}</span><span>{card.assignee}</span></div><span className={`kanban-due ${card.due === "Today" ? "due-today-accent" : ""}`}>{card.due}</span></div>
                            <div className="kanban-move-row"><label htmlFor={`move-${card.id}`}>Move to</label><select id={`move-${card.id}`} value={card.column} onChange={(event) => setBoardCards((previous) => previous.map((item) => item.id === card.id ? { ...item, column: event.target.value as BoardCard["column"] } : item))}><option>To do</option><option>In progress</option><option>Review</option><option>Completed</option></select></div>
                          </article>
                        )) : <div className="kanban-empty">No tasks in this stage.</div>}
                      </div>
                    </section>
                  );
                })}
              </div>
              <footer className="screen-indicator-footer"><span>TEAM WORKSPACE WEB APP · TEAM WORKFLOW</span><span>SCREEN 06 / 11</span></footer>
            </section>
          ) : activePage === "Team Chat" || activePage === "Direct Messages" ? (
            <section className="messaging-page">
              <div className="messaging-layout">
                <aside className="chat-sidebar-card">
                  <div className="chat-sidebar-heading"><div><span className="panel-eyebrow">CONVERSATIONS</span><h2>{activePage === "Team Chat" ? "Channels" : "Messages"}</h2></div><button type="button" className="chat-add-button" onClick={() => setNotice(activePage === "Team Chat" ? "Channel creation is available in this demo workspace." : "Choose a teammate from the list to start a direct message.")}>+</button></div>
                  {activePage === "Team Chat" ? (
                    <div className="chat-list">{initialChannels.map((channel) => (
                      <button type="button" key={channel.id} className={`chat-list-item ${activeChannelId === channel.id ? "active" : ""}`} onClick={() => setActiveChannelId(channel.id)}>
                        <span className="chat-list-avatar channel-avatar">#</span><span className="chat-list-copy"><strong>{channel.name}</strong><small>{channel.description}</small></span>{channel.unreadCount > 0 && <span className="chat-unread-count">{channel.unreadCount}</span>}
                      </button>
                    ))}</div>
                  ) : (
                    <div className="chat-list">{initialDirectContacts.map((contact) => {
                      const latestMessage = (directMessages[contact.id] || [])[((directMessages[contact.id] || []).length || 1) - 1];
                      return <button type="button" key={contact.id} className={`chat-list-item ${activeDmContactId === contact.id ? "active" : ""}`} onClick={() => setActiveDmContactId(contact.id)}><span className="chat-list-avatar">{contact.initials}<i className={`presence-dot ${contact.status.toLowerCase()}`} /></span><span className="chat-list-copy"><strong>{contact.name}</strong><small>{latestMessage?.text || contact.role}</small></span></button>;
                    })}</div>
                  )}
                  <div className="chat-sidebar-footer"><span className="presence-dot online" /> Team Alpha · 6 members active</div>
                </aside>
                <section className="conversation-card">
                  <header className="conversation-header">
                    <div className="conversation-title-avatar">{activePage === "Team Chat" ? "#" : activeDmContact.initials}</div>
                    <div className="conversation-heading"><h2>{activePage === "Team Chat" ? activeChannel.name : activeDmContact.name}</h2><span>{activePage === "Team Chat" ? `Group chat · ${activeChannel.description}` : `${activeDmContact.role} · ${activeDmContact.status}`}</span></div>
                    <button type="button" className="conversation-more-button" onClick={() => setNotice("Conversation details are up to date.")} aria-label="Conversation options">•••</button>
                  </header>
                  <div className="conversation-messages">
                    {(activePage === "Team Chat" ? (chatMessages[activeChannelId] || []) : (directMessages[activeDmContactId] || [])).map((message) => (
                      <article key={message.id} className={`message-row ${message.isSelf ? "message-self" : ""}`}>
                        {!message.isSelf && <span className="message-avatar">{message.senderInitials}</span>}
                        <div className="message-content"><div className="message-meta"><strong>{message.sender}</strong><time>{message.time}</time></div><p>{message.text}</p></div>
                        {message.isSelf && <span className="message-avatar self-avatar">{message.senderInitials}</span>}
                      </article>
                    ))}
                  </div>
                  <form className="message-compose" onSubmit={activePage === "Team Chat" ? sendChatMessage : sendDirectMessage}>
                    <textarea aria-label="Write a message" placeholder="Write a message… Use @ to mention someone" rows={2} value={activePage === "Team Chat" ? chatInputText : dmInputText} onChange={(event) => activePage === "Team Chat" ? setChatInputText(event.target.value) : setDmInputText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if (activePage === "Team Chat") sendChatMessage(event); else sendDirectMessage(event); } }} />
                    <div className="compose-actions"><button type="button" className="compose-utility" onClick={() => setNotice("Attachments can be added when file sharing is enabled.")}>＋ Attach</button><span className="compose-hint">Enter to send · Shift + Enter for new line</span><button type="submit" className="send-message-button">Send <span>→</span></button></div>
                  </form>
                </section>
              </div>
              <footer className="screen-indicator-footer"><span>TEAM WORKSPACE WEB APP · MESSAGES</span><span>{activePage === "Team Chat" ? "SCREEN 08 / 11" : "SCREEN 09 / 11"}</span></footer>
            </section>
          ) : activePage === "Time Logs" ? (
            <section className="time-logs-page">
              <div className="time-log-filter-row">
                <label>Team member<select value={timeLogUserFilter} onChange={(event) => setTimeLogUserFilter(event.target.value)}><option value="all">All team members</option>{teamMembers.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></label>
                <label>Period<select defaultValue="7"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
                <label>Event type<select value={timeLogEventFilter} onChange={(event) => setTimeLogEventFilter(event.target.value)}><option value="all">All task events</option><option value="Started">Started</option><option value="Stopped">Stopped</option><option value="Updated">Updated</option><option value="Completed">Completed</option><option value="Comment">Comment</option></select></label>
                <div className="time-log-summary"><span className="time-log-summary-value">18h 35m</span><span>This week</span></div>
              </div>
              <div className="table-scroll-card"><table className="workspace-data-table time-log-table"><thead><tr><th>TIME</th><th>USER</th><th>ACTIVITY</th><th>TASK</th><th>DURATION</th><th>EVENT</th></tr></thead><tbody>{timeLogs.filter((entry) => (timeLogUserFilter === "all" || entry.user === timeLogUserFilter) && (timeLogEventFilter === "all" || entry.event === timeLogEventFilter)).map((entry) => <tr key={entry.id}><td className="time-cell">{entry.time}</td><td><span className="table-user"><span className="assignee-avatar-badge">{entry.userInitials}</span>{entry.user}</span></td><td>{entry.activity}</td><td><strong className="table-task-name">{entry.task}</strong></td><td className="duration-cell">{entry.duration}</td><td><span className={`event-pill event-${entry.event.toLowerCase()}`}>{entry.event}</span></td></tr>)}</tbody></table></div>
              <footer className="screen-indicator-footer"><span>TEAM WORKSPACE WEB APP · AUDIT TRAIL</span><span>SCREEN 10 / 11</span></footer>
            </section>
          ) : activePage === "Team Members" ? (
            <section className="team-members-page">
              <div className="team-summary-card"><div className="team-summary-icon">TA</div><div className="team-summary-copy"><span className="panel-eyebrow">TEAM ALPHA</span><h2>Team lead: Priya S. <span>·</span> {teamMembers.length} members <span>·</span> 2 active projects</h2><p>Permissions are role-based. Team leads manage team membership; members can assign tasks only where permitted.</p></div><button type="button" className="btn-new-task-green" onClick={() => setShowAddMemberModal(true)}><span className="plus-sign">+</span><span>Add member</span></button></div>
              <div className="team-permission-note"><span className="permission-lock">✓</span><span>Role-based access is active. Only team leads and workspace admins can manage membership and change roles.</span></div>
              <div className="table-scroll-card"><table className="workspace-data-table member-table"><thead><tr><th>MEMBER</th><th>EMAIL</th><th>ROLE</th><th>ACTIVE TASKS</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{teamMembers.map((member) => { const memberInitials = member.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); return <tr key={member.id}><td><span className="table-user member-name-cell"><span className="assignee-avatar-badge">{memberInitials}</span><strong>{member.name}</strong></span></td><td className="member-email">{member.email}</td><td><span className={`role-pill ${member.role === "Team Lead" || member.role === "Admin" ? "role-lead" : ""}`}>{member.role}</span></td><td className="active-task-number">{member.activeTasks}</td><td><span className={`member-status ${member.status.toLowerCase()}`}><i />{member.status}</span></td><td><button type="button" className="table-action-link" onClick={() => setNotice(`${member.name} · ${member.role} · ${member.activeTasks} active tasks`)}>View</button></td></tr>; })}</tbody></table></div>
              <footer className="screen-indicator-footer"><span>TEAM WORKSPACE WEB APP · MEMBERS & PERMISSIONS</span><span>SCREEN 11 / 11</span></footer>
              {showAddMemberModal && <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowAddMemberModal(false); }}><form className="member-modal" onSubmit={addTeamMember}><button type="button" className="modal-close" onClick={() => setShowAddMemberModal(false)} aria-label="Close">×</button><span className="panel-eyebrow">TEAM ALPHA</span><h2>Add a team member</h2><p>Invite a teammate and choose their workspace role.</p><label>Full name<input autoFocus value={newMemberName} onChange={(event) => setNewMemberName(event.target.value)} placeholder="e.g. Asha Kumar" required /></label><label>Email address<input type="email" value={newMemberEmail} onChange={(event) => setNewMemberEmail(event.target.value)} placeholder="name@company.in" required /></label><label>Role<select value={newMemberRole} onChange={(event) => setNewMemberRole(event.target.value as typeof newMemberRole)}><option>Member</option><option>Team Lead</option><option>Admin</option></select></label><button type="submit" className="btn-new-task-green modal-submit">Add member</button></form></div>}
            </section>
          ) : activePage === "Notifications" ? (
            <section className="notifications-page">
              <div className="notifications-toolbar"><div><span className="notification-unread-count">{notifications.filter((item) => item.unread).length} unread</span><span className="notification-toolbar-note">Stay up to date with your team's work.</span></div><div className="notification-actions"><div className="notification-filter-tabs"><button className={notificationFilter === "all" ? "active" : ""} type="button" onClick={() => setNotificationFilter("all")}>All</button><button className={notificationFilter === "unread" ? "active" : ""} type="button" onClick={() => setNotificationFilter("unread")}>Unread</button></div><button type="button" className="mark-read-button" onClick={markAllNotificationsRead}>Mark all read</button></div></div>
              <div className="notification-list-card">{visibleNotifications.length ? visibleNotifications.map((item) => <article key={item.id} className={`notification-item ${item.unread ? "unread" : ""}`}><div className={`notification-icon notification-${item.type}`}>{item.type === "task" ? "✓" : item.type === "chat" ? "#" : item.type === "mention" ? "@" : "◷"}</div><div className="notification-copy"><div className="notification-title-row"><h3>{item.title}</h3>{item.unread && <span className="unread-dot" />}</div><p>{item.detail}</p><time>{item.time}</time></div><button type="button" className="notification-dismiss" aria-label="Mark notification read" onClick={() => setNotifications((previous) => previous.map((notification) => notification.id === item.id ? { ...notification, unread: false } : notification))}>{item.unread ? "Mark read" : "✓"}</button></article>) : <div className="notification-empty">You're all caught up.</div>}</div>
              <footer className="screen-indicator-footer"><span>TEAM WORKSPACE WEB APP · NOTIFICATIONS</span><span>WORKSPACE ACTIVITY</span></footer>
            </section>
          ) : activePage === "Profile" ? (
            <section className="settings-page profile-page">
              <div className="profile-hero-card"><div className="profile-large-avatar">{initials || "AD"}</div><div className="profile-hero-copy"><span className="panel-eyebrow">WORKSPACE MEMBER</span><h2>{userName}</h2><p>{userEmail}</p></div><span className="profile-active-badge"><i /> Active</span></div>
              <form className="settings-card profile-settings-card" onSubmit={(event) => { event.preventDefault(); setNotice("Profile changes saved."); }}><div className="settings-card-heading"><div><h3>Personal information</h3><p>Keep your account details current for your team.</p></div></div><div className="settings-form-grid"><label>Full name<input defaultValue={userName} /></label><label>Email address<input type="email" defaultValue={userEmail} /></label><label>Department<input value={profileDepartment} onChange={(event) => setProfileDepartment(event.target.value)} /></label><label>Time zone<select value={profileTimezone} onChange={(event) => setProfileTimezone(event.target.value)}><option>IST (UTC+05:30)</option><option>UTC</option><option>EST (UTC-05:00)</option><option>PST (UTC-08:00)</option></select></label></div><button type="submit" className="btn-new-task-green settings-save-button">Save profile</button></form>
              <div className="settings-card account-security-card"><div className="settings-card-heading"><div><h3>Account security</h3><p>Security options for your Work Flow account.</p></div></div><div className="setting-toggle-row"><div><strong>Two-step verification</strong><small>Add a second verification step when signing in.</small></div><button type="button" className={`toggle-switch ${twoFactorEnabled ? "enabled" : ""}`} role="switch" aria-checked={twoFactorEnabled} onClick={() => setTwoFactorEnabled((value) => !value)}><span /></button></div></div>
              <footer className="screen-indicator-footer"><span>TEAM WORKSPACE WEB APP · PROFILE</span><span>ACCOUNT</span></footer>
            </section>
          ) : activePage === "Settings" ? (
            <section className="settings-page">
              <form className="settings-card" onSubmit={(event) => { event.preventDefault(); setNotice("Workspace settings saved."); }}><div className="settings-card-heading"><div><span className="panel-eyebrow">WORKSPACE</span><h3>General settings</h3><p>Manage shared workspace preferences and defaults.</p></div></div><label className="settings-wide-field">Workspace name<input value={workspaceNameSetting} onChange={(event) => setWorkspaceNameSetting(event.target.value)} /></label><label className="settings-wide-field">Default team<select defaultValue="Team Alpha"><option>Team Alpha</option><option>Team Beta</option><option>Team Delta</option></select></label><button type="submit" className="btn-new-task-green settings-save-button">Save settings</button></form>
              <div className="settings-card"><div className="settings-card-heading"><div><h3>Notifications</h3><p>Choose how Work Flow keeps you informed.</p></div></div><div className="setting-toggle-row"><div><strong>Email alerts</strong><small>Receive important task and mention updates.</small></div><button type="button" className={`toggle-switch ${emailAlertsEnabled ? "enabled" : ""}`} role="switch" aria-checked={emailAlertsEnabled} onClick={() => setEmailAlertsEnabled((value) => !value)}><span /></button></div><div className="setting-toggle-row"><div><strong>Daily digest</strong><small>Get a summary of team activity each day.</small></div><button type="button" className="toggle-switch" role="switch" aria-checked="false" onClick={(event) => { const button = event.currentTarget; const enabled = button.getAttribute("aria-checked") !== "true"; button.setAttribute("aria-checked", String(enabled)); button.classList.toggle("enabled", enabled); setNotice(enabled ? "Daily digest enabled." : "Daily digest disabled."); }}><span /></button></div></div>
              <div className="settings-card"><div className="settings-card-heading"><div><h3>Workspace access</h3><p>Role permissions currently apply to the Team Alpha workspace.</p></div></div><div className="settings-access-row"><span className="permission-lock">✓</span><span>Only team leads and admins can add or change member roles.</span><button type="button" className="table-action-link" onClick={() => navigateTo("Team Members")}>Manage members</button></div></div>
              <footer className="screen-indicator-footer"><span>TEAM WORKSPACE WEB APP · PREFERENCES</span><span>WORKSPACE SETTINGS</span></footer>
            </section>
          ) : activePage === "Create Task" ? (
            <section className="task-detail-page">
              <div className="task-detail-layout">
                {/* Left Card: Task Core Information */}
                <article className="task-detail-main-card">
                  <div className="task-meta-header">
                    <span className="task-code-project">
                      {selectedTask.id} · {selectedTask.project}
                    </span>
                  </div>

                  <h2 className="task-detail-title">{selectedTask.title}</h2>

                  <div className="task-badges-row">
                    <span
                      className={`status-pill ${selectedTask.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {selectedTask.status.toUpperCase()}
                    </span>
                    <span className="task-meta-divider"></span>
                    <span className="task-meta-text">
                      Priority: <strong>{selectedTask.priority}</strong>
                    </span>
                    <span className="task-meta-dot">•</span>
                    <span className="task-meta-text">
                      Due: <strong>{selectedTask.due}</strong>
                    </span>
                  </div>

                  <div className="task-status-flow" aria-label="Task status flow">
                    {(["To do", "In progress", "Review", "Completed"] as const).map((status) => <button type="button" key={status} className={`task-flow-step ${selectedTask.status === status ? "current" : ""} ${["To do", "In progress", "Review", "Completed"].indexOf(status) < ["To do", "In progress", "Review", "Completed"].indexOf(selectedTask.status) ? "passed" : ""}`} onClick={() => { setTasks((previous) => previous.map((task) => task.id === selectedTask.id ? { ...task, status } : task)); setBoardCards((previous) => previous.map((card) => card.title === selectedTask.title ? { ...card, column: status } : card)); }}>{status}</button>)}
                  </div>
                  {taskTimerActive && <div className="active-task-banner"><span className="board-live-dot" /><div><strong>Timer running</strong><small>Time is tracked until you explicitly stop and save it.</small></div><span className="active-task-elapsed">{formatTime(selectedTask.timeSpentSeconds || 0)}</span><button type="button" onClick={() => setTaskActionModal("stop-timer")}>Stop timer & save</button></div>}
                  <div className="task-section-block">
                    <h4 className="task-block-heading">DESCRIPTION</h4>
                    <p className="task-description-body">
                      {selectedTask.description ||
                        "No detailed description provided for this task yet."}
                    </p>
                  </div>

                  <div className="task-section-block">
                    <h4 className="task-block-heading">ACCEPTANCE CHECKLIST</h4>
                    <div className="checklist-container">
                      {selectedTask.acceptanceChecklist &&
                      selectedTask.acceptanceChecklist.length > 0 ? (
                        selectedTask.acceptanceChecklist.map((item) => (
                          <label key={item.id} className="checklist-item">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleChecklistItem(item.id)}
                            />
                            <span className="checklist-custom-box">
                              {item.completed && "✓"}
                            </span>
                            <span
                              className={`checklist-label-text ${
                                item.completed ? "completed" : ""
                              }`}
                            >
                              {item.text}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="empty-checklist">No checklist items defined.</p>
                      )}
                    </div>
                  </div>
                </article>

                {/* Right Card: Task Controls & Timer */}
                <aside className="task-controls-card">
                  <h3 className="task-controls-heading">TASK CONTROLS</h3>

                  <div className="time-tracking-section">
                    <span className="time-tracking-label">Time tracking</span>
                    <div className="task-timer-display">
                      {formatTime(selectedTask.timeSpentSeconds || 0)}
                    </div>

                    <button
                      type="button"
                      className={`btn-task-control primary ${
                        taskTimerActive ? "active" : ""
                      }`}
                      onClick={toggleTaskTimer}
                    >
                      {taskTimerActive ? "Pause task" : "Start task"}
                    </button>

                    <button
                      type="button"
                      className="btn-task-control secondary"
                      onClick={() => setTaskActionModal("complete")}
                    >
                      {selectedTask.status === "Completed"
                        ? "Mark incomplete"
                        : "Mark completed"}
                    </button>

                    <button
                      type="button"
                      className="btn-task-control secondary"
                      onClick={() => setTaskActionModal("reassign")}
                    >
                      Reassign task
                    </button>
                  </div>

                  <div className="timer-rule-card"><strong>Timer rule</strong><p>The timer keeps running until you explicitly stop it. Leaving this page or signing out does not silently stop the timer.</p></div>
                  <div className="task-assigned-info">
                    <span className="assigned-label">Assigned to</span>
                    <strong className="assigned-name">
                      {selectedTask.assignedBy || "Workspace Lead"}
                    </strong>
                    <small className="assigned-footnote">
                      Time tracking remains active until you stop and save it.
                    </small>
                  </div>
                </aside>
              </div>

              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · TASK WORKFLOW · Live Task Record</span><span>SCREEN 03 / 11</span>
              </footer>

            </section>
          ) : (
            <section className="coming-soon-page"><h2>{activePage}</h2><p>Page is not available.</p></section>
          )}
        </div>
      </section>

      {showCreateTaskModal && <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setShowCreateTaskModal(false); }}><form className="member-modal create-task-modal" onSubmit={createTaskFromForm}><button type="button" className="modal-close" onClick={() => setShowCreateTaskModal(false)} aria-label="Close">×</button><span className="panel-eyebrow">TASK DETAILS</span><h2>Create and assign task</h2><p>Team leads and permitted members can create tasks and assign ownership.</p><label>Task title<input autoFocus value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Prepare invoice export API" required /></label><div className="settings-form-grid"><label>Project<select value={newTaskProject} onChange={(event) => setNewTaskProject(event.target.value)}><option>Billing Portal</option><option>Invoice module</option><option>Northstar portal</option><option>Marketing site</option><option>Platform Upgrade</option></select></label><label>Assign to<select value={newTaskAssignee} onChange={(event) => setNewTaskAssignee(event.target.value)}>{teamMembers.map((member) => <option key={member.id}>{member.name}</option>)}</select></label><label>Priority<select value={newTaskPriority} onChange={(event) => setNewTaskPriority(event.target.value as typeof newTaskPriority)}><option>High</option><option>Medium</option><option>Low</option></select></label><label>Due date<input type="date" value={newTaskDue} onChange={(event) => setNewTaskDue(event.target.value)} /></label></div><label>Description<textarea rows={3} value={newTaskDescription} onChange={(event) => setNewTaskDescription(event.target.value)} placeholder="Describe the task and expected outcome" /></label><label>Acceptance criteria<textarea rows={3} value={newTaskChecklist} onChange={(event) => setNewTaskChecklist(event.target.value)} placeholder="One checklist item per line" /></label><button type="submit" className="btn-new-task-green modal-submit">Save & assign</button></form></div>}

      {taskActionModal && <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) { setTaskActionModal(null); setTaskActionNote(""); } }}><form className="member-modal task-action-modal" onSubmit={(event) => { event.preventDefault(); if (taskActionModal === "complete") { setTasks((previous) => previous.map((task) => task.id === selectedTaskId ? { ...task, status: "Completed" } : task)); setBoardCards((previous) => previous.map((card) => card.title === selectedTask?.title ? { ...card, column: "Completed" } : card)); setNotice(`Task completed${taskActionNote.trim() ? `: ${taskActionNote.trim()}` : "."}`); } else if (taskActionModal === "reassign") { const member = teamMembers.find((item) => item.id === taskReassignTo); if (member && selectedTask) { setTasks((previous) => previous.map((task) => task.id === selectedTaskId ? { ...task, assignedBy: member.name, assignedByInitials: member.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() } : task)); setNotice(`Task reassigned to ${member.name}.`); } } else { setTaskTimerActive(false); setTasks((previous) => previous.map((task) => task.id === selectedTaskId ? { ...task, timeSpentSeconds: (task.timeSpentSeconds || 0) + 60 } : task)); setTimeLogs((previous) => [{ id: `tl-${Date.now()}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), user: userName, userInitials: initials || "AD", activity: "Stopped timer", task: selectedTask?.title || "Task", duration: formatTime((selectedTask?.timeSpentSeconds || 0) + 60), event: "Stopped" }, ...previous]); setNotice(`Time entry saved${taskActionNote.trim() ? ` with note: ${taskActionNote.trim()}` : "."}`); } setTaskActionModal(null); setTaskActionNote(""); }}><button type="button" className="modal-close" onClick={() => { setTaskActionModal(null); setTaskActionNote(""); }} aria-label="Close">×</button><span className="panel-eyebrow">{taskActionModal === "complete" ? "COMPLETE TASK" : taskActionModal === "reassign" ? "REASSIGN TASK" : "SAVE TIME ENTRY"}</span><h2>{taskActionModal === "complete" ? "Complete this task?" : taskActionModal === "reassign" ? "Choose a new owner" : "Stop timer & save"}</h2><p>{taskActionModal === "complete" ? "Add an optional completion note to the task audit trail." : taskActionModal === "reassign" ? "Select an eligible teammate to own this task." : "Save the tracked time and optionally add a note."}</p>{taskActionModal === "reassign" ? <label>New owner<select value={taskReassignTo} onChange={(event) => setTaskReassignTo(event.target.value)} required><option value="">Select teammate</option>{teamMembers.map((member) => <option value={member.id} key={member.id}>{member.name} · {member.role}</option>)}</select></label> : <label>{taskActionModal === "complete" ? "Completion note (optional)" : "Time entry note (optional)"}<textarea rows={4} value={taskActionNote} onChange={(event) => setTaskActionNote(event.target.value)} placeholder={taskActionModal === "complete" ? "Tests passed; PR linked" : "What did you work on?"} /></label>}<button type="submit" className="btn-new-task-green modal-submit">{taskActionModal === "complete" ? "Mark completed" : taskActionModal === "reassign" ? "Reassign task" : "Stop timer & save"}</button></form></div>}

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