import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./style.css";

type ProjectItem = {
  id: string;
  name: string;
  team: string;
  progress: number;
  membersExtra: number;
  memberAvatars: string[];
  dueDate: string;
  status: "In Progress" | "Pending" | "Completed" | "Not Started";
};

type PageName =
  | "Dashboard"
  | "My Projects"
  | "Tasks"
  | "My Tasks"
  | "Teams"
  | "Team Board"
  | "Create Task"
  | "Time Logs"
  | "Team Chat"
  | "Direct Messages"
  | "Team Members"
  | "Reports & Reviews"
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
  created?: string;
  description?: string;
  acceptanceChecklist?: { id: string; text: string; completed: boolean }[];
  timeSpentSeconds?: number;
  completionNotes?: string;
  changesDescription?: string;
};

const managerMenuItems: { label: PageName; icon: string }[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "My Projects", icon: "🗂" },
  { label: "Tasks", icon: "✓" },
  { label: "Teams", icon: "👥" },
  { label: "Team Board", icon: "▤" },
  { label: "Time Logs", icon: "◷" },
  { label: "Team Chat", icon: "▱" },
  { label: "Direct Messages", icon: "✉" },
  { label: "Team Members", icon: "♧" },
  { label: "Reports & Reviews", icon: "📊" },
  { label: "Notifications", icon: "♢" },
  { label: "Settings", icon: "⚙" },
];

const employeeMenuItems: { label: PageName; icon: string }[] = [
  { label: "Dashboard", icon: "▦" },
  { label: "My Tasks", icon: "✓" },
  { label: "Team Chat", icon: "▱" },
  { label: "Direct Messages", icon: "✉" },
  { label: "Team Members", icon: "♧" },
  { label: "Notifications", icon: "♢" },
  { label: "Profile", icon: "◎" },
];

const menuItems = managerMenuItems;

const initialTasks: Task[] = [
  {
    id: "TASK-1043",
    title: "Configure multi-currency billing",
    project: "Billing Portal",
    projectCode: "B",
    projectBadgeColor: "#d8f3ec",
    assignedBy: "Maya Chen",
    assignedByInitials: "MC",
    created: "24 Oct 2026",
    due: "Today",
    priority: "High",
    status: "In progress",
    description:
      "Configure multi-currency billing and tax breakdown for overseas corporate clients.",
    acceptanceChecklist: [
      {
        id: "chk-1",
        text: "Responsive audit on mobile and tablet",
        completed: true,
      },
      {
        id: "chk-2",
        text: "Email validation on multi-invite input",
        completed: false,
      },
    ],
    timeSpentSeconds: 42 * 60 + 18,
    completionNotes: "",
    changesDescription: "",
  },
  {
    id: "TASK-1044",
    title: "Prepare sprint review notes",
    project: "Team Workspace",
    projectCode: "T",
    projectBadgeColor: "#dcf4e4",
    assignedBy: "Arun Patel",
    assignedByInitials: "AP",
    created: "26 Oct 2026",
    due: "Tomorrow",
    priority: "Medium",
    status: "To do",
    description:
      "Aggregate completed deliverables, milestone charts, and blocker retrospectives.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Export Jira burndown chart", completed: false },
      {
        id: "chk-2",
        text: "Share slide deck draft with leads",
        completed: false,
      },
    ],
    timeSpentSeconds: 0,
    completionNotes: "",
    changesDescription: "",
  },
  {
    id: "TASK-1045",
    title: "Review notification settings",
    project: "Work Flow App",
    projectCode: "W",
    projectBadgeColor: "#d7f3ea",
    assignedBy: "Priya Shah",
    assignedByInitials: "PS",
    created: "25 Oct 2026",
    due: "26 Oct",
    priority: "Low",
    status: "Review",
    description:
      "Validate granular notification preference toggles across email, web push, and in-app feeds.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Test mute notification window", completed: true },
      { id: "chk-2", text: "Verify database preference sync", completed: true },
    ],
    timeSpentSeconds: 15 * 60,
    completionNotes: "",
    changesDescription: "",
  },
  {
    id: "TASK-1046",
    title: "Update customer onboarding flow",
    project: "Client Portal",
    projectCode: "C",
    projectBadgeColor: "#d8f2ee",
    assignedBy: "Maya Chen",
    assignedByInitials: "MC",
    created: "27 Oct 2026",
    due: "Today",
    priority: "High",
    status: "In progress",
    description:
      "Redesign mobile responsive cards and simplify team invitation steps during onboarding.",
    acceptanceChecklist: [
      {
        id: "chk-1",
        text: "Responsive audit on mobile and tablet",
        completed: false,
      },
      {
        id: "chk-2",
        text: "Email validation on multi-invite input",
        completed: false,
      },
    ],
    timeSpentSeconds: 46 * 60 + 16,
    completionNotes: "",
    changesDescription: "",
  },
  {
    id: "TASK-1049",
    title: "Polish the workspace overview",
    project: "Work Flow App",
    projectCode: "W",
    projectBadgeColor: "#d7f3ea",
    assignedBy: "Arun Patel",
    assignedByInitials: "AP",
    created: "28 Oct 2026",
    due: "29 Oct",
    priority: "Medium",
    status: "In progress",
    description:
      "Refine dashboard layout, metric cards hierarchy, and theme consistency across all pages.",
    acceptanceChecklist: [
      {
        id: "chk-1",
        text: "Inspect all primary action buttons",
        completed: true,
      },
      {
        id: "chk-2",
        text: "Ensure full responsiveness on tablet view",
        completed: false,
      },
    ],
    timeSpentSeconds: 24 * 60,
    completionNotes: "",
    changesDescription: "",
  },
  {
    id: "TASK-1042",
    title: "Implement invoice export endpoint",
    project: "Client Portal",
    projectCode: "C",
    projectBadgeColor: "#d8f3ec",
    assignedBy: "Maya Chen",
    assignedByInitials: "MC",
    created: "23 Oct 2026",
    due: "30 Oct",
    priority: "High",
    status: "In progress",
    description:
      "Create a secure endpoint to export invoice line items to Excel. Include invoice metadata, tax breakdown, totals, and validation errors.",
    acceptanceChecklist: [
      {
        id: "chk-1",
        text: "Correct invoice and financial year",
        completed: false,
      },
      {
        id: "chk-2",
        text: "GST totals match invoice preview",
        completed: false,
      },
      {
        id: "chk-3",
        text: "Permission check and error handling",
        completed: false,
      },
      { id: "chk-4", text: "Automated tests added", completed: false },
    ],
    timeSpentSeconds: 18 * 60 + 42,
    completionNotes: "",
    changesDescription: "",
  },
];

const initialBoardCards: BoardCard[] = [
  {
    id: "tb-1",
    title: "Review GST rules",
    project: "Invoice module",
    assignee: "A. Kumar",
    assigneeInitials: "AK",
    due: "Today",
    priority: "High",
    column: "To do",
  },
  {
    id: "tb-2",
    title: "Client update note",
    project: "Northstar portal",
    assignee: "K. Meena",
    assigneeInitials: "KM",
    due: "14 Oct",
    priority: "Medium",
    column: "To do",
  },
  {
    id: "tb-3",
    title: "Invoice export API",
    project: "Billing Portal",
    assignee: "Dhi Kumar",
    assigneeInitials: "DK",
    due: "Today",
    priority: "High",
    column: "In progress",
  },
  {
    id: "tb-4",
    title: "Quote PDF layout",
    project: "Billing Portal",
    assignee: "S. Raj",
    assigneeInitials: "SR",
    due: "13 Oct",
    priority: "Medium",
    column: "In progress",
  },
  {
    id: "tb-5",
    title: "Tax calculation tests",
    project: "Billing Portal",
    assignee: "Priya Sharma",
    assigneeInitials: "PS",
    due: "Today",
    priority: "High",
    column: "Review",
  },
  {
    id: "tb-6",
    title: "Auth middleware",
    project: "Northstar portal",
    assignee: "Rahul Kumar",
    assigneeInitials: "RK",
    due: "Done",
    priority: "Low",
    column: "Completed",
  },
  {
    id: "tb-7",
    title: "Base UI shell",
    project: "Marketing site",
    assignee: "Dhi Kumar",
    assigneeInitials: "DK",
    due: "Done",
    priority: "Low",
    column: "Completed",
  },
];

const initialChannels = [
  {
    id: "ch-alpha",
    name: "Team Alpha",
    description: "Sprint updates",
    unreadCount: 3,
  },
  {
    id: "ch-beta",
    name: "Team Beta",
    description: "Design review",
    unreadCount: 0,
  },
  {
    id: "ch-delta",
    name: "Team Delta",
    description: "Daily stand-up",
    unreadCount: 1,
  },
  {
    id: "ch-billing",
    name: "Billing Portal",
    description: "Feature discussion",
    unreadCount: 0,
  },
];

const initialChatMessages: Record<string, ChatMessage[]> = {
  "ch-alpha": [
    {
      id: "m-1",
      sender: "Priya S.",
      senderInitials: "PS",
      text: "Please share the API test status.",
      time: "10:18 AM",
    },
    {
      id: "m-2",
      sender: "You",
      senderInitials: "AD",
      text: "Tests are passing locally; CI run is next.",
      time: "10:22 AM",
      isSelf: true,
    },
    {
      id: "m-3",
      sender: "Kiran M.",
      senderInitials: "KM",
      text: "I can review the PR after lunch.",
      time: "10:29 AM",
    },
  ],
  "ch-beta": [
    {
      id: "m-b1",
      sender: "Maya Chen",
      senderInitials: "MC",
      text: "Figma wireframes updated for mobile navigation.",
      time: "09:40 AM",
    },
  ],
  "ch-delta": [
    {
      id: "m-d1",
      sender: "Rahul K.",
      senderInitials: "RK",
      text: "Working on Northstar portal client notes today.",
      time: "09:15 AM",
    },
  ],
  "ch-billing": [
    {
      id: "m-bl1",
      sender: "Priya S.",
      senderInitials: "PS",
      text: "Reviewing tax invoice export endpoint requirements.",
      time: "08:50 AM",
    },
  ],
};

const initialDirectContacts = [
  {
    id: "dm-priya",
    name: "Priya Sharma",
    initials: "PS",
    role: "Team Lead",
    status: "Online",
  },
  {
    id: "dm-kiran",
    name: "Kiran Menon",
    initials: "KM",
    role: "QA Engineer",
    status: "Online",
  },
  {
    id: "dm-rahul",
    name: "Rahul Kumar",
    initials: "RK",
    role: "Frontend Dev",
    status: "Away",
  },
  {
    id: "dm-maya",
    name: "Maya Chen",
    initials: "MC",
    role: "Product Manager",
    status: "Online",
  },
  {
    id: "dm-arun",
    name: "Arun Patel",
    initials: "AP",
    role: "Backend Dev",
    status: "Offline",
  },
];

const initialDirectMessages: Record<string, ChatMessage[]> = {
  "dm-priya": [
    {
      id: "dm-1",
      sender: "Priya Sharma",
      senderInitials: "PS",
      text: "Please share the API test status.",
      time: "10:18 AM",
    },
    {
      id: "dm-2",
      sender: "You",
      senderInitials: "AD",
      text: "Tests are passing locally; CI run is next.",
      time: "10:22 AM",
      isSelf: true,
    },
    {
      id: "dm-3",
      sender: "Priya Sharma",
      senderInitials: "PS",
      text: "Great! Please link the PR when ready so we can merge before sprint demo.",
      time: "10:25 AM",
    },
  ],
  "dm-kiran": [
    {
      id: "dm-k1",
      sender: "Kiran Menon",
      senderInitials: "KM",
      text: "Attached the automated invoice test coverage report.",
      time: "09:50 AM",
    },
  ],
  "dm-rahul": [
    {
      id: "dm-r1",
      sender: "Rahul Kumar",
      senderInitials: "RK",
      text: "Completed the client history timeline component.",
      time: "Yesterday",
    },
  ],
  "dm-maya": [
    {
      id: "dm-m1",
      sender: "Maya Chen",
      senderInitials: "MC",
      text: "Checking sprint goals for this Thursday release.",
      time: "Yesterday",
    },
  ],
  "dm-arun": [
    {
      id: "dm-a1",
      sender: "Arun Patel",
      senderInitials: "AP",
      text: "Database migration completed for invoice totals.",
      time: "23 Oct",
    },
  ],
};

const initialTimeLogs: TimeLogEntry[] = [
  {
    id: "tl-1",
    time: "10:42",
    user: "Dhi Kumar",
    userInitials: "DK",
    activity: "Started task timer",
    task: "Invoice export",
    duration: "01:24:36",
    event: "Started",
  },
  {
    id: "tl-2",
    time: "10:17",
    user: "Priya Sharma",
    userInitials: "PS",
    activity: "Reassigned task",
    task: "GST review",
    duration: "—",
    event: "Updated",
  },
  {
    id: "tl-3",
    time: "09:52",
    user: "Kiran Menon",
    userInitials: "KM",
    activity: "Marked complete",
    task: "API tests",
    duration: "00:42:10",
    event: "Completed",
  },
  {
    id: "tl-4",
    time: "Yesterday",
    user: "Rahul Kumar",
    userInitials: "RK",
    activity: "Added comment",
    task: "Client update",
    duration: "—",
    event: "Comment",
  },
  {
    id: "tl-5",
    time: "Yesterday",
    user: "Dhi Kumar",
    userInitials: "DK",
    activity: "Stopped timer",
    task: "Invoice export",
    duration: "00:36:12",
    event: "Stopped",
  },
  {
    id: "tl-6",
    time: "24 Oct",
    user: "Maya Chen",
    userInitials: "MC",
    activity: "Created task",
    task: "Workspace overview",
    duration: "—",
    event: "Started",
  },
  {
    id: "tl-7",
    time: "23 Oct",
    user: "Arun Patel",
    userInitials: "AP",
    activity: "Logged time",
    task: "Sprint notes",
    duration: "02:15:00",
    event: "Stopped",
  },
];

const initialTeamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Priya Sharma",
    email: "priya@company.in",
    role: "Team Lead",
    activeTasks: 4,
    status: "Active",
  },
  {
    id: "tm-2",
    name: "Dhi Kumar",
    email: "dhi@company.in",
    role: "Member",
    activeTasks: 3,
    status: "Active",
  },
  {
    id: "tm-3",
    name: "Kiran Menon",
    email: "kiran@company.in",
    role: "Member",
    activeTasks: 2,
    status: "Active",
  },
  {
    id: "tm-4",
    name: "Rahul Kumar",
    email: "rahul@company.in",
    role: "Member",
    activeTasks: 5,
    status: "Active",
  },
  {
    id: "tm-5",
    name: "Meena Raj",
    email: "meena@company.in",
    role: "Member",
    activeTasks: 1,
    status: "Active",
  },
  {
    id: "tm-6",
    name: "Arun Patel",
    email: "arun@company.in",
    role: "Member",
    activeTasks: 3,
    status: "Active",
  },
];

const initialNotifications: AppNotification[] = [
  {
    id: "n-1",
    title: "Task assigned to you",
    detail:
      "Priya Sharma assigned you TASK-1042: Implement invoice export endpoint",
    time: "2 min ago",
    unread: true,
    type: "task",
  },
  {
    id: "n-2",
    title: "API Tests completed",
    detail: "Kiran Menon marked API test cases as Completed in Billing Portal",
    time: "18 min ago",
    unread: true,
    type: "task",
  },
  {
    id: "n-3",
    title: "Team Alpha update",
    detail: "New message in Team Alpha sprint channel: Sprint review notes",
    time: "42 min ago",
    unread: true,
    type: "chat",
  },
  {
    id: "n-4",
    title: "Mention in Northstar Portal",
    detail: "Rahul Kumar mentioned you in client progress notes",
    time: "1 hr ago",
    unread: false,
    type: "mention",
  },
  {
    id: "n-5",
    title: "Timesheet summary ready",
    detail: "Weekly time audit recorded 18h 35m across 12 tasks",
    time: "Yesterday",
    unread: false,
    type: "system",
  },
];

const activities = [
  { title: "Maya created a new task", time: "4 min ago", icon: "＋" },
  { title: "Arun shared sprint notes", time: "16 min ago", icon: "↗" },
  { title: "Design team updated a board", time: "38 min ago", icon: "▤" },
  { title: "New message from Priya", time: "1 hr ago", icon: "✉" },
];

type PortalRole = "manager" | "employee";

type AuthStep =
  | "welcome"
  | "portal-select"
  | "signin"
  | "signup-profile"
  | "verify-phone"
  | "signup-credentials"
  | "forgot";

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
  const [portalRole, setPortalRole] = useState<PortalRole>("manager");
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
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.tagName === "BUTTON" ||
          target.tagName === "INPUT" ||
          target.tagName === "A")
      ) {
        setCursorHovered(true);
      } else {
        setCursorHovered(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskFilterAssignee, setTaskFilterAssignee] = useState<
    "all" | "assigned-to-me"
  >("all");
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>("all");
  const [taskFilterPriority, setTaskFilterPriority] = useState<string>("all");
  const [taskSearchQuery, setTaskSearchQuery] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("TASK-1042");
  const [showTaskDetails, setShowTaskDetails] = useState<boolean>(false);
  const [completionNotesVisible, setCompletionNotesVisible] =
    useState<boolean>(false);
  const [completionNotesText, setCompletionNotesText] = useState<string>("");
  const [changesDescriptionText, setChangesDescriptionText] =
    useState<string>("");
  const [activeTaskTab, setActiveTaskTab] = useState<
    "Details" | "Comments" | "Attachments" | "Activity"
  >("Details");

  const [createTaskMode, setCreateTaskMode] = useState<"create" | "reassign">(
    "create",
  );
  const [taskTimerActive, setTaskTimerActive] = useState<boolean>(false);

  // Team Board state
  const [boardCards, setBoardCards] = useState<BoardCard[]>(initialBoardCards);

  // Team Chat state
  const [activeChannelId, setActiveChannelId] = useState<string>("ch-alpha");
  const [chatMessages, setChatMessages] =
    useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [chatInputText, setChatInputText] = useState<string>("");

  // Direct Messages state
  const [activeDmContactId, setActiveDmContactId] =
    useState<string>("dm-priya");
  const [directMessages, setDirectMessages] = useState<
    Record<string, ChatMessage[]>
  >(initialDirectMessages);
  const [dmInputText, setDmInputText] = useState<string>("");

  // Time Logs state
  const [timeLogs, setTimeLogs] = useState<TimeLogEntry[]>(initialTimeLogs);
  const [timeLogUserFilter, setTimeLogUserFilter] = useState<string>("all");
  const [timeLogEventFilter, setTimeLogEventFilter] = useState<string>("all");

  // Team Members state
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showCreateProjectModal, setShowCreateProjectModal] =
    useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectTeam, setNewProjectTeam] = useState<string>("Alpha Team");
  const [newProjectDesc, setNewProjectDesc] = useState<string>("");
  const [showAddTeamModal, setShowAddTeamModal] = useState<boolean>(false);
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [newTeamProject, setNewTeamProject] = useState<string>("Client Portal");
  const [newTeamLead, setNewTeamLead] = useState<string>("");
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      id: "proj-1",
      name: "Billing Platform",
      team: "Billing Team",
      progress: 72,
      membersExtra: 5,
      memberAvatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "28 May 2026",
      status: "In Progress",
    },
    {
      id: "proj-2",
      name: "Mobile App",
      team: "Mobile Team",
      progress: 60,
      membersExtra: 5,
      memberAvatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "20 May 2026",
      status: "In Progress",
    },
    {
      id: "proj-3",
      name: "HR Management",
      team: "HR Team",
      progress: 45,
      membersExtra: 6,
      memberAvatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "10 Jun 2026",
      status: "Pending",
    },
    {
      id: "proj-4",
      name: "Analytics Dashboard",
      team: "Design Team",
      progress: 30,
      membersExtra: 5,
      memberAvatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "15 Jun 2026",
      status: "In Progress",
    },
    {
      id: "proj-5",
      name: "Marketing Website",
      team: "Portal Team",
      progress: 80,
      membersExtra: 6,
      memberAvatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "05 May 2026",
      status: "Completed",
    },
    {
      id: "proj-6",
      name: "Internal Tools",
      team: "Dev Team",
      progress: 20,
      membersExtra: 4,
      memberAvatars: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "18 Jun 2026",
      status: "In Progress",
    },
    {
      id: "proj-7",
      name: "Employee Portal",
      team: "HR Team",
      progress: 0,
      membersExtra: 5,
      memberAvatars: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "25 Jun 2026",
      status: "Not Started",
    },
    {
      id: "proj-8",
      name: "Client Portal",
      team: "Portal Team",
      progress: 15,
      membersExtra: 4,
      memberAvatars: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      ],
      dueDate: "30 Jun 2026",
      status: "Not Started",
    },
  ]);
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>("");
  const [customTeams, setCustomTeams] = useState<
    Array<{
      id: string;
      name: string;
      membersCount: number;
      project: string;
      lead: string;
    }>
  >([]);
  const [showCreateTaskModal, setShowCreateTaskModal] =
    useState<boolean>(false);
  const [taskActionModal, setTaskActionModal] = useState<
    "complete" | "reassign" | "stop-timer" | null
  >(null);
  const [taskActionNote, setTaskActionNote] = useState<string>("");
  const [taskReassignTo, setTaskReassignTo] = useState<string>("");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskProject, setNewTaskProject] =
    useState<string>("Billing Portal");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>("Dhi Kumar");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "High" | "Medium" | "Low"
  >("Medium");
  const [newTaskDue, setNewTaskDue] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [newTaskChecklist, setNewTaskChecklist] = useState<string>("");
  const [newTaskParent, setNewTaskParent] = useState<string>("");
  const [newTaskTeam, setNewTaskTeam] = useState<string>("Team Alpha");
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<
    "Team Lead" | "Member" | "Admin"
  >("Member");

  // Notifications state
  const [notifications, setNotifications] =
    useState<AppNotification[]>(initialNotifications);
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "unread"
  >("all");

  // User Profile & Settings state
  const [profileDepartment, setProfileDepartment] = useState<string>(
    "Product & Engineering",
  );
  const [profileTimezone, setProfileTimezone] =
    useState<string>("IST (UTC+05:30)");
  const [workspaceNameSetting, setWorkspaceNameSetting] = useState<string>(
    "Work Flow Workspace",
  );
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
  const userName =
    account?.name ||
    username ||
    (portalRole === "manager" ? "abc" : "Priya Sharma");
  const userEmail =
    account?.email ||
    (portalRole === "manager"
      ? "alex.morgan@workflow.internal"
      : "priya.sharma@workflow.internal");
  const userRoleDisplay =
    portalRole === "manager" ? "Manager / Team Lead" : "Employee";
  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || (portalRole === "manager" ? "AM" : "PS");

  const currentMenuItems =
    portalRole === "manager" ? managerMenuItems : employeeMenuItems;

  useEffect(() => {
    if (!taskTimerActive || !selectedTaskId) return;
    const interval = window.setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === selectedTaskId
            ? { ...t, timeSpentSeconds: (t.timeSpentSeconds || 0) + 1 }
            : t,
        ),
      );
    }, 1000);
    return () => window.clearInterval(interval);
  }, [taskTimerActive, selectedTaskId]);

  useEffect(() => {
    if (!timerRunning || !isLoggedIn) return;
    const timer = window.setInterval(
      () => setElapsed((seconds) => seconds + 1),
      1000,
    );
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
    const validNewAccount =
      existingAccount &&
      (existingAccount.email.toLowerCase() === identifier ||
        (existingAccount.username || "").toLowerCase() === identifier) &&
      existingAccount.password === password;
    if (
      validDemo ||
      validNewAccount ||
      (identifier.length > 0 && password.length >= 3)
    ) {
      setLoginId("");
      setPassword("");
      enterDashboard();
    } else {
      setNotice(
        "Please enter your username and password (or use demo: abc@gmail.com / 123456).",
      );
    }
  };

  const handleCreateProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthStep("verify-phone");
    setNotice("For this frontend demo, enter any 4-digit code to continue.");
  };

  const handleVerifyPhone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp.trim().length < 4) {
      setNotice("Enter a 4-digit verification code.");
      return;
    }
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
    const matches =
      existingAccount &&
      (existingAccount.email.toLowerCase() === id ||
        (existingAccount.username || "").toLowerCase() === id);
    if (matches)
      setNotice(
        "Account found. Password reset is a frontend-only demo; return to sign in to continue.",
      );
    else setNotice("No account found for that username or email.");
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
    if (activePage === "My Tasks" && showTaskDetails) {
      setShowTaskDetails(false);
      return;
    }
    if (pageHistory.length > 0) {
      const previous = pageHistory[pageHistory.length - 1];
      setPageHistory((history) => history.slice(0, -1));
      setActivePage(previous);
      setProfileOpen(false);
    } else if (activePage !== "Dashboard") setActivePage("Dashboard");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthStep("portal-select");
    setEmail("");
    setPassword("");
    setLoginId("");
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

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const toggleChecklistItem = (checkId: string) => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              acceptanceChecklist: (t.acceptanceChecklist || []).map((c) =>
                c.id === checkId ? { ...c, completed: !c.completed } : c,
              ),
            }
          : t,
      ),
    );
  };

  const toggleTaskTimer = () => {
    setTaskTimerActive((prev) => !prev);
    setNotice(taskTimerActive ? "Task timer paused." : "Task timer started.");
  };

  const navigateToTaskDetails = (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId) || tasks[0];
    setSelectedTaskId(taskId);
    setShowTaskDetails(true);
    setActiveTaskTab("Details");
    setCompletionNotesVisible(Boolean(targetTask?.completionNotes));
    setCompletionNotesText(targetTask?.completionNotes || "");
    setChangesDescriptionText(targetTask?.changesDescription || "");
    navigateTo("My Tasks");
  };

  const handleMarkCompleteClick = () => {
    if (!selectedTask) return;
    if (selectedTask.status === "Completed") {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === selectedTask.id
            ? { ...task, status: "In progress" }
            : task,
        ),
      );
      setBoardCards((previous) =>
        previous.map((card) =>
          card.title === selectedTask.title
            ? { ...card, column: "In progress" }
            : card,
        ),
      );
      setCompletionNotesVisible(false);
      setNotice(`Task ${selectedTask.id} moved back to In progress.`);
    } else {
      setCompletionNotesVisible(true);
    }
  };

  const saveTaskCompletion = () => {
    if (!selectedTask) return;
    const notes = completionNotesText.trim();
    setTasks((previous) =>
      previous.map((task) =>
        task.id === selectedTask.id
          ? { ...task, status: "Completed", completionNotes: notes }
          : task,
      ),
    );
    setBoardCards((previous) =>
      previous.map((card) =>
        card.title === selectedTask.title
          ? { ...card, column: "Completed" }
          : card,
      ),
    );
    setNotice(`Task ${selectedTask.id} marked complete.`);
  };

  const saveChangesDescription = () => {
    if (!selectedTask) return;
    const changes = changesDescriptionText.trim();
    setTasks((previous) =>
      previous.map((task) =>
        task.id === selectedTask.id
          ? { ...task, changesDescription: changes }
          : task,
      ),
    );
    setNotice("Changes description saved.");
  };

  const openTaskEditor = (mode: "create" | "reassign", task?: Task) => {
    setCreateTaskMode(mode);
    setShowTaskDetails(false);
    setNewTaskTitle(task?.title ?? "");
    setNewTaskProject(task?.project ?? "Billing Portal");
    setNewTaskAssignee(task?.assignedBy ?? teamMembers[0]?.name ?? "");
    setNewTaskPriority(task?.priority ?? "Medium");
    setNewTaskDue(task?.due ?? "");
    setNewTaskDescription(task?.description ?? "");
    setNewTaskChecklist(
      task?.acceptanceChecklist?.map((item) => item.text).join("\n") ?? "",
    );
    setNewTaskParent("");
    setNewTaskTeam("Team Alpha");
    navigateTo("Create Task");
  };

  const markTaskCompleted = () => {
    if (!selectedTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              status: t.status === "Completed" ? "In progress" : "Completed",
            }
          : t,
      ),
    );
    setNotice(
      selectedTask.status === "Completed"
        ? `Task ${selectedTask.id} moved back to In progress.`
        : `Task ${selectedTask.id} marked as completed!`,
    );
  };

  const reassignTask = () => {
    if (!selectedTask) return;
    setNotice(`Reassign workflow opened for ${selectedTask.id}`);
  };

  const activeChannel =
    initialChannels.find((channel) => channel.id === activeChannelId) ||
    initialChannels[0];
  const activeDmContact =
    initialDirectContacts.find((contact) => contact.id === activeDmContactId) ||
    initialDirectContacts[0];
  const visibleNotifications = notifications.filter(
    (item) => notificationFilter === "all" || item.unread,
  );

  const sendChatMessage = (event: FormEvent) => {
    event.preventDefault();
    const text = chatInputText.trim();
    if (!text) return;
    const message: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "You",
      senderInitials: initials || "AD",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSelf: true,
    };
    setChatMessages((previous) => ({
      ...previous,
      [activeChannelId]: [...(previous[activeChannelId] || []), message],
    }));
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
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSelf: true,
    };
    setDirectMessages((previous) => ({
      ...previous,
      [activeDmContactId]: [...(previous[activeDmContactId] || []), message],
    }));
    setDmInputText("");
  };

  const createTaskFromForm = (event: FormEvent) => {
    event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    const assignee = newTaskAssignee;
    const assigneeInitials = assignee
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const checklist = newTaskChecklist
      .split("\n")
      .map((text, index) => ({
        id: `task-${Date.now()}-${index}`,
        text: text.trim(),
        completed: false,
      }))
      .filter((item) => item.text);

    if (createTaskMode === "reassign") {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === selectedTaskId
            ? {
                ...task,
                title,
                project: newTaskProject,
                due: newTaskDue || task.due,
                priority: newTaskPriority,
                assignedBy: assignee,
                assignedByInitials: assigneeInitials,
                description: newTaskDescription.trim(),
                acceptanceChecklist: checklist,
              }
            : task,
        ),
      );
      setNotice(`Task reassigned to ${assignee}.`);
      setShowTaskDetails(true);
      navigateTo("My Tasks");
      return;
    }

    const taskId = `TASK-${1050 + tasks.length}`;
    const newTask: Task = {
      id: taskId,
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
      acceptanceChecklist: checklist,
      timeSpentSeconds: 0,
    };

    setTasks((previous) => [newTask, ...previous]);
    setBoardCards((previous) => [
      {
        id: `tb-${Date.now()}`,
        title,
        project: newTaskProject,
        assignee,
        assigneeInitials,
        due: newTask.due,
        priority: newTaskPriority,
        column: "To do",
      },
      ...previous,
    ]);
    setSelectedTaskId(taskId);
    setShowTaskDetails(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskChecklist("");
    setNewTaskDue("");
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
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, unread: false })),
    );
    setNotice("All notifications marked as read.");
  };

  if (!isLoggedIn) {
    const authTitle: Record<AuthStep, string> = {
      welcome: "Your team workspace starts here.",
      "portal-select": "Select your workspace portal",
      signin: "Sign in to your account",
      "signup-profile": "Create your account",
      "verify-phone": "Verify your phone",
      "signup-credentials": "Choose your sign-in details",
      forgot: "Reset your password",
    };
    const authSubtitle: Record<AuthStep, string> = {
      welcome:
        "Organize work, bring your team together, and keep everything moving.",
      "portal-select":
        "Choose your role portal before entering your sign-in credentials.",
      signin:
        portalRole === "manager"
          ? "Enter your credentials to access the Manager / Team Lead portal."
          : "Enter your credentials to access the Employee portal.",
      "signup-profile": "Tell us a little about yourself to get started.",
      "verify-phone": `We'll verify ${phone || "your phone number"} before you continue.`,
      "signup-credentials":
        "Choose a username and password for your new account.",
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
            opacity: cursorPos.x >= 0 ? 1 : 0,
          }}
        />

        <section className="brand-panel">
          <div className="brand">
            <span className="brand-logo" aria-label="Team">
              <TeamIcon />
            </span>
            <div>
              <strong>WORK FLOW</strong>
              <small>INVOICE + TEAM</small>
            </div>
          </div>
          <div
            className="brand-message"
            key={authStep === "welcome" ? "brand-welcome" : "brand-auth"}
          >
            <span className="brand-eyebrow">TEAM PORTAL</span>
            <h1>
              Welcome to
              <br />
              Work Flow.
            </h1>
            <p>Your work, your team, and your business — all in one place.</p>
            {authStep === "welcome" && (
              <button
                className="welcome-signin-button"
                type="button"
                onClick={() => {
                  setAuthStep("portal-select");
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
                <span className="eyebrow">
                  {authStep === "portal-select"
                    ? "CHOOSE YOUR PORTAL"
                    : authStep.startsWith("signup") ||
                        authStep === "verify-phone"
                      ? "GET STARTED"
                      : authStep === "forgot"
                        ? "ACCOUNT RECOVERY"
                        : "WELCOME BACK"}
                </span>
                <h2>{authTitle[authStep]}</h2>
                <p className="subtitle">{authSubtitle[authStep]}</p>

                {authStep === "portal-select" && (
                  <div className="portal-selection-container">
                    <div className="portal-cards-list">
                      <button
                        type="button"
                        className={`portal-role-card ${portalRole === "manager" ? "active" : ""}`}
                        onClick={() => {
                          setPortalRole("manager");
                          setAuthStep("signin");
                          setNotice("");
                        }}
                      >
                        <div className="portal-card-top">
                          <div className="portal-icon-wrapper manager">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="2"
                                y="7"
                                width="20"
                                height="14"
                                rx="2"
                                ry="2"
                              />
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                          </div>
                          <span className="portal-tag manager">
                            MANAGEMENT PORTAL
                          </span>
                        </div>
                        <div className="portal-card-info">
                          <h3>Manager / Team Lead</h3>
                          <p>
                            Access full workspace, team board, approvals, task
                            creation, time logs & members.
                          </p>
                        </div>
                        <div className="portal-card-action">
                          <span>Continue to Sign in</span>
                          <span className="action-arrow">→</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`portal-role-card ${portalRole === "employee" ? "active" : ""}`}
                        onClick={() => {
                          setPortalRole("employee");
                          setAuthStep("signin");
                          setNotice("");
                        }}
                      >
                        <div className="portal-card-top">
                          <div className="portal-icon-wrapper employee">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <span className="portal-tag employee">
                            EMPLOYEE PORTAL
                          </span>
                        </div>
                        <div className="portal-card-info">
                          <h3>Employee</h3>
                          <p>
                            Access personal daily dashboard, assigned tasks,
                            checklist, team chat & direct messaging.
                          </p>
                        </div>
                        <div className="portal-card-action">
                          <span>Continue to Sign in</span>
                          <span className="action-arrow">→</span>
                        </div>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-back-to-welcome"
                      onClick={() => {
                        setAuthStep("welcome");
                        setNotice("");
                      }}
                    >
                      ← Back to welcome screen
                    </button>
                  </div>
                )}

                {authStep === "signin" && (
                  <form onSubmit={handleSignIn}>
                    <div className="selected-portal-chip">
                      <div className="selected-portal-meta">
                        <span className="portal-chip-icon">
                          {portalRole === "manager" ? "👔" : "👤"}
                        </span>
                        <span className="portal-chip-text">
                          Portal:{" "}
                          <strong>
                            {portalRole === "manager"
                              ? "Manager / Team Lead"
                              : "Employee"}
                          </strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-switch-portal"
                        onClick={() => {
                          setAuthStep("portal-select");
                          setNotice("");
                        }}
                      >
                        Change
                      </button>
                    </div>

                    <label htmlFor="loginId">Username or email</label>
                    <input
                      id="loginId"
                      type="text"
                      placeholder="Enter your username or email"
                      autoComplete="username"
                      value={loginId}
                      onChange={(event) => setLoginId(event.target.value)}
                      required
                    />
                    <div className="form-label-row">
                      <label htmlFor="loginPassword">Password</label>
                      <button
                        type="button"
                        className="inline-link"
                        onClick={() => {
                          setAuthStep("forgot");
                          setNotice("");
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="password-field">
                      <input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="show-password"
                        onClick={() => setShowPassword((visible) => !visible)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button className="submit-button" type="submit">
                      <span>Sign in</span>
                      <span className="button-arrow">→</span>
                    </button>
                  </form>
                )}

                {authStep === "signup-profile" && (
                  <form onSubmit={handleCreateProfile}>
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
                    <label htmlFor="signupEmail">Email address</label>
                    <input
                      id="signupEmail"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
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
                    <button className="submit-button" type="submit">
                      <span>Continue to phone verification</span>
                      <span className="button-arrow">→</span>
                    </button>
                  </form>
                )}

                {authStep === "verify-phone" && (
                  <form onSubmit={handleVerifyPhone}>
                    <div className="verification-note">
                      <span className="verification-icon">✓</span>
                      <div>
                        <strong>Phone verification</strong>
                        <small>Frontend demo only: no SMS is sent.</small>
                      </div>
                    </div>
                    <label htmlFor="otp">4-digit verification code</label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter any 4-digit code"
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, ""))
                      }
                      required
                    />
                    <button className="submit-button" type="submit">
                      <span>Verify and continue</span>
                      <span className="button-arrow">→</span>
                    </button>
                  </form>
                )}

                {authStep === "signup-credentials" && (
                  <form onSubmit={handleCreateAccount}>
                    <label htmlFor="username">Username</label>
                    <input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      required
                    />
                    <label htmlFor="newPassword">Password</label>
                    <div className="password-field">
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        className="show-password"
                        onClick={() => setShowPassword((visible) => !visible)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button className="submit-button" type="submit">
                      <span>Create account</span>
                      <span className="button-arrow">→</span>
                    </button>
                  </form>
                )}

                {authStep === "forgot" && (
                  <form onSubmit={handleForgotPassword}>
                    <label htmlFor="recoveryId">Username or email</label>
                    <input
                      id="recoveryId"
                      type="text"
                      placeholder="Enter your username or email"
                      value={loginId}
                      onChange={(event) => setLoginId(event.target.value)}
                      required
                    />
                    <button className="submit-button" type="submit">
                      <span>Find account</span>
                      <span className="button-arrow">→</span>
                    </button>
                  </form>
                )}

                {notice && (
                  <p className="auth-notice" role="status">
                    {notice}
                  </p>
                )}
                <p className="switch-form">
                  {authStep === "portal-select" ? (
                    <>
                      Ready to sign in?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep("signin");
                          setNotice("");
                        }}
                      >
                        Continue with{" "}
                        {portalRole === "manager" ? "Manager" : "Employee"} →
                      </button>
                    </>
                  ) : authStep === "signin" ? (
                    <>
                      New to Work Flow?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep("signup-profile");
                          setNotice("");
                        }}
                      >
                        Create new account →
                      </button>
                    </>
                  ) : authStep === "forgot" ? (
                    <>
                      Remembered your password?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep("signin");
                          setNotice("");
                        }}
                      >
                        Back to sign in →
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep("signin");
                          setNotice("");
                          setPassword("");
                        }}
                      >
                        Sign in →
                      </button>
                    </>
                  )}
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
          <span className="brand-logo" aria-label="Team">
            <TeamIcon />
          </span>
          <div>
            <strong>WORK FLOW</strong>
            <small>INVOICE + TEAM</small>
          </div>
        </div>

        <p className="sidebar-caption">
          {portalRole === "manager"
            ? "MANAGER WORKSPACE"
            : "EMPLOYEE WORKSPACE"}
        </p>

        <div className={`sidebar-portal-tag-pill ${portalRole}`}>
          <span className="portal-dot"></span>
          <span>
            {portalRole === "manager" ? "Manager / Lead" : "Employee Portal"}
          </span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {currentMenuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${
                activePage === item.label ? "selected" : ""
              }`}
              onClick={() => {
                if (item.label === "Create Task") {
                  setCreateTaskMode("create");
                  setShowTaskDetails(false);
                  setNewTaskTitle("");
                  setNewTaskProject("Billing Portal");
                  setNewTaskAssignee(teamMembers[0]?.name ?? "");
                  setNewTaskPriority("Medium");
                  setNewTaskDue("");
                  setNewTaskDescription("");
                  setNewTaskChecklist("");
                  navigateTo("Create Task");
                  return;
                }
                if (item.label === "My Tasks") setShowTaskDetails(false);
                navigateTo(item.label);
              }}
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
            <small>{userRoleDisplay}</small>
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
                  ? portalRole === "manager"
                    ? "1. Manager Dashboard"
                    : "My workspace dashboard"
                  : activePage === "My Projects"
                    ? "2. My Projects"
                    : activePage === "Tasks" || activePage === "My Tasks"
                      ? "Tasks"
                    : activePage === "Team Board"
                      ? "Team board"
                      : activePage === "Create Task"
                        ? createTaskMode === "reassign"
                          ? "Reassign task"
                          : "Create task"
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
                  ? portalRole === "manager"
                    ? "Overview of your team's progress, tasks and activity."
                    : "Personal work queue, active timer, team updates, and upcoming deadlines."
                  : activePage === "My Tasks"
                    ? "Search and filter assigned, created, and delegated tasks."
                    : activePage === "Team Board"
                      ? "See team work by status, owner, priority, and due date."
                      : activePage === "Create Task"
                        ? selectedTask?.title ||
                          "Implement invoice export endpoint"
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
                    ? portalRole === "manager"
                      ? "Search anything in workspace..."
                      : "Search anything in dashboard..."
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
                  <small>{userRoleDisplay}</small>
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
                      <span className="dropdown-portal-tag">
                        {portalRole === "manager"
                          ? "Manager / Team Lead Portal"
                          : "Employee Portal"}
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />
                  <button type="button" onClick={() => navigateTo("Profile")}>
                    <span>◎</span> My profile
                  </button>
                  <button type="button" onClick={() => navigateTo("Settings")}>
                    <span>⚙</span> Settings
                  </button>
                  <button
                    type="button"
                    className="logout-option"
                    onClick={logout}
                  >
                    <span>↪</span> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content" key={activePage}>
          {activePage === "Dashboard" ? (
            portalRole === "employee" ? (
              <>
                <div className="section-heading dashboard-meta-heading">
                  <div className="dashboard-meta-pill employee">
                    <span className="meta-dot"></span>
                    <span>Employee Portal · Personal Work Queue</span>
                  </div>
                  <span className="today-label">DAILY WORK OVERVIEW</span>
                </div>

                <section className="stats-grid">
                  <article className="stat-card">
                    <div className="stat-top">
                      <span>MY ASSIGNED TASKS</span>
                      <span className="stat-icon teal">✓</span>
                    </div>
                    <strong>4</strong>
                    <small className="stat-foot teal-text">2 due today</small>
                  </article>

                  <article className="stat-card">
                    <div className="stat-top">
                      <span>LOGGED TODAY</span>
                      <span className="stat-icon aqua">◷</span>
                    </div>
                    <strong>5h 15m</strong>
                    <small className="stat-foot aqua-text">
                      Across 3 tasks
                    </small>
                  </article>

                  <article className="stat-card">
                    <div className="stat-top">
                      <span>COMPLETED THIS SPRINT</span>
                      <span className="stat-icon green">★</span>
                    </div>
                    <strong>14</strong>
                    <small className="stat-foot green-text">
                      100% on schedule
                    </small>
                  </article>

                  <article className="stat-card">
                    <div className="stat-top">
                      <span>TEAM MESSAGES</span>
                      <span className="stat-icon purple">✉</span>
                    </div>
                    <strong>3</strong>
                    <small className="stat-foot purple-text">
                      1 unread from Lead
                    </small>
                  </article>
                </section>

                <section className="dashboard-middle">
                  <div className="left-stack">
                    <article className="panel current-task-panel">
                      <div className="panel-heading">
                        <div>
                          <span className="panel-eyebrow">
                            ACTIVE ASSIGNED TASK
                          </span>
                          <h3>Implement invoice export endpoint</h3>
                          <p>
                            Project: Billing Portal <span>·</span> Assigned by:
                            Alex Morgan (Lead) <span>·</span> Due today
                          </p>
                        </div>
                        <span className="status-pill in-progress">
                          IN PROGRESS
                        </span>
                      </div>

                      <div className="task-progress">
                        <div className="progress-label">
                          <span>Task progress</span>
                          <strong>70%</strong>
                        </div>
                        <div className="progress-track">
                          <span style={{ width: "70%" }} />
                        </div>
                      </div>

                      <div className="task-timer-row">
                        <div className="timer-badge">
                          <span className="timer-icon">◷</span>
                          <span>{formatTime(elapsed)}</span>
                        </div>
                        <div className="timer-controls">
                          <button
                            type="button"
                            className="btn-timer-action"
                            onClick={() => setTimerRunning((r) => !r)}
                          >
                            {timerRunning ? "Pause timer" : "Resume timer"}
                          </button>
                          <button
                            type="button"
                            className="btn-timer-save"
                            onClick={markTimerSaved}
                          >
                            Save entry
                          </button>
                        </div>
                      </div>

                      <div className="panel-divider" />

                      <div className="task-subtasks">
                        <span className="subtasks-label">
                          ACCEPTANCE CHECKLIST (3 of 4 completed)
                        </span>
                        <div className="checklist-items">
                          <label className="checklist-item done">
                            <input type="checkbox" defaultChecked />
                            <span>Define PDF and CSV template schemas</span>
                          </label>
                          <label className="checklist-item done">
                            <input type="checkbox" defaultChecked />
                            <span>Connect billing ledger database query</span>
                          </label>
                          <label className="checklist-item done">
                            <input type="checkbox" defaultChecked />
                            <span>Generate downloadable export stream</span>
                          </label>
                          <label className="checklist-item">
                            <input type="checkbox" />
                            <span>
                              Unit test rate limits and signature headers
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="current-task-actions">
                        <button
                          type="button"
                          className="btn-open-task-details"
                          onClick={() => {
                            const targetTask =
                              tasks.find((t) => t.id === "TASK-1046") ||
                              tasks[0];
                            navigateToTaskDetails(
                              targetTask?.id || "TASK-1046",
                            );
                          }}
                        >
                          <span>Open full task details & checklist</span>
                          <span>→</span>
                        </button>
                      </div>
                    </article>

                    <article className="panel">
                      <div className="panel-heading">
                        <div>
                          <span className="panel-eyebrow">MY WORK QUEUE</span>
                          <h3>Assigned tasks queue</h3>
                          <p>
                            Click any task to view full details and acceptance
                            checklist.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="panel-action-btn"
                          onClick={() => {
                            setShowTaskDetails(false);
                            navigateTo("My Tasks");
                          }}
                        >
                          View all tasks →
                        </button>
                      </div>

                      <div className="employee-task-list">
                        {tasks.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            className="employee-task-row"
                            onClick={() => navigateToTaskDetails(task.id)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="employee-task-main">
                              <div className="task-id-badge">{task.id}</div>
                              <div>
                                <strong>{task.title}</strong>
                                <div className="task-meta-line">
                                  <span className="project-code">
                                    {task.project}
                                  </span>
                                  <span>·</span>
                                  <span>Due {task.due}</span>
                                  <span>·</span>
                                  <span
                                    className={`priority-tag ${task.priority.toLowerCase()}`}
                                  >
                                    {task.priority} Priority
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="employee-task-right">
                              <span
                                className={`status-pill ${task.status.toLowerCase().replace(" ", "-")}`}
                              >
                                {task.status}
                              </span>
                              <span className="row-arrow">→</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>

                  <div className="right-stack">
                    <article className="panel">
                      <div className="panel-heading">
                        <div>
                          <span className="panel-eyebrow">
                            TEAM ANNOUNCEMENTS
                          </span>
                          <h3>Sprint updates & notices</h3>
                        </div>
                      </div>
                      <div className="updates-list">
                        <div className="update-item">
                          <span className="update-icon teal">📢</span>
                          <div>
                            <strong>Sprint 14 code freeze at 5:00 PM</strong>
                            <p>
                              Ensure all assigned PRs are linked to task
                              acceptance checklists.
                            </p>
                            <small>Alex Morgan (Lead) · 25 min ago</small>
                          </div>
                        </div>
                        <div className="update-item">
                          <span className="update-icon green">✓</span>
                          <div>
                            <strong>Client portal redesign approved</strong>
                            <p>
                              QA signed off on responsive navigation and dark
                              theme tokens.
                            </p>
                            <small>Design Team · 1 hr ago</small>
                          </div>
                        </div>
                        <div className="update-item">
                          <span className="update-icon purple">✉</span>
                          <div>
                            <strong>New mention in #development</strong>
                            <p>
                              David tagged you on the webhook retry logic
                              review.
                            </p>
                            <small>Team Chat · 2 hrs ago</small>
                          </div>
                        </div>
                      </div>
                    </article>

                    <article className="panel">
                      <div className="panel-heading">
                        <div>
                          <span className="panel-eyebrow">
                            QUICK COLLABORATION
                          </span>
                          <h3>Active teammates</h3>
                        </div>
                        <button
                          type="button"
                          className="panel-action-btn"
                          onClick={() => navigateTo("Team Chat")}
                        >
                          Open chat →
                        </button>
                      </div>
                      <div className="teammates-quick-list">
                        {teamMembers.slice(0, 4).map((member) => (
                          <div
                            key={member.id}
                            className="teammate-quick-item"
                            onClick={() => navigateTo("Direct Messages")}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="teammate-avatar">
                              {member.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")}
                              <span
                                className={`online-dot ${member.status.toLowerCase()}`}
                              />
                            </div>
                            <div className="teammate-info">
                              <strong>{member.name}</strong>
                              <small>
                                {member.role} · {member.status}
                              </small>
                            </div>
                            <span className="quick-chat-action">Chat</span>
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </section>

                <footer className="workspace-footer">
                  <span>
                    WORK FLOW EMPLOYEE PORTAL · Personal work queue & active
                    sprint
                  </span>
                  <span>EMPLOYEE DASHBOARD</span>
                </footer>
              </>
            ) : (
              <div className="manager-dashboard-page-v2">
                {/* Row 1: Four Metric Cards */}
                <section className="mgr-metric-cards-row" aria-label="Key performance metrics">
                  <article
                    className="mgr-metric-card"
                    onClick={() => navigateTo("My Projects")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="mgr-metric-icon mint-folder">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008f70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div className="mgr-metric-data">
                      <span className="mgr-metric-label">ACTIVE PROJECTS</span>
                      <strong className="mgr-metric-number">8</strong>
                      <span className="mgr-metric-subtext text-green">3 due this week</span>
                    </div>
                  </article>

                  <article
                    className="mgr-metric-card"
                    onClick={() => navigateTo("Team Members")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="mgr-metric-icon mint-users">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008f70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="mgr-metric-data">
                      <span className="mgr-metric-label">TEAM MEMBERS</span>
                      <strong className="mgr-metric-number">20</strong>
                      <span className="mgr-metric-subtext text-teal">2 on leave</span>
                    </div>
                  </article>

                  <article
                    className="mgr-metric-card"
                    onClick={() => navigateTo("Team Board")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="mgr-metric-icon mint-progress">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008f70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="mgr-metric-data">
                      <span className="mgr-metric-label">TASKS IN PROGRESS</span>
                      <strong className="mgr-metric-number">16</strong>
                      <span className="mgr-metric-subtext text-teal">Across all projects</span>
                    </div>
                  </article>

                  <article
                    className="mgr-metric-card"
                    onClick={() => navigateTo("Team Board")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="mgr-metric-icon mint-reviews">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#008f70" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="mgr-metric-data">
                      <span className="mgr-metric-label">PENDING REVIEWS</span>
                      <strong className="mgr-metric-number">5</strong>
                      <span className="mgr-metric-subtext text-red">2 overdue</span>
                    </div>
                  </article>
                </section>

                {/* Row 2: Three Middle Cards */}
                <section className="manager-middle-three-grid">
                  {/* Card 1: Project & Team Progress */}
                  <article className="mgr-panel-card">
                    <div className="mgr-panel-header">
                      <h3 className="mgr-panel-title">Project & Team Progress</h3>
                      <button
                        type="button"
                        className="mgr-link-btn"
                        onClick={() => navigateTo("My Projects")}
                      >
                        View all projects →
                      </button>
                    </div>
                    <div className="mgr-progress-list">
                      <div className="mgr-progress-item">
                        <div className="mgr-proj-icon green-mon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        </div>
                        <div className="mgr-proj-info">
                          <strong className="mgr-proj-name">Billing Platform</strong>
                          <span className="mgr-proj-team">Billing Team</span>
                        </div>
                        <div className="mgr-bar-wrapper">
                          <div className="mgr-progress-track">
                            <div className="mgr-progress-fill" style={{ width: "72%" }}></div>
                          </div>
                          <span className="mgr-progress-percent">72%</span>
                        </div>
                      </div>

                      <div className="mgr-progress-item">
                        <div className="mgr-proj-icon blue-mob">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                        </div>
                        <div className="mgr-proj-info">
                          <strong className="mgr-proj-name">Mobile App</strong>
                          <span className="mgr-proj-team">Mobile Team</span>
                        </div>
                        <div className="mgr-bar-wrapper">
                          <div className="mgr-progress-track">
                            <div className="mgr-progress-fill" style={{ width: "60%" }}></div>
                          </div>
                          <span className="mgr-progress-percent">60%</span>
                        </div>
                      </div>

                      <div className="mgr-progress-item">
                        <div className="mgr-proj-icon purple-hr">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                        </div>
                        <div className="mgr-proj-info">
                          <strong className="mgr-proj-name">HR Management</strong>
                          <span className="mgr-proj-team">HR Team</span>
                        </div>
                        <div className="mgr-bar-wrapper">
                          <div className="mgr-progress-track">
                            <div className="mgr-progress-fill" style={{ width: "45%" }}></div>
                          </div>
                          <span className="mgr-progress-percent">45%</span>
                        </div>
                      </div>

                      <div className="mgr-progress-item">
                        <div className="mgr-proj-icon cyan-an">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                        </div>
                        <div className="mgr-proj-info">
                          <strong className="mgr-proj-name">Analytics Dashboard</strong>
                          <span className="mgr-proj-team">Design Team</span>
                        </div>
                        <div className="mgr-bar-wrapper">
                          <div className="mgr-progress-track">
                            <div className="mgr-progress-fill" style={{ width: "30%" }}></div>
                          </div>
                          <span className="mgr-progress-percent">30%</span>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Card 2: Needs Your Attention */}
                  <article className="mgr-panel-card">
                    <div className="mgr-panel-header">
                      <h3 className="mgr-panel-title">Needs Your Attention</h3>
                      <button
                        type="button"
                        className="mgr-link-btn"
                        onClick={() => navigateTo("Team Board")}
                      >
                        View all →
                      </button>
                    </div>
                    <div className="mgr-attention-list">
                      <div className="mgr-attention-item" onClick={() => navigateTo("Team Board")}>
                        <div className="mgr-att-icon blue-doc">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <div className="mgr-att-content">
                          <strong className="mgr-att-title">Review Requests</strong>
                          <span className="mgr-att-sub">3 tasks waiting for review</span>
                        </div>
                        <span className="mgr-att-badge blue">5</span>
                      </div>

                      <div className="mgr-attention-item" onClick={() => navigateTo("Tasks")}>
                        <div className="mgr-att-icon orange-clock">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <div className="mgr-att-content">
                          <strong className="mgr-att-title">Overdue Tasks</strong>
                          <span className="mgr-att-sub">4 tasks are overdue</span>
                        </div>
                        <span className="mgr-att-badge orange">3</span>
                      </div>

                      <div className="mgr-attention-item" onClick={() => navigateTo("Team Board")}>
                        <div className="mgr-att-icon red-alert">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                        <div className="mgr-att-content">
                          <strong className="mgr-att-title">Blocked Tasks</strong>
                          <span className="mgr-att-sub">2 tasks are blocked</span>
                        </div>
                        <span className="mgr-att-badge red">2</span>
                      </div>

                      <div className="mgr-attention-item" onClick={() => navigateTo("Tasks")}>
                        <div className="mgr-att-icon green-today">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                        <div className="mgr-att-content">
                          <strong className="mgr-att-title">Tasks Due Today</strong>
                          <span className="mgr-att-sub">6 tasks due today</span>
                        </div>
                        <span className="mgr-att-badge green">4</span>
                      </div>
                    </div>
                  </article>

                  {/* Card 3: Team Activity */}
                  <article className="mgr-panel-card">
                    <div className="mgr-panel-header">
                      <h3 className="mgr-panel-title">Team Activity</h3>
                      <button
                        type="button"
                        className="mgr-link-btn"
                        onClick={() => navigateTo("Time Logs")}
                      >
                        View all activity →
                      </button>
                    </div>
                    <div className="mgr-activity-feed">
                      <div className="mgr-feed-item">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                          alt="Priya Sharma"
                          className="mgr-feed-avatar"
                        />
                        <div className="mgr-feed-info">
                          <p className="mgr-feed-text">
                            <strong>Priya Sharma</strong> completed task
                          </p>
                          <span className="mgr-feed-sub">Invoice UI design</span>
                        </div>
                        <span className="mgr-feed-time">10m ago</span>
                      </div>

                      <div className="mgr-feed-item">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                          alt="Arun Kumar"
                          className="mgr-feed-avatar"
                        />
                        <div className="mgr-feed-info">
                          <p className="mgr-feed-text">
                            <strong>Arun Kumar</strong> started task
                          </p>
                          <span className="mgr-feed-sub">Invoice API integration</span>
                        </div>
                        <span className="mgr-feed-time">25m ago</span>
                      </div>

                      <div className="mgr-feed-item">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          alt="Maya Reddy"
                          className="mgr-feed-avatar"
                        />
                        <div className="mgr-feed-info">
                          <p className="mgr-feed-text">
                            <strong>Maya Reddy</strong> submitted task for
                          </p>
                          <span className="mgr-feed-sub">Invoice export feature</span>
                        </div>
                        <span className="mgr-feed-time">45m ago</span>
                      </div>

                      <div className="mgr-feed-item">
                        <img
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                          alt="Dil Kumar"
                          className="mgr-feed-avatar"
                        />
                        <div className="mgr-feed-info">
                          <p className="mgr-feed-text">
                            <strong>Dil Kumar</strong> commented on a task
                          </p>
                        </div>
                        <span className="mgr-feed-time">1h ago</span>
                      </div>

                      <div className="mgr-feed-item">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                          alt="Ravi Singh"
                          className="mgr-feed-avatar"
                        />
                        <div className="mgr-feed-info">
                          <p className="mgr-feed-text">
                            <strong>Ravi Singh</strong> uploaded a file
                          </p>
                        </div>
                        <span className="mgr-feed-time">2h ago</span>
                      </div>
                    </div>
                  </article>
                </section>

                {/* Row 3: Two Analytical Charts */}
                <section className="manager-bottom-charts-grid">
                  {/* Chart 1: Team Workload */}
                  <article className="mgr-chart-card">
                    <div className="mgr-chart-header">
                      <h3 className="mgr-chart-title">Team Workload</h3>
                      <div className="mgr-chart-legend">
                        <span className="legend-chip">
                          <span className="legend-dot red">●</span> High
                        </span>
                        <span className="legend-chip">
                          <span className="legend-dot orange">●</span> Medium
                        </span>
                        <span className="legend-chip">
                          <span className="legend-dot green">●</span> Low
                        </span>
                      </div>
                    </div>

                    <div className="mgr-workload-chart-wrapper">
                      <svg
                        className="mgr-workload-svg"
                        viewBox="0 0 460 200"
                        preserveAspectRatio="none"
                        aria-label="Stacked workload bar chart"
                      >
                        {/* Grid lines and Y labels */}
                        <line x1="32" y1="20" x2="445" y2="20" stroke="#e6f2ef" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="10" y="24" fill="#8da3b0" fontSize="10" fontWeight="600">30</text>

                        <line x1="32" y1="70" x2="445" y2="70" stroke="#e6f2ef" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="10" y="74" fill="#8da3b0" fontSize="10" fontWeight="600">20</text>

                        <line x1="32" y1="120" x2="445" y2="120" stroke="#e6f2ef" strokeWidth="1" strokeDasharray="3 3" />
                        <text x="10" y="124" fill="#8da3b0" fontSize="10" fontWeight="600">10</text>

                        <line x1="32" y1="170" x2="445" y2="170" stroke="#cbdfe0" strokeWidth="1" />
                        <text x="16" y="173" fill="#8da3b0" fontSize="10" fontWeight="600">0</text>

                        {/* Bar 1: Billing Team (Total 7: Low 4, Med 2, High 1) */}
                        <g className="chart-bar-group" transform="translate(68, 0)">
                          {/* Low (green) height 24 */}
                          <rect x="0" y="146" width="38" height="24" rx="2" fill="#00a88b" />
                          {/* Med (orange) height 12 */}
                          <rect x="0" y="134" width="38" height="12" fill="#f59e0b" />
                          {/* High (red) height 6 */}
                          <rect x="0" y="128" width="38" height="6" rx="2" fill="#ef4444" />
                          <text x="19" y="122" textAnchor="middle" fill="#0b4a4e" fontSize="11" fontWeight="700">3</text>
                          <text x="19" y="190" textAnchor="middle" fill="#718d9e" fontSize="10" fontWeight="600">Billing Team</text>
                        </g>

                        {/* Bar 2: Mobile Team (Total 12: Low 3, Med 6, High 3) */}
                        <g className="chart-bar-group" transform="translate(168, 0)">
                          {/* Low (green) height 18 */}
                          <rect x="0" y="152" width="38" height="18" rx="2" fill="#00a88b" />
                          {/* Med (orange) height 36 */}
                          <rect x="0" y="116" width="38" height="36" fill="#f59e0b" />
                          {/* High (red) height 18 */}
                          <rect x="0" y="98" width="38" height="18" rx="2" fill="#ef4444" />
                          <text x="19" y="92" textAnchor="middle" fill="#0b4a4e" fontSize="11" fontWeight="700">12</text>
                          <text x="19" y="190" textAnchor="middle" fill="#718d9e" fontSize="10" fontWeight="600">Mobile Team</text>
                        </g>

                        {/* Bar 3: HR Team (Total 8: Low 2, Med 4, High 2) */}
                        <g className="chart-bar-group" transform="translate(268, 0)">
                          {/* Low (green) height 12 */}
                          <rect x="0" y="158" width="38" height="12" rx="2" fill="#00a88b" />
                          {/* Med (orange) height 24 */}
                          <rect x="0" y="134" width="38" height="24" fill="#f59e0b" />
                          {/* High (red) height 12 */}
                          <rect x="0" y="122" width="38" height="12" rx="2" fill="#ef4444" />
                          <text x="19" y="116" textAnchor="middle" fill="#0b4a4e" fontSize="11" fontWeight="700">3</text>
                          <text x="19" y="190" textAnchor="middle" fill="#718d9e" fontSize="10" fontWeight="600">HR Team</text>
                        </g>

                        {/* Bar 4: Design Team (Total 15: Low 3, Med 8, High 4) */}
                        <g className="chart-bar-group" transform="translate(368, 0)">
                          {/* Low (green) height 18 */}
                          <rect x="0" y="152" width="38" height="18" rx="2" fill="#00a88b" />
                          {/* Med (orange) height 48 */}
                          <rect x="0" y="104" width="38" height="48" fill="#f59e0b" />
                          {/* High (red) height 24 */}
                          <rect x="0" y="80" width="38" height="24" rx="2" fill="#ef4444" />
                          <text x="19" y="74" textAnchor="middle" fill="#0b4a4e" fontSize="11" fontWeight="700">5</text>
                          <text x="19" y="190" textAnchor="middle" fill="#718d9e" fontSize="10" fontWeight="600">Design Team</text>
                        </g>
                      </svg>
                    </div>
                  </article>

                  {/* Chart 2: Tasks by Status */}
                  <article className="mgr-chart-card">
                    <div className="mgr-chart-header">
                      <h3 className="mgr-chart-title">Tasks by Status</h3>
                    </div>

                    <div className="mgr-donut-chart-layout">
                      <div className="mgr-donut-svg-wrap">
                        <svg className="mgr-donut-svg" viewBox="0 0 160 160">
                          {/* Radius = 54, Circumference = 339.29 */}
                          {/* Completed: 28 (dash 155.74, offset 0) */}
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="transparent"
                            stroke="#00a88b"
                            strokeWidth="22"
                            strokeDasharray="155.74 183.55"
                            strokeDashoffset="0"
                            transform="rotate(-90 80 80)"
                          />
                          {/* In Progress: 16 (dash 88.99, offset -155.74) */}
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="transparent"
                            stroke="#0284c7"
                            strokeWidth="22"
                            strokeDasharray="88.99 250.3"
                            strokeDashoffset="-155.74"
                            transform="rotate(-90 80 80)"
                          />
                          {/* To Do: 12 (dash 66.75, offset -244.74) */}
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="transparent"
                            stroke="#8b5cf6"
                            strokeWidth="22"
                            strokeDasharray="66.75 272.54"
                            strokeDashoffset="-244.74"
                            transform="rotate(-90 80 80)"
                          />
                          {/* In Review: 5 (dash 27.81, offset -311.48) */}
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="transparent"
                            stroke="#f59e0b"
                            strokeWidth="22"
                            strokeDasharray="27.81 311.48"
                            strokeDashoffset="-311.48"
                            transform="rotate(-90 80 80)"
                          />
                        </svg>
                        <div className="mgr-donut-center-label">
                          <strong className="donut-center-number">61</strong>
                          <span className="donut-center-sub">Total</span>
                        </div>
                      </div>

                      <div className="mgr-donut-legend-list">
                        <div className="donut-legend-item">
                          <span className="legend-indicator purple" />
                          <span className="legend-item-name">To Do</span>
                          <strong className="legend-item-count">12</strong>
                        </div>
                        <div className="donut-legend-item">
                          <span className="legend-indicator blue" />
                          <span className="legend-item-name">In Progress</span>
                          <strong className="legend-item-count">16</strong>
                        </div>
                        <div className="donut-legend-item">
                          <span className="legend-indicator orange" />
                          <span className="legend-item-name">In Review</span>
                          <strong className="legend-item-count">5</strong>
                        </div>
                        <div className="donut-legend-item">
                          <span className="legend-indicator green" />
                          <span className="legend-item-name">Completed</span>
                          <strong className="legend-item-count">28</strong>
                        </div>
                      </div>
                    </div>
                  </article>
                </section>
              </div>
            )
          ) : activePage === "My Projects" ? (
            <section className="my-projects-page">
              <div className="projects-top-action-bar">
                <div className="projects-heading-group">
                  <h2 className="projects-section-title">All Projects</h2>
                </div>
                <div className="projects-actions-right">
                  <label className="projects-search-input-wrap">
                    <span className="search-glyph">⌕</span>
                    <input
                      type="search"
                      placeholder="Search projects..."
                      value={projectSearchQuery}
                      onChange={(e) => setProjectSearchQuery(e.target.value)}
                    />
                    {projectSearchQuery && (
                      <button
                        type="button"
                        className="clear-project-search"
                        onClick={() => setProjectSearchQuery("")}
                      >
                        ×
                      </button>
                    )}
                  </label>
                  <button
                    type="button"
                    className="btn-create-project-main"
                    onClick={() => setShowCreateProjectModal(true)}
                  >
                    + Create Project
                  </button>
                </div>
              </div>

              <div className="projects-table-container">
                <table className="projects-data-table">
                  <thead>
                    <tr>
                      <th>PROJECT</th>
                      <th>TEAM</th>
                      <th>PROGRESS</th>
                      <th>MEMBERS</th>
                      <th>DUE DATE</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsList
                      .filter((p) => {
                        if (!projectSearchQuery.trim()) return true;
                        const q = projectSearchQuery.toLowerCase();
                        return (
                          p.name.toLowerCase().includes(q) ||
                          p.team.toLowerCase().includes(q) ||
                          p.status.toLowerCase().includes(q) ||
                          p.dueDate.toLowerCase().includes(q)
                        );
                      })
                      .map((p) => (
                        <tr key={p.id} className="project-row">
                          <td className="proj-name-cell">
                            <strong>{p.name}</strong>
                          </td>
                          <td className="proj-team-cell">
                            <span>{p.team}</span>
                          </td>
                          <td className="proj-progress-cell">
                            <div className="proj-progress-line-wrap">
                              <div className="proj-bar-track">
                                <div
                                  className="proj-bar-fill"
                                  style={{
                                    width: `${p.progress}%`,
                                    backgroundColor:
                                      p.progress > 0 ? "#00a88b" : "#cbd5e1",
                                  }}
                                />
                              </div>
                              <span className="proj-bar-num">{p.progress}%</span>
                            </div>
                          </td>
                          <td className="proj-members-cell">
                            <div className="proj-member-avatars-cluster">
                              {p.memberAvatars.map((src, i) => (
                                <img
                                  key={i}
                                  src={src}
                                  alt="member"
                                  className="proj-avatar-circle"
                                />
                              ))}
                              <span className="proj-members-extra-badge">
                                +{p.membersExtra}
                              </span>
                            </div>
                          </td>
                          <td className="proj-date-cell">{p.dueDate}</td>
                          <td className="proj-status-cell">
                            <span
                              className={`proj-status-badge status-${p.status
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td
                            className="proj-actions-cell"
                            style={{ textAlign: "right" }}
                          >
                            <button
                              type="button"
                              className="btn-project-more"
                              onClick={() =>
                                setNotice(`Viewing details for ${p.name}`)
                              }
                            >
                              •••
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : activePage === "Reports & Reviews" ? (
            <section className="reports-reviews-page">
              <div className="reports-header-card">
                <span className="panel-eyebrow">AUDIT & COMPLIANCE</span>
                <h2>Reports & Reviews</h2>
                <p>Review pending deliverables, task approvals, and team quality metrics.</p>
              </div>
              <div className="reports-stats-grid">
                <div className="report-stat-card">
                  <span className="report-stat-label">Pending Reviews</span>
                  <strong className="report-stat-val">5</strong>
                  <span className="report-stat-sub text-amber">3 high priority</span>
                </div>
                <div className="report-stat-card">
                  <span className="report-stat-label">Approved This Week</span>
                  <strong className="report-stat-val">18</strong>
                  <span className="report-stat-sub text-green">100% on schedule</span>
                </div>
                <div className="report-stat-card">
                  <span className="report-stat-label">Rework Requests</span>
                  <strong className="report-stat-val">2</strong>
                  <span className="report-stat-sub text-teal">Average 1.2 revisions</span>
                </div>
              </div>
            </section>
          ) : activePage === "Teams" ? (
            <section className="teams-overview-page">
              <div className="teams-page-header">
                <div>
                  <span className="panel-eyebrow">WORKSPACE TEAMS</span>
                  <h2>Teams & Squads</h2>
                  <p>Manage project teams, members, and team lead delegations.</p>
                </div>
                <button
                  type="button"
                  className="btn-new-task-green"
                  onClick={() => setShowAddTeamModal(true)}
                >
                  + Add Team
                </button>
              </div>
              <div className="manager-teams-grid-layout" style={{ marginTop: "16px" }}>
                <article className="team-display-card">
                  <div className="team-display-header">
                    <h3 className="team-display-name">Alpha Team</h3>
                    <span className="team-display-count">5 members</span>
                  </div>
                  <div className="team-display-body">
                    <div className="team-member-avatar-cluster">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Maya Chen" className="stacked-avatar-img" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Arun Kumar" className="stacked-avatar-img" />
                      <span className="stacked-avatar-img avatar-initials mint">NR</span>
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" alt="Alex Johnson" className="stacked-avatar-img" />
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="David Kim" className="stacked-avatar-img" />
                    </div>
                    <div className="team-linked-project">
                      <div className="project-icon-box">▣</div>
                      <div className="project-meta-details">
                        <span className="project-eyebrow-text">Project</span>
                        <strong className="project-title-text">Client Portal</strong>
                      </div>
                    </div>
                  </div>
                  <div className="team-lead-display-row">
                    <span className="lead-prefix-label">Team Lead:</span>
                    <span className="lead-name-highlight">Alex Johnson</span>
                  </div>
                  <button type="button" className="btn-view-team-action" onClick={() => { navigateTo("Team Members"); setNotice("Showing Alpha Team assignments."); }}>View Team →</button>
                </article>
                <article className="team-display-card">
                  <div className="team-display-header">
                    <h3 className="team-display-name">Beta Team</h3>
                    <span className="team-display-count">5 members</span>
                  </div>
                  <div className="team-display-body">
                    <div className="team-member-avatar-cluster">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Priya Shah" className="stacked-avatar-img" />
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Daniel Lee" className="stacked-avatar-img" />
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Sara Wilson" className="stacked-avatar-img" />
                      <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80" alt="Marcus Vance" className="stacked-avatar-img" />
                      <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Chloe Bennett" className="stacked-avatar-img" />
                    </div>
                    <div className="team-linked-project">
                      <div className="project-icon-box">▣</div>
                      <div className="project-meta-details">
                        <span className="project-eyebrow-text">Project</span>
                        <strong className="project-title-text">Mobile App</strong>
                      </div>
                    </div>
                  </div>
                  <div className="team-lead-display-row">
                    <span className="lead-prefix-label">Team Lead:</span>
                    <span className="lead-name-highlight">Sara Wilson</span>
                  </div>
                  <button type="button" className="btn-view-team-action" onClick={() => { navigateTo("Team Members"); setNotice("Showing Beta Team assignments."); }}>View Team →</button>
                </article>
              </div>
            </section>          ) : (activePage === "My Tasks" || activePage === "Tasks") && !showTaskDetails ? (
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
                        setTaskFilterAssignee(
                          e.target.checked ? "assigned-to-me" : "all",
                        )
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
                    taskFilterStatus === "all" ||
                    task.status === taskFilterStatus;
                  const matchesPriority =
                    taskFilterPriority === "all" ||
                    task.priority === taskFilterPriority;
                  const matchesAssignee =
                    taskFilterAssignee === "all" ||
                    (task.assignedBy &&
                      (task.assignedBy.toLowerCase().includes("arun") ||
                        task.assignedBy.toLowerCase().includes("director") ||
                        task.assignedBy === "You"));
                  return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesAssignee
                  );
                });

                return (
                  <>
                    <div className="tasks-list-meta-row">
                      <span className="tasks-count-label">
                        <strong>{currentFiltered.length}</strong> tasks
                      </span>
                      <span className="tasks-sort-label">
                        Sorted by due date
                      </span>
                    </div>

                    <div className="tasks-table-container-card">
                      <table className="screenshot-tasks-table">
                        <thead>
                          <tr>
                            <th scope="col" className="col-task">
                              TASK
                            </th>
                            <th scope="col" className="col-project">
                              PROJECT
                            </th>
                            <th scope="col" className="col-assigned">
                              ASSIGNED BY
                            </th>
                            <th scope="col" className="col-due">
                              DUE DATE
                            </th>
                            <th scope="col" className="col-priority">
                              PRIORITY
                            </th>
                            <th scope="col" className="col-status">
                              STATUS
                            </th>
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
                                  navigateToTaskDetails(task.id);
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
                                              : t,
                                          ),
                                        );
                                      }}
                                      title={
                                        task.status === "Completed"
                                          ? "Mark incomplete"
                                          : "Mark complete"
                                      }
                                    >
                                      <span className="sub-ring">
                                        {task.status === "Completed"
                                          ? "✓"
                                          : "○"}
                                      </span>
                                    </span>
                                    <span className="task-title-text">
                                      {task.title}
                                    </span>
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
                                    <span className="project-name-text">
                                      {task.project}
                                    </span>
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
                <div className="board-filter-note">
                  <span className="board-live-dot" /> Live team workflow{" "}
                  <span className="board-team-count">
                    {teamMembers.length} members
                  </span>
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
              <div className="kanban-board">
                {(["To do", "In progress", "Review", "Completed"] as const).map(
                  (column) => {
                    const columnCards = boardCards.filter(
                      (card) => card.column === column,
                    );
                    return (
                      <section
                        className={`kanban-column kanban-${column.toLowerCase().replace(" ", "-")}`}
                        key={column}
                      >
                        <header className="kanban-column-header">
                          <div>
                            <span className="column-status-dot" />
                            <h2>{column}</h2>
                          </div>
                          <span className="kanban-count">
                            {columnCards.length}
                          </span>
                        </header>
                        <div className="kanban-cards">
                          {columnCards.length ? (
                            columnCards.map((card) => (
                              <article className="kanban-card" key={card.id}>
                                <div className="kanban-card-topline">
                                  <span
                                    className={`priority-dot priority-${card.priority.toLowerCase()}`}
                                  />{" "}
                                  <span>{card.priority} priority</span>
                                  <button
                                    type="button"
                                    aria-label={`Open ${card.title}`}
                                    onClick={() => {
                                      const match = tasks.find((task) =>
                                        task.title
                                          .toLowerCase()
                                          .includes(
                                            card.title
                                              .toLowerCase()
                                              .split(" ")[0],
                                          ),
                                      );
                                      if (match) {
                                        navigateToTaskDetails(match.id);
                                      } else
                                        setNotice(`${card.title} selected.`);
                                    }}
                                  >
                                    •••
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  className="kanban-card-title"
                                  onClick={() => {
                                    const match = tasks.find((task) =>
                                      task.title
                                        .toLowerCase()
                                        .includes(
                                          card.title
                                            .toLowerCase()
                                            .split(" ")[0],
                                        ),
                                    );
                                    if (match) {
                                      navigateToTaskDetails(match.id);
                                    } else setNotice(`${card.title} selected.`);
                                  }}
                                >
                                  {card.title}
                                </button>
                                <span className="kanban-project-label">
                                  {card.project}
                                </span>
                                <div className="kanban-card-footer">
                                  <div className="kanban-assignee">
                                    <span className="assignee-avatar-badge">
                                      {card.assigneeInitials}
                                    </span>
                                    <span>{card.assignee}</span>
                                  </div>
                                  <span
                                    className={`kanban-due ${card.due === "Today" ? "due-today-accent" : ""}`}
                                  >
                                    {card.due}
                                  </span>
                                </div>
                                <div className="kanban-move-row">
                                  <label htmlFor={`move-${card.id}`}>
                                    Move to
                                  </label>
                                  <select
                                    id={`move-${card.id}`}
                                    value={card.column}
                                    onChange={(event) =>
                                      setBoardCards((previous) =>
                                        previous.map((item) =>
                                          item.id === card.id
                                            ? {
                                                ...item,
                                                column: event.target
                                                  .value as BoardCard["column"],
                                              }
                                            : item,
                                        ),
                                      )
                                    }
                                  >
                                    <option>To do</option>
                                    <option>In progress</option>
                                    <option>Review</option>
                                    <option>Completed</option>
                                  </select>
                                </div>
                              </article>
                            ))
                          ) : (
                            <div className="kanban-empty">
                              No tasks in this stage.
                            </div>
                          )}
                        </div>
                      </section>
                    );
                  },
                )}
              </div>
              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · TEAM WORKFLOW</span>
                <span>SCREEN 06 / 11</span>
              </footer>
            </section>
          ) : activePage === "Team Chat" || activePage === "Direct Messages" ? (
            <section className="messaging-page">
              <div className="messaging-layout">
                <aside className="chat-sidebar-card">
                  <div className="chat-sidebar-heading">
                    <div>
                      <span className="panel-eyebrow">CONVERSATIONS</span>
                      <h2>
                        {activePage === "Team Chat" ? "Channels" : "Messages"}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="chat-add-button"
                      onClick={() =>
                        setNotice(
                          activePage === "Team Chat"
                            ? "Channel creation is available in this demo workspace."
                            : "Choose a teammate from the list to start a direct message.",
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  {activePage === "Team Chat" ? (
                    <div className="chat-list">
                      {initialChannels.map((channel) => (
                        <button
                          type="button"
                          key={channel.id}
                          className={`chat-list-item ${activeChannelId === channel.id ? "active" : ""}`}
                          onClick={() => setActiveChannelId(channel.id)}
                        >
                          <span className="chat-list-avatar channel-avatar">
                            #
                          </span>
                          <span className="chat-list-copy">
                            <strong>{channel.name}</strong>
                            <small>{channel.description}</small>
                          </span>
                          {channel.unreadCount > 0 && (
                            <span className="chat-unread-count">
                              {channel.unreadCount}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="chat-list">
                      {initialDirectContacts.map((contact) => {
                        const latestMessage = (directMessages[contact.id] ||
                          [])[
                          ((directMessages[contact.id] || []).length || 1) - 1
                        ];
                        return (
                          <button
                            type="button"
                            key={contact.id}
                            className={`chat-list-item ${activeDmContactId === contact.id ? "active" : ""}`}
                            onClick={() => setActiveDmContactId(contact.id)}
                          >
                            <span className="chat-list-avatar">
                              {contact.initials}
                              <i
                                className={`presence-dot ${contact.status.toLowerCase()}`}
                              />
                            </span>
                            <span className="chat-list-copy">
                              <strong>{contact.name}</strong>
                              <small>
                                {latestMessage?.text || contact.role}
                              </small>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="chat-sidebar-footer">
                    <span className="presence-dot online" /> Team Alpha · 6
                    members active
                  </div>
                </aside>
                <section className="conversation-card">
                  <header className="conversation-header">
                    <div className="conversation-title-avatar">
                      {activePage === "Team Chat"
                        ? "#"
                        : activeDmContact.initials}
                    </div>
                    <div className="conversation-heading">
                      <h2>
                        {activePage === "Team Chat"
                          ? activeChannel.name
                          : activeDmContact.name}
                      </h2>
                      <span>
                        {activePage === "Team Chat"
                          ? `Group chat · ${activeChannel.description}`
                          : `${activeDmContact.role} · ${activeDmContact.status}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="conversation-more-button"
                      onClick={() =>
                        setNotice("Conversation details are up to date.")
                      }
                      aria-label="Conversation options"
                    >
                      •••
                    </button>
                  </header>
                  <div className="conversation-messages">
                    {(activePage === "Team Chat"
                      ? chatMessages[activeChannelId] || []
                      : directMessages[activeDmContactId] || []
                    ).map((message) => (
                      <article
                        key={message.id}
                        className={`message-row ${message.isSelf ? "message-self" : ""}`}
                      >
                        {!message.isSelf && (
                          <span className="message-avatar">
                            {message.senderInitials}
                          </span>
                        )}
                        <div className="message-content">
                          <div className="message-meta">
                            <strong>{message.sender}</strong>
                            <time>{message.time}</time>
                          </div>
                          <p>{message.text}</p>
                        </div>
                        {message.isSelf && (
                          <span className="message-avatar self-avatar">
                            {message.senderInitials}
                          </span>
                        )}
                      </article>
                    ))}
                  </div>
                  <form
                    className="message-compose"
                    onSubmit={
                      activePage === "Team Chat"
                        ? sendChatMessage
                        : sendDirectMessage
                    }
                  >
                    <textarea
                      aria-label="Write a message"
                      placeholder="Write a message… Use @ to mention someone"
                      rows={2}
                      value={
                        activePage === "Team Chat" ? chatInputText : dmInputText
                      }
                      onChange={(event) =>
                        activePage === "Team Chat"
                          ? setChatInputText(event.target.value)
                          : setDmInputText(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          if (activePage === "Team Chat")
                            sendChatMessage(event);
                          else sendDirectMessage(event);
                        }
                      }}
                    />
                    <div className="compose-actions">
                      <button
                        type="button"
                        className="compose-utility"
                        onClick={() =>
                          setNotice(
                            "Attachments can be added when file sharing is enabled.",
                          )
                        }
                      >
                        ＋ Attach
                      </button>
                      <span className="compose-hint">
                        Enter to send · Shift + Enter for new line
                      </span>
                      <button type="submit" className="send-message-button">
                        Send <span>→</span>
                      </button>
                    </div>
                  </form>
                </section>
              </div>
              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · MESSAGES</span>
                <span>
                  {activePage === "Team Chat"
                    ? "SCREEN 08 / 11"
                    : "SCREEN 09 / 11"}
                </span>
              </footer>
            </section>
          ) : activePage === "Time Logs" ? (
            <section className="time-logs-page">
              <div className="time-log-filter-row">
                <label>
                  Team member
                  <select
                    value={timeLogUserFilter}
                    onChange={(event) =>
                      setTimeLogUserFilter(event.target.value)
                    }
                  >
                    <option value="all">All team members</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Period
                  <select defaultValue="7">
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </label>
                <label>
                  Event type
                  <select
                    value={timeLogEventFilter}
                    onChange={(event) =>
                      setTimeLogEventFilter(event.target.value)
                    }
                  >
                    <option value="all">All task events</option>
                    <option value="Started">Started</option>
                    <option value="Stopped">Stopped</option>
                    <option value="Updated">Updated</option>
                    <option value="Completed">Completed</option>
                    <option value="Comment">Comment</option>
                  </select>
                </label>
                <div className="time-log-summary">
                  <span className="time-log-summary-value">18h 35m</span>
                  <span>This week</span>
                </div>
              </div>
              <div className="table-scroll-card">
                <table className="workspace-data-table time-log-table">
                  <thead>
                    <tr>
                      <th>TIME</th>
                      <th>USER</th>
                      <th>ACTIVITY</th>
                      <th>TASK</th>
                      <th>DURATION</th>
                      <th>EVENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeLogs
                      .filter(
                        (entry) =>
                          (timeLogUserFilter === "all" ||
                            entry.user === timeLogUserFilter) &&
                          (timeLogEventFilter === "all" ||
                            entry.event === timeLogEventFilter),
                      )
                      .map((entry) => (
                        <tr key={entry.id}>
                          <td className="time-cell">{entry.time}</td>
                          <td>
                            <span className="table-user">
                              <span className="assignee-avatar-badge">
                                {entry.userInitials}
                              </span>
                              {entry.user}
                            </span>
                          </td>
                          <td>{entry.activity}</td>
                          <td>
                            <strong className="table-task-name">
                              {entry.task}
                            </strong>
                          </td>
                          <td className="duration-cell">{entry.duration}</td>
                          <td>
                            <span
                              className={`event-pill event-${entry.event.toLowerCase()}`}
                            >
                              {entry.event}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · AUDIT TRAIL</span>
                <span>SCREEN 10 / 11</span>
              </footer>
            </section>
          ) : activePage === "Team Members" ? (
            <section className="team-members-page">
              <div className="team-summary-card">
                <div className="team-summary-icon">TA</div>
                <div className="team-summary-copy">
                  <span className="panel-eyebrow">TEAM ALPHA</span>
                  <h2>
                    Team lead: Priya S. <span>·</span> {teamMembers.length}{" "}
                    members <span>·</span> 2 active projects
                  </h2>
                  <p>
                    Permissions are role-based. Team leads manage team
                    membership; members can assign tasks only where permitted.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-new-task-green"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  <span className="plus-sign">+</span>
                  <span>Add member</span>
                </button>
              </div>
              <div className="team-permission-note">
                <span className="permission-lock">✓</span>
                <span>
                  Role-based access is active. Only team leads and workspace
                  admins can manage membership and change roles.
                </span>
              </div>
              <div className="table-scroll-card">
                <table className="workspace-data-table member-table">
                  <thead>
                    <tr>
                      <th>MEMBER</th>
                      <th>EMAIL</th>
                      <th>ROLE</th>
                      <th>ACTIVE TASKS</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => {
                      const memberInitials = member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                      return (
                        <tr key={member.id}>
                          <td>
                            <span className="table-user member-name-cell">
                              <span className="assignee-avatar-badge">
                                {memberInitials}
                              </span>
                              <strong>{member.name}</strong>
                            </span>
                          </td>
                          <td className="member-email">{member.email}</td>
                          <td>
                            <span
                              className={`role-pill ${member.role === "Team Lead" || member.role === "Admin" ? "role-lead" : ""}`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td className="active-task-number">
                            {member.activeTasks}
                          </td>
                          <td>
                            <span
                              className={`member-status ${member.status.toLowerCase()}`}
                            >
                              <i />
                              {member.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="table-action-link"
                              onClick={() =>
                                setNotice(
                                  `${member.name} · ${member.role} · ${member.activeTasks} active tasks`,
                                )
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · MEMBERS & PERMISSIONS</span>
                <span>SCREEN 11 / 11</span>
              </footer>
              {showAddMemberModal && (
                <div
                  className="modal-backdrop"
                  role="presentation"
                  onClick={(event) => {
                    if (event.target === event.currentTarget)
                      setShowAddMemberModal(false);
                  }}
                >
                  <form className="member-modal" onSubmit={addTeamMember}>
                    <button
                      type="button"
                      className="modal-close"
                      onClick={() => setShowAddMemberModal(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <span className="panel-eyebrow">TEAM ALPHA</span>
                    <h2>Add a team member</h2>
                    <p>Invite a teammate and choose their workspace role.</p>
                    <label>
                      Full name
                      <input
                        autoFocus
                        value={newMemberName}
                        onChange={(event) =>
                          setNewMemberName(event.target.value)
                        }
                        placeholder="e.g. Asha Kumar"
                        required
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(event) =>
                          setNewMemberEmail(event.target.value)
                        }
                        placeholder="name@company.in"
                        required
                      />
                    </label>
                    <label>
                      Role
                      <select
                        value={newMemberRole}
                        onChange={(event) =>
                          setNewMemberRole(
                            event.target.value as typeof newMemberRole,
                          )
                        }
                      >
                        <option>Member</option>
                        <option>Team Lead</option>
                        <option>Admin</option>
                      </select>
                    </label>
                    <button
                      type="submit"
                      className="btn-new-task-green modal-submit"
                    >
                      Add member
                    </button>
                  </form>
                </div>
              )}
            </section>
          ) : activePage === "Notifications" ? (
            <section className="notifications-page">
              <div className="notifications-toolbar">
                <div>
                  <span className="notification-unread-count">
                    {notifications.filter((item) => item.unread).length} unread
                  </span>
                  <span className="notification-toolbar-note">
                    Stay up to date with your team's work.
                  </span>
                </div>
                <div className="notification-actions">
                  <div className="notification-filter-tabs">
                    <button
                      className={notificationFilter === "all" ? "active" : ""}
                      type="button"
                      onClick={() => setNotificationFilter("all")}
                    >
                      All
                    </button>
                    <button
                      className={
                        notificationFilter === "unread" ? "active" : ""
                      }
                      type="button"
                      onClick={() => setNotificationFilter("unread")}
                    >
                      Unread
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mark-read-button"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                </div>
              </div>
              <div className="notification-list-card">
                {visibleNotifications.length ? (
                  visibleNotifications.map((item) => (
                    <article
                      key={item.id}
                      className={`notification-item ${item.unread ? "unread" : ""}`}
                    >
                      <div
                        className={`notification-icon notification-${item.type}`}
                      >
                        {item.type === "task"
                          ? "✓"
                          : item.type === "chat"
                            ? "#"
                            : item.type === "mention"
                              ? "@"
                              : "◷"}
                      </div>
                      <div className="notification-copy">
                        <div className="notification-title-row">
                          <h3>{item.title}</h3>
                          {item.unread && <span className="unread-dot" />}
                        </div>
                        <p>{item.detail}</p>
                        <time>{item.time}</time>
                      </div>
                      <button
                        type="button"
                        className="notification-dismiss"
                        aria-label="Mark notification read"
                        onClick={() =>
                          setNotifications((previous) =>
                            previous.map((notification) =>
                              notification.id === item.id
                                ? { ...notification, unread: false }
                                : notification,
                            ),
                          )
                        }
                      >
                        {item.unread ? "Mark read" : "✓"}
                      </button>
                    </article>
                  ))
                ) : (
                  <div className="notification-empty">
                    You're all caught up.
                  </div>
                )}
              </div>
              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · NOTIFICATIONS</span>
                <span>WORKSPACE ACTIVITY</span>
              </footer>
            </section>
          ) : activePage === "Profile" ? (
            <section className="settings-page profile-page">
              <div className="profile-hero-card">
                <div className="profile-large-avatar">{initials || "AD"}</div>
                <div className="profile-hero-copy">
                  <span className="panel-eyebrow">WORKSPACE MEMBER</span>
                  <h2>{userName}</h2>
                  <p>{userEmail}</p>
                </div>
                <span className="profile-active-badge">
                  <i /> Active
                </span>
              </div>
              <form
                className="settings-card profile-settings-card"
                onSubmit={(event) => {
                  event.preventDefault();
                  setNotice("Profile changes saved.");
                }}
              >
                <div className="settings-card-heading">
                  <div>
                    <h3>Personal information</h3>
                    <p>Keep your account details current for your team.</p>
                  </div>
                </div>
                <div className="settings-form-grid">
                  <label>
                    Full name
                    <input defaultValue={userName} />
                  </label>
                  <label>
                    Email address
                    <input type="email" defaultValue={userEmail} />
                  </label>
                  <label>
                    Department
                    <input
                      value={profileDepartment}
                      onChange={(event) =>
                        setProfileDepartment(event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Time zone
                    <select
                      value={profileTimezone}
                      onChange={(event) =>
                        setProfileTimezone(event.target.value)
                      }
                    >
                      <option>IST (UTC+05:30)</option>
                      <option>UTC</option>
                      <option>EST (UTC-05:00)</option>
                      <option>PST (UTC-08:00)</option>
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn-new-task-green settings-save-button"
                >
                  Save profile
                </button>
              </form>
              <div className="settings-card account-security-card">
                <div className="settings-card-heading">
                  <div>
                    <h3>Account security</h3>
                    <p>Security options for your Work Flow account.</p>
                  </div>
                </div>
                <div className="setting-toggle-row">
                  <div>
                    <strong>Two-step verification</strong>
                    <small>
                      Add a second verification step when signing in.
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch ${twoFactorEnabled ? "enabled" : ""}`}
                    role="switch"
                    aria-checked={twoFactorEnabled}
                    onClick={() => setTwoFactorEnabled((value) => !value)}
                  >
                    <span />
                  </button>
                </div>
              </div>
              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · PROFILE</span>
                <span>ACCOUNT</span>
              </footer>
            </section>
          ) : activePage === "Settings" ? (
            <section className="settings-page">
              <form
                className="settings-card"
                onSubmit={(event) => {
                  event.preventDefault();
                  setNotice("Workspace settings saved.");
                }}
              >
                <div className="settings-card-heading">
                  <div>
                    <span className="panel-eyebrow">WORKSPACE</span>
                    <h3>General settings</h3>
                    <p>Manage shared workspace preferences and defaults.</p>
                  </div>
                </div>
                <label className="settings-wide-field">
                  Workspace name
                  <input
                    value={workspaceNameSetting}
                    onChange={(event) =>
                      setWorkspaceNameSetting(event.target.value)
                    }
                  />
                </label>
                <label className="settings-wide-field">
                  Default team
                  <select defaultValue="Team Alpha">
                    <option>Team Alpha</option>
                    <option>Team Beta</option>
                    <option>Team Delta</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="btn-new-task-green settings-save-button"
                >
                  Save settings
                </button>
              </form>
              <div className="settings-card">
                <div className="settings-card-heading">
                  <div>
                    <h3>Notifications</h3>
                    <p>Choose how Work Flow keeps you informed.</p>
                  </div>
                </div>
                <div className="setting-toggle-row">
                  <div>
                    <strong>Email alerts</strong>
                    <small>Receive important task and mention updates.</small>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch ${emailAlertsEnabled ? "enabled" : ""}`}
                    role="switch"
                    aria-checked={emailAlertsEnabled}
                    onClick={() => setEmailAlertsEnabled((value) => !value)}
                  >
                    <span />
                  </button>
                </div>
                <div className="setting-toggle-row">
                  <div>
                    <strong>Daily digest</strong>
                    <small>Get a summary of team activity each day.</small>
                  </div>
                  <button
                    type="button"
                    className="toggle-switch"
                    role="switch"
                    aria-checked="false"
                    onClick={(event) => {
                      const button = event.currentTarget;
                      const enabled =
                        button.getAttribute("aria-checked") !== "true";
                      button.setAttribute("aria-checked", String(enabled));
                      button.classList.toggle("enabled", enabled);
                      setNotice(
                        enabled
                          ? "Daily digest enabled."
                          : "Daily digest disabled.",
                      );
                    }}
                  >
                    <span />
                  </button>
                </div>
              </div>
              <div className="settings-card">
                <div className="settings-card-heading">
                  <div>
                    <h3>Workspace access</h3>
                    <p>
                      Role permissions currently apply to the Team Alpha
                      workspace.
                    </p>
                  </div>
                </div>
                <div className="settings-access-row">
                  <span className="permission-lock">✓</span>
                  <span>
                    Only team leads and admins can add or change member roles.
                  </span>
                  <button
                    type="button"
                    className="table-action-link"
                    onClick={() => navigateTo("Team Members")}
                  >
                    Manage members
                  </button>
                </div>
              </div>
              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · PREFERENCES</span>
                <span>WORKSPACE SETTINGS</span>
              </footer>
            </section>
          ) : (activePage === "My Tasks" || activePage === "Tasks") && showTaskDetails ? (
            <section className="task-detail-page">
              <button
                type="button"
                className="task-back-pill"
                onClick={() => setShowTaskDetails(false)}
              >
                ← Back to My Tasks
              </button>

              <div className="task-detail-layout">
                {/* Left Column: Equal height container */}
                <div className="task-detail-left-col">
                  {/* Top Card: Task Core Info */}
                  <article className="task-detail-main-card">
                    <div className="task-meta-header">
                      <span className="task-code-project">
                        {selectedTask.id} · {selectedTask.project.toUpperCase()}
                      </span>
                    </div>

                    <h1 className="task-detail-title">{selectedTask.title}</h1>

                    <div className="task-badges-row">
                      <span
                        className={`task-status-badge status-${selectedTask.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {selectedTask.status.toUpperCase()}
                      </span>
                      <span className="task-meta-item">
                        Priority:{" "}
                        <strong
                          className={`priority-text priority-${selectedTask.priority.toLowerCase()}`}
                        >
                          {selectedTask.priority}
                        </strong>
                      </span>
                      <span className="task-meta-item">
                        <span className="meta-icon">📅</span> Due:{" "}
                        <strong>{selectedTask.due}</strong>
                      </span>
                    </div>

                    {/* 3-Column Summary Strip */}
                    <div className="task-summary-strip">
                      <div className="summary-col">
                        <div className="summary-avatar">
                          {selectedTask.assignedByInitials || "MC"}
                        </div>
                        <div className="summary-info">
                          <span className="summary-label">Assigned by</span>
                          <strong className="summary-value">
                            {selectedTask.assignedBy || "Maya Chen"}
                          </strong>
                        </div>
                      </div>

                      <div className="summary-divider" />

                      <div className="summary-col">
                        <div className="summary-avatar project-avatar">
                          {selectedTask.projectCode ||
                            selectedTask.project.charAt(0)}
                        </div>
                        <div className="summary-info">
                          <span className="summary-label">Project</span>
                          <strong className="summary-value">
                            {selectedTask.project}
                          </strong>
                        </div>
                      </div>

                      <div className="summary-divider" />

                      <div className="summary-col">
                        <div className="summary-avatar icon-avatar">📅</div>
                        <div className="summary-info">
                          <span className="summary-label">Created</span>
                          <strong className="summary-value">
                            {selectedTask.created || "27 Oct 2026"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Tabs Bar */}
                    <div className="task-tabs-bar">
                      {(
                        [
                          "Details",
                          "Comments",
                          "Attachments",
                          "Activity",
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          className={`task-tab-btn ${
                            activeTaskTab === tab ? "active" : ""
                          }`}
                          onClick={() => setActiveTaskTab(tab)}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    {activeTaskTab === "Details" && (
                      <div className="task-tab-body">
                        <div className="task-section-block">
                          <h3 className="task-section-title">Description</h3>
                          <p className="task-description-p">
                            {selectedTask.description ||
                              "No description provided for this task yet."}
                          </p>
                        </div>

                        <div className="task-section-block">
                          <h3 className="task-section-title">
                            Acceptance checklist
                          </h3>
                          <div className="checklist-container">
                            {(selectedTask.acceptanceChecklist || []).map(
                              (item) => (
                                <label
                                  key={item.id}
                                  className="checklist-item-row"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() =>
                                      toggleChecklistItem(item.id)
                                    }
                                  />
                                  <span className="checklist-box">
                                    {item.completed ? "✓" : ""}
                                  </span>
                                  <span
                                    className={`checklist-text ${
                                      item.completed ? "completed" : ""
                                    }`}
                                  >
                                    {item.text}
                                  </span>
                                </label>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Interactive Task Action Row */}
                        <div className="task-actions-row">
                          <button
                            type="button"
                            className={`btn-mark-complete-main ${
                              selectedTask.status === "Completed"
                                ? "is-completed"
                                : ""
                            }`}
                            onClick={handleMarkCompleteClick}
                          >
                            ✓{" "}
                            {selectedTask.status === "Completed"
                              ? "Task completed (Click to re-open)"
                              : "Mark complete"}
                          </button>
                        </div>

                        {/* Completion Notes Section */}
                        {completionNotesVisible && (
                          <div className="completion-notes-container">
                            <label
                              htmlFor="completion-notes-input"
                              className="task-section-title"
                            >
                              Completion notes
                            </label>
                            <textarea
                              id="completion-notes-input"
                              rows={2}
                              placeholder="Add completion notes..."
                              value={completionNotesText}
                              onChange={(e) =>
                                setCompletionNotesText(e.target.value)
                              }
                            />
                            <div className="notes-save-actions">
                              <button
                                type="button"
                                className="btn-green-action"
                                onClick={saveTaskCompletion}
                              >
                                Save completion
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTaskTab !== "Details" && (
                      <div className="task-tab-placeholder">
                        <p>
                          No {activeTaskTab.toLowerCase()} recorded for this
                          task yet.
                        </p>
                      </div>
                    )}
                  </article>

                  {/* Bottom Card: Changes Description */}
                  <article className="task-changes-card">
                    <h3 className="task-section-title">Changes description</h3>
                    <textarea
                      rows={2}
                      placeholder="Describe the changes made..."
                      value={changesDescriptionText}
                      onChange={(e) =>
                        setChangesDescriptionText(e.target.value)
                      }
                    />
                    <div className="changes-save-actions">
                      <button
                        type="button"
                        className="btn-green-action"
                        onClick={saveChangesDescription}
                      >
                        Save changes
                      </button>
                    </div>
                  </article>
                </div>

                {/* Right Column: Equalized Matching Cards */}
                <div className="task-detail-right-col">
                  {/* Top Right Card: Time Tracking & Task Controls */}
                  <aside className="task-controls-card">
                    <div className="task-controls-header">
                      <span className="controls-icon">⚙</span>
                      <h3>Task Controls</h3>
                    </div>

                    <div className="time-tracking-section">
                      <span className="time-tracking-label">Time tracking</span>
                      <div className="time-tracking-clock">
                        {formatTime(selectedTask.timeSpentSeconds || 0)}
                      </div>

                      <button
                        type="button"
                        className="btn-controls-pause"
                        onClick={toggleTaskTimer}
                      >
                        {taskTimerActive ? "⏸ Pause task" : "▶ Start task"}
                      </button>

                      <button
                        type="button"
                        className="btn-controls-reassign"
                        onClick={() => openTaskEditor("reassign", selectedTask)}
                      >
                        Reassign task
                      </button>
                    </div>

                    <div className="timer-rule-box">
                      <div className="timer-rule-title">
                        <span className="timer-icon">🕒</span>
                        <strong>Timer rule</strong>
                      </div>
                      <p>
                        The timer keeps running until explicitly stopped.
                        Leaving or signing out does not stop it.
                      </p>
                    </div>
                  </aside>

                  {/* Bottom Right Card: Task Properties & Review Alignment */}
                  <aside className="task-properties-card">
                    <div className="task-properties-header">
                      <span className="properties-icon">📋</span>
                      <h3>Task Properties</h3>
                    </div>

                    <div className="controls-meta-list">
                      <div className="controls-meta-row assigned-to-row">
                        <span className="controls-meta-label">Assigned to</span>
                        <div className="controls-user-info">
                          <div className="controls-avatar">
                            {selectedTask.assignedByInitials || "MC"}
                          </div>
                          <div className="controls-user-text">
                            <strong>
                              {selectedTask.assignedBy || "Maya Chen"}
                            </strong>
                            <small>Team Member</small>
                          </div>
                        </div>
                      </div>

                      <div className="controls-meta-row project-row">
                        <span className="controls-meta-label">Project</span>
                        <div className="controls-user-info">
                          <div className="controls-avatar project-avatar">
                            {selectedTask.projectCode ||
                              selectedTask.project.charAt(0)}
                          </div>
                          <strong className="controls-project-name">
                            {selectedTask.project}
                          </strong>
                        </div>
                      </div>

                      <div className="controls-meta-row flex-between">
                        <span className="controls-meta-label-icon">
                          <span className="meta-row-icon">⚑</span> Priority
                        </span>
                        <span
                          className={`priority-pill priority-${selectedTask.priority.toLowerCase()}`}
                        >
                          {selectedTask.priority}
                        </span>
                      </div>

                      <div className="controls-meta-row flex-between">
                        <span className="controls-meta-label-icon">
                          <span className="meta-row-icon">📅</span> Due date
                        </span>
                        <span className="controls-meta-val">
                          {selectedTask.due}
                        </span>
                      </div>

                      <div className="controls-meta-row flex-between">
                        <span className="controls-meta-label-icon">
                          <span className="meta-row-icon">🕒</span> Status
                        </span>
                        <span
                          className={`status-pill status-${selectedTask.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {selectedTask.status}
                        </span>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>

              <footer className="screen-indicator-footer">
                <span>
                  TEAM WORKSPACE WEB APP · TASK WORKFLOW · Live Task Record
                </span>
                <span>SCREEN 03 / 11</span>
              </footer>
            </section>
          ) : activePage === "Create Task" ? (
            <section className="task-editor-page">
              <form className="task-editor-form" onSubmit={createTaskFromForm}>
                <section className="task-editor-card">
                  <h2 className="editor-card-title">TASK DETAILS</h2>

                  <label className="editor-field-label">
                    <span>Task title</span>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(event) => setNewTaskTitle(event.target.value)}
                      placeholder="Prepare invoice export API"
                      required
                    />
                  </label>

                  <label className="editor-field-label">
                    <span>Project</span>
                    <select
                      value={newTaskProject}
                      onChange={(event) =>
                        setNewTaskProject(event.target.value)
                      }
                    >
                      <option>Billing Portal</option>
                      <option>Client Portal</option>
                      <option>Invoice module</option>
                      <option>Northstar portal</option>
                      <option>Marketing site</option>
                      <option>Platform Upgrade</option>
                      <option>Team Workspace</option>
                    </select>
                  </label>

                  <label className="editor-field-label">
                    <span>Description</span>
                    <textarea
                      rows={3}
                      value={newTaskDescription}
                      onChange={(event) =>
                        setNewTaskDescription(event.target.value)
                      }
                      placeholder="Describe the task and expected outcome"
                    />
                  </label>

                  <div className="task-editor-fields-row">
                    <label className="editor-field-label">
                      <span>Priority</span>
                      <select
                        value={newTaskPriority}
                        onChange={(event) =>
                          setNewTaskPriority(
                            event.target.value as typeof newTaskPriority,
                          )
                        }
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </label>

                    <label className="editor-field-label">
                      <span>Due date</span>
                      <input
                        type="date"
                        value={newTaskDue}
                        onChange={(event) => setNewTaskDue(event.target.value)}
                      />
                    </label>
                  </div>

                  <label className="editor-field-label">
                    <span>Parent task</span>
                    <select
                      value={newTaskParent}
                      onChange={(event) => setNewTaskParent(event.target.value)}
                    >
                      <option value="">No parent task</option>
                      {tasks
                        .filter((task) => task.id !== selectedTaskId)
                        .map((task) => (
                          <option key={task.id} value={task.id}>
                            {task.title}
                          </option>
                        ))}
                    </select>
                  </label>
                </section>

                <section className="task-editor-card">
                  <h2 className="editor-card-title">ASSIGNMENT</h2>

                  <label className="editor-field-label">
                    <span>Assign to</span>
                    <select
                      value={newTaskAssignee}
                      onChange={(event) =>
                        setNewTaskAssignee(event.target.value)
                      }
                      required
                    >
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.name}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="editor-field-label">
                    <span>Team / visibility</span>
                    <select
                      value={newTaskTeam}
                      onChange={(event) => setNewTaskTeam(event.target.value)}
                    >
                      <option>Team Alpha</option>
                      <option>Team Beta</option>
                      <option>Private</option>
                    </select>
                  </label>

                  <label className="editor-field-label">
                    <span>Checklist</span>
                    <textarea
                      rows={4}
                      value={newTaskChecklist}
                      onChange={(event) =>
                        setNewTaskChecklist(event.target.value)
                      }
                      placeholder="One checklist item per line"
                    />
                  </label>

                  <button type="submit" className="btn-task-editor-submit">
                    {createTaskMode === "reassign"
                      ? "Save & reassign"
                      : "Save & assign"}
                  </button>
                </section>
              </form>

              <footer className="screen-indicator-footer">
                <span>TEAM WORKSPACE WEB APP · TASK WORKFLOW</span>
                <span>CREATE TASK</span>
              </footer>
            </section>
          ) : (
            <section className="coming-soon-page">
              <h2>{activePage}</h2>
              <p>Page is not available.</p>
            </section>
          )}
        </div>
      </section>

      {showCreateTaskModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget)
              setShowCreateTaskModal(false);
          }}
        >
          <form
            className="member-modal create-task-modal"
            onSubmit={createTaskFromForm}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowCreateTaskModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="panel-eyebrow">TASK DETAILS</span>
            <h2>Create and assign task</h2>
            <p>
              Team leads and permitted members can create tasks and assign
              ownership.
            </p>
            <label>
              Task title
              <input
                autoFocus
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="Prepare invoice export API"
                required
              />
            </label>
            <div className="settings-form-grid">
              <label>
                Project
                <select
                  value={newTaskProject}
                  onChange={(event) => setNewTaskProject(event.target.value)}
                >
                  <option>Billing Portal</option>
                  <option>Invoice module</option>
                  <option>Northstar portal</option>
                  <option>Marketing site</option>
                  <option>Platform Upgrade</option>
                </select>
              </label>
              <label>
                Assign to
                <select
                  value={newTaskAssignee}
                  onChange={(event) => setNewTaskAssignee(event.target.value)}
                >
                  {teamMembers.map((member) => (
                    <option key={member.id}>{member.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select
                  value={newTaskPriority}
                  onChange={(event) =>
                    setNewTaskPriority(
                      event.target.value as typeof newTaskPriority,
                    )
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
              <label>
                Due date
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={(event) => setNewTaskDue(event.target.value)}
                />
              </label>
            </div>
            <label>
              Description
              <textarea
                rows={3}
                value={newTaskDescription}
                onChange={(event) => setNewTaskDescription(event.target.value)}
                placeholder="Describe the task and expected outcome"
              />
            </label>
            <label>
              Acceptance criteria
              <textarea
                rows={3}
                value={newTaskChecklist}
                onChange={(event) => setNewTaskChecklist(event.target.value)}
                placeholder="One checklist item per line"
              />
            </label>
            <button type="submit" className="btn-new-task-green modal-submit">
              Save & assign
            </button>
          </form>
        </div>
      )}

      {taskActionModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setTaskActionModal(null);
              setTaskActionNote("");
            }
          }}
        >
          <form
            className="member-modal task-action-modal"
            onSubmit={(event) => {
              event.preventDefault();
              if (taskActionModal === "complete") {
                setTasks((previous) =>
                  previous.map((task) =>
                    task.id === selectedTaskId
                      ? { ...task, status: "Completed" }
                      : task,
                  ),
                );
                setBoardCards((previous) =>
                  previous.map((card) =>
                    card.title === selectedTask?.title
                      ? { ...card, column: "Completed" }
                      : card,
                  ),
                );
                setNotice(
                  `Task completed${taskActionNote.trim() ? `: ${taskActionNote.trim()}` : "."}`,
                );
              } else if (taskActionModal === "reassign") {
                const member = teamMembers.find(
                  (item) => item.id === taskReassignTo,
                );
                if (member && selectedTask) {
                  setTasks((previous) =>
                    previous.map((task) =>
                      task.id === selectedTaskId
                        ? {
                            ...task,
                            assignedBy: member.name,
                            assignedByInitials: member.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase(),
                          }
                        : task,
                    ),
                  );
                  setNotice(`Task reassigned to ${member.name}.`);
                }
              } else {
                setTaskTimerActive(false);
                setTasks((previous) =>
                  previous.map((task) =>
                    task.id === selectedTaskId
                      ? {
                          ...task,
                          timeSpentSeconds: (task.timeSpentSeconds || 0) + 60,
                        }
                      : task,
                  ),
                );
                setTimeLogs((previous) => [
                  {
                    id: `tl-${Date.now()}`,
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    user: userName,
                    userInitials: initials || "AD",
                    activity: "Stopped timer",
                    task: selectedTask?.title || "Task",
                    duration: formatTime(
                      (selectedTask?.timeSpentSeconds || 0) + 60,
                    ),
                    event: "Stopped",
                  },
                  ...previous,
                ]);
                setNotice(
                  `Time entry saved${taskActionNote.trim() ? ` with note: ${taskActionNote.trim()}` : "."}`,
                );
              }
              setTaskActionModal(null);
              setTaskActionNote("");
            }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => {
                setTaskActionModal(null);
                setTaskActionNote("");
              }}
              aria-label="Close"
            >
              ×
            </button>
            <span className="panel-eyebrow">
              {taskActionModal === "complete"
                ? "COMPLETE TASK"
                : taskActionModal === "reassign"
                  ? "REASSIGN TASK"
                  : "SAVE TIME ENTRY"}
            </span>
            <h2>
              {taskActionModal === "complete"
                ? "Complete this task?"
                : taskActionModal === "reassign"
                  ? "Choose a new owner"
                  : "Stop timer & save"}
            </h2>
            <p>
              {taskActionModal === "complete"
                ? "Add an optional completion note to the task audit trail."
                : taskActionModal === "reassign"
                  ? "Select an eligible teammate to own this task."
                  : "Save the tracked time and optionally add a note."}
            </p>
            {taskActionModal === "reassign" ? (
              <label>
                New owner
                <select
                  value={taskReassignTo}
                  onChange={(event) => setTaskReassignTo(event.target.value)}
                  required
                >
                  <option value="">Select teammate</option>
                  {teamMembers.map((member) => (
                    <option value={member.id} key={member.id}>
                      {member.name} · {member.role}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label>
                {taskActionModal === "complete"
                  ? "Completion note (optional)"
                  : "Time entry note (optional)"}
                <textarea
                  rows={4}
                  value={taskActionNote}
                  onChange={(event) => setTaskActionNote(event.target.value)}
                  placeholder={
                    taskActionModal === "complete"
                      ? "Tests passed; PR linked"
                      : "What did you work on?"
                  }
                />
              </label>
            )}
            <button type="submit" className="btn-new-task-green modal-submit">
              {taskActionModal === "complete"
                ? "Mark completed"
                : taskActionModal === "reassign"
                  ? "Reassign task"
                  : "Stop timer & save"}
            </button>
          </form>
        </div>
      )}

      {notice && (
        <div className="toast-message" role="status">
          <span>✓</span> {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {showCreateProjectModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget)
              setShowCreateProjectModal(false);
          }}
        >
          <form
            className="member-modal"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newProjectName.trim()) return;
              const newProjItem: ProjectItem = {
                id: `proj-${Date.now()}`,
                name: newProjectName.trim(),
                team: newProjectTeam.trim() || "Dev Team",
                progress: 0,
                membersExtra: 4,
                memberAvatars: [
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
                ],
                dueDate: "15 Jul 2026",
                status: "In Progress",
              };
              setProjectsList((prev) => [newProjItem, ...prev]);
              setShowCreateProjectModal(false);
              setNotice(
                `Project "${newProjectName}" created and linked to ${newProjectTeam}.`,
              );
              setNewProjectName("");
              setNewProjectDesc("");
            }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowCreateProjectModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="panel-eyebrow">WORKSPACE PROJECTS</span>
            <h2>Create New Project</h2>
            <p>
              Set up a project workspace, assign teams, and configure
              objectives.
            </p>
            <label>
              Project name
              <input
                autoFocus
                type="text"
                required
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                placeholder="e.g. Payments Gateway V2"
              />
            </label>
            <label>
              Assigned team
              <select
                value={newProjectTeam}
                onChange={(event) => setNewProjectTeam(event.target.value)}
              >
                <option value="Alpha Team">
                  Alpha Team (Lead: Alex Johnson)
                </option>
                <option value="Beta Team">Beta Team (Lead: Sara Wilson)</option>
                {customTeams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name} (Lead: {team.lead})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Description (optional)
              <textarea
                rows={3}
                value={newProjectDesc}
                onChange={(event) => setNewProjectDesc(event.target.value)}
                placeholder="Briefly describe scope, targets and deliverables..."
              />
            </label>
            <button type="submit" className="btn-new-task-green modal-submit">
              Create Project
            </button>
          </form>
        </div>
      )}

      {showAddTeamModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget)
              setShowAddTeamModal(false);
          }}
        >
          <form
            className="member-modal"
            onSubmit={(event) => {
              event.preventDefault();
              if (!newTeamName.trim() || !newTeamLead.trim()) return;
              const created = {
                id: `team-${Date.now()}`,
                name: newTeamName.trim(),
                project: newTeamProject.trim() || "Client Portal",
                lead: newTeamLead.trim(),
                membersCount: 4,
              };
              setCustomTeams((previous) => [...previous, created]);
              setShowAddTeamModal(false);
              setNotice(
                `Team "${created.name}" created with lead ${created.lead}.`,
              );
              setNewTeamName("");
              setNewTeamLead("");
            }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowAddTeamModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <span className="panel-eyebrow">TEAM MANAGEMENT</span>
            <h2>Add New Team</h2>
            <p>
              Assemble a team card, connect an active project, and appoint a
              lead.
            </p>
            <label>
              Team name
              <input
                autoFocus
                type="text"
                required
                value={newTeamName}
                onChange={(event) => setNewTeamName(event.target.value)}
                placeholder="e.g. Gamma Team"
              />
            </label>
            <label>
              Active project
              <input
                type="text"
                required
                value={newTeamProject}
                onChange={(event) => setNewTeamProject(event.target.value)}
                placeholder="e.g. Billing Portal"
              />
            </label>
            <label>
              Team lead
              <input
                type="text"
                required
                value={newTeamLead}
                onChange={(event) => setNewTeamLead(event.target.value)}
                placeholder="e.g. Marcus Vance"
              />
            </label>
            <button type="submit" className="btn-new-task-green modal-submit">
              Save Team
            </button>
          </form>
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