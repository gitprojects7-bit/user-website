import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";
import {
  BarChart3,
  Bell,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  MessageCircle,
  MessagesSquare,
  UsersRound,
} from "lucide-react";

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  team: string;
  teamLeader: string;
  teamLeaderAvatar: string;
  members: string[];
  memberAvatars: string[];
  membersExtra?: number;
  progress: number;
  startDate: string;
  dueDate: string;
  status: "In Progress" | "Pending" | "Completed" | "Not Started";
  totalTasks: number;
  completedTasks: number;
};

export type TeamMemberInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  activeTasks: number;
  status: "Active" | "Away" | "Offline";
};

export type TeamData = {
  id: string;
  name: string;
  description: string;
  project: string;
  lead: string;
  leadAvatar: string;
  leadEmail: string;
  members: TeamMemberInfo[];
  totalTasks: number;
  completedTasks: number;
};

export type Task = {
  id: string;
  title: string;
  project: string;
  projectCode: string;
  projectBadgeColor: string;
  assignedTo: string;
  assignedToAvatar: string;
  assignedBy: string;
  created: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: "In progress" | "To do" | "Review" | "Completed";
  description: string;
  acceptanceChecklist: { id: string; text: string; completed: boolean }[];
  timeSpentSeconds: number;
  timerRunning?: boolean;
  completionNotes?: string;
  changesDescription?: string;
  availableForPickup?: boolean;
};

export type BoardCard = {
  id: string;
  title: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  column: "To do" | "In progress" | "Review" | "Completed";
};

export type ChatMessage = {
  id: string;
  sender: string;
  senderInitials: string;
  text: string;
  time: string;
  isSelf?: boolean;
};

export type TimeLogEntry = {
  id: string;
  time: string;
  user: string;
  userInitials: string;
  activity: string;
  task: string;
  duration: string;
  event: "Started" | "Stopped" | "Updated" | "Completed" | "Comment";
};

export type AppNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  type: "task" | "chat" | "mention" | "system";
};

export type PortalRole = "admin" | "lead_employee";
export type LeadWorkspace = "lead" | "employee";
export type WorkspaceRole = "admin" | "lead" | "employee";
type LocalAccount = {
  name: string;
  email: string;
  username: string;
  password: string;
  workspaces: WorkspaceRole[];
};

export type PageName =
  | "Dashboard"
  | "All Projects"
  | "My Projects"
  | "All Tasks"
  | "Team Tasks"
  | "My Tasks"
  | "All Teams"
  | "My Teams"
  | "My Team"
  | "Team Board"
  | "Group Chat"
  | "Direct Chat"
  | "Team Progress"
  | "Notifications"
  | "Profile"
  | "Settings"
  | "Time Tracking"
  | "Reports";

export type AuthStep =
  | "welcome"
  | "signin"
  | "signup-profile"
  | "verify-email"
  | "signup-credentials"
  | "forgot";

export function TeamIcon({ size = 22 }: { size?: number }) {
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

// Initial Data Seed
export const initialProjects: ProjectItem[] = [
  {
    id: "proj-1",
    name: "Billing Platform",
    description: "Enterprise multi-currency billing system with automated tax calculation and Stripe sync.",
    team: "Alpha Engineering",
    teamLeader: "Arun Patel",
    teamLeaderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    members: ["Arun Patel", "Rahul Varma", "Sneha Rao", "Alex Morgan", "Pooja Hegde"],
    memberAvatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    ],
    membersExtra: 1,
    progress: 74,
    startDate: "01 Mar 2026",
    dueDate: "28 May 2026",
    status: "In Progress",
    totalTasks: 16,
    completedTasks: 12,
  },
  {
    id: "proj-2",
    name: "Mobile App",
    description: "Cross-platform iOS and Android app for on-the-go invoice approvals and team communication.",
    team: "Beta Mobile Squad",
    teamLeader: "Priya Sharma",
    teamLeaderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    members: ["Priya Sharma", "Arun Patel", "Vikram Malhotra", "Ananya Sen", "Karan Mehta"],
    memberAvatars: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    ],
    progress: 58,
    startDate: "15 Jan 2026",
    dueDate: "20 May 2026",
    status: "In Progress",
    totalTasks: 14,
    completedTasks: 8,
  },
  {
    id: "proj-3",
    name: "HR Management",
    description: "Internal tool for employee leave tracking, timesheet signoffs, and payroll audit logs.",
    team: "Core HR & Ops",
    teamLeader: "Maya Chen",
    teamLeaderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    members: ["Maya Chen", "Arun Patel", "Daniel Lee", "Sara Wilson"],
    memberAvatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    ],
    progress: 42,
    startDate: "10 Feb 2026",
    dueDate: "10 Jun 2026",
    status: "Pending",
    totalTasks: 10,
    completedTasks: 4,
  },
  {
    id: "proj-4",
    name: "Analytics Dashboard",
    description: "Executive high-level metrics, team velocity forecasts, and real-time revenue breakdowns.",
    team: "Analytics & Design",
    teamLeader: "Arun Patel",
    teamLeaderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    members: ["Arun Patel", "Chloe Bennett", "Marcus Vance"],
    memberAvatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    ],
    progress: 35,
    startDate: "01 Apr 2026",
    dueDate: "15 Jun 2026",
    status: "In Progress",
    totalTasks: 11,
    completedTasks: 4,
  },
];

export const initialTeams: TeamData[] = [
  {
    id: "team-1",
    name: "Alpha Engineering",
    description: "Core backend architectures, microservices, and high-volume billing processing systems.",
    project: "Billing Platform",
    lead: "Arun Patel",
    leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    leadEmail: "arun.patel@workflow.internal",
    members: [
      {
        id: "m-1",
        name: "Rahul Varma",
        email: "rahul.varma@workflow.internal",
        role: "Frontend Engineer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        activeTasks: 3,
        status: "Active",
      },
      {
        id: "m-2",
        name: "Sneha Rao",
        email: "sneha.rao@workflow.internal",
        role: "Backend Architect",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        activeTasks: 2,
        status: "Active",
      },
      {
        id: "m-3",
        name: "Alex Morgan",
        email: "alex.morgan@workflow.internal",
        role: "QA Automation",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        activeTasks: 2,
        status: "Active",
      },
      {
        id: "m-4",
        name: "Pooja Hegde",
        email: "pooja.hegde@workflow.internal",
        role: "UI/UX Designer",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        activeTasks: 1,
        status: "Away",
      },
    ],
    totalTasks: 16,
    completedTasks: 12,
  },
  {
    id: "team-2",
    name: "Beta Mobile Squad",
    description: "Native and React Native mobile clients providing client access on smartphones.",
    project: "Mobile App",
    lead: "Priya Sharma",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    leadEmail: "priya.sharma@workflow.internal",
    members: [
      {
        id: "m-5",
        name: "Vikram Malhotra",
        email: "vikram.m@workflow.internal",
        role: "React Native Lead",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        activeTasks: 4,
        status: "Active",
      },
      {
        id: "m-6",
        name: "Ananya Sen",
        email: "ananya.sen@workflow.internal",
        role: "iOS Specialist",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        activeTasks: 2,
        status: "Active",
      },
      {
        id: "m-7",
        name: "Karan Mehta",
        email: "karan.mehta@workflow.internal",
        role: "Android Engineer",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        activeTasks: 3,
        status: "Active",
      },
    ],
    totalTasks: 14,
    completedTasks: 8,
  },
  {
    id: "team-3",
    name: "Core HR & Ops",
    description: "Internal operations, team onboarding workflows, compliance tracking, and benefits administration.",
    project: "HR Management",
    lead: "Maya Chen",
    leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    leadEmail: "maya.chen@workflow.internal",
    members: [
      {
        id: "m-8",
        name: "Daniel Lee",
        email: "daniel.lee@workflow.internal",
        role: "Operations Specialist",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        activeTasks: 2,
        status: "Active",
      },
      {
        id: "m-9",
        name: "Sara Wilson",
        email: "sara.wilson@workflow.internal",
        role: "People Partner",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        activeTasks: 2,
        status: "Active",
      },
    ],
    totalTasks: 10,
    completedTasks: 4,
  },
  {
    id: "team-4",
    name: "Analytics & Design",
    description: "Business intelligence pipelines, product telemetry dashboards, and high-impact visual systems.",
    project: "Analytics Dashboard",
    lead: "Arun Patel",
    leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    leadEmail: "arun.patel@workflow.internal",
    members: [
      {
        id: "m-10",
        name: "Chloe Bennett",
        email: "chloe.b@workflow.internal",
        role: "Data Analyst",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        activeTasks: 3,
        status: "Active",
      },
      {
        id: "m-11",
        name: "Marcus Vance",
        email: "marcus.v@workflow.internal",
        role: "BI Engineer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        activeTasks: 2,
        status: "Active",
      },
    ],
    totalTasks: 11,
    completedTasks: 4,
  },
];

export const initialTasks: Task[] = [
  {
    id: "TASK-1042",
    title: "Implement invoice export endpoint",
    project: "Billing Platform",
    projectCode: "B",
    projectBadgeColor: "#d8f3ec",
    assignedTo: "Rahul Varma",
    assignedToAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    assignedBy: "Arun Patel",
    created: "23 Oct 2026",
    due: "30 Oct 2026",
    priority: "High",
    status: "In progress",
    description: "Create a secure endpoint to export invoice line items to Excel. Include invoice metadata, tax breakdown, and client currency conversion.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Correct invoice totals and financial year parameters", completed: true },
      { id: "chk-2", text: "GST totals match invoice client preview", completed: false },
      { id: "chk-3", text: "Download works seamlessly on Safari and Chrome", completed: false },
    ],
    timeSpentSeconds: 42 * 60 + 18,
    completionNotes: "",
    changesDescription: "",
  },
  {
    id: "TASK-1043",
    title: "Configure multi-currency billing",
    project: "Billing Platform",
    projectCode: "B",
    projectBadgeColor: "#d8f3ec",
    assignedTo: "Sneha Rao",
    assignedToAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    assignedBy: "Arun Patel",
    created: "24 Oct 2026",
    due: "Tomorrow",
    priority: "High",
    status: "In progress",
    description: "Support EUR, GBP, USD, and INR with daily European Central Bank exchange rate caching.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Exchange rate caching TTL set to 12 hours", completed: true },
      { id: "chk-2", text: "Fallback mechanism on currency API failure", completed: true },
    ],
    timeSpentSeconds: 38 * 60 + 40,
  },
  {
    id: "TASK-1044",
    title: "Prepare sprint review milestone notes",
    project: "Billing Platform",
    projectCode: "B",
    projectBadgeColor: "#d8f3ec",
    assignedTo: "Rahul Varma",
    assignedToAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    assignedBy: "Arun Patel",
    created: "26 Oct 2026",
    due: "02 Nov 2026",
    priority: "Medium",
    status: "To do",
    description: "Aggregate completed deliverables, milestone charts, and blocker retrospectives for team leads.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Collect QA defect report summary", completed: false },
      { id: "chk-2", text: "Draft slide presentation deck", completed: false },
    ],
    timeSpentSeconds: 15 * 60,
  },
  {
    id: "TASK-1045",
    title: "Mobile push notification triggers",
    project: "Mobile App",
    projectCode: "M",
    projectBadgeColor: "#e0f2fe",
    assignedTo: "Arun Patel",
    assignedToAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    assignedBy: "Priya Sharma",
    created: "25 Oct 2026",
    due: "05 Nov 2026",
    priority: "High",
    status: "In progress",
    description: "Implement Firebase Cloud Messaging (FCM) handlers for real-time task assignment alerts.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Foreground and background payload handling", completed: true },
      { id: "chk-2", text: "iOS APNs certificate verification in staging", completed: false },
    ],
    timeSpentSeconds: 55 * 60,
  },
  {
    id: "TASK-1046",
    title: "Employee onboarding checklist wizard",
    project: "HR Management",
    projectCode: "H",
    projectBadgeColor: "#fef3c7",
    assignedTo: "Arun Patel",
    assignedToAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    assignedBy: "Maya Chen",
    created: "27 Oct 2026",
    due: "08 Nov 2026",
    priority: "Medium",
    status: "Review",
    description: "Step-by-step document submission and verification system for newly invited engineers.",
    acceptanceChecklist: [
      { id: "chk-1", text: "PDF identity upload with virus scanning", completed: true },
      { id: "chk-2", text: "Automated welcome email trigger", completed: true },
    ],
    timeSpentSeconds: 80 * 60,
  },
  {
    id: "TASK-1048",
    title: "Prepare employee onboarding FAQ",
    project: "HR Management",
    projectCode: "H",
    projectBadgeColor: "#fef3c7",
    assignedTo: "Available",
    assignedToAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    assignedBy: "Maya Chen",
    created: "Today",
    due: "12 Nov 2026",
    priority: "Low",
    status: "To do",
    description: "Document the common onboarding questions and answers for new team members.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Collect questions from the HR team", completed: false },
      { id: "chk-2", text: "Review and publish the FAQ", completed: false },
    ],
    timeSpentSeconds: 0,
    availableForPickup: true,
  },
  {
    id: "TASK-1047",
    title: "Executive ARR cohort chart component",
    project: "Analytics Dashboard",
    projectCode: "A",
    projectBadgeColor: "#f3e8ff",
    assignedTo: "Chloe Bennett",
    assignedToAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    assignedBy: "Arun Patel",
    created: "28 Oct 2026",
    due: "12 Nov 2026",
    priority: "Low",
    status: "To do",
    description: "SVG visualization for monthly recurring revenue cohorts and churn risk modeling.",
    acceptanceChecklist: [
      { id: "chk-1", text: "Responsive SVG chart with tooltips", completed: false },
    ],
    timeSpentSeconds: 10 * 60,
  },
];

export const initialBoardCards: BoardCard[] = [
  {
    id: "TASK-1044",
    title: "Prepare sprint review milestone notes",
    project: "Billing Platform",
    assignee: "Rahul Varma",
    assigneeInitials: "RV",
    due: "02 Nov",
    priority: "Medium",
    column: "To do",
  },
  {
    id: "TASK-1047",
    title: "Executive ARR cohort chart component",
    project: "Analytics Dashboard",
    assignee: "Chloe Bennett",
    assigneeInitials: "CB",
    due: "12 Nov",
    priority: "Low",
    column: "To do",
  },
  {
    id: "TASK-1042",
    title: "Implement invoice export endpoint",
    project: "Billing Platform",
    assignee: "Rahul Varma",
    assigneeInitials: "RV",
    due: "30 Oct",
    priority: "High",
    column: "In progress",
  },
  {
    id: "TASK-1043",
    title: "Configure multi-currency billing",
    project: "Billing Platform",
    assignee: "Sneha Rao",
    assigneeInitials: "SR",
    due: "Tomorrow",
    priority: "High",
    column: "In progress",
  },
  {
    id: "TASK-1045",
    title: "Mobile push notification triggers",
    project: "Mobile App",
    assignee: "Vikram Malhotra",
    assigneeInitials: "VM",
    due: "05 Nov",
    priority: "High",
    column: "In progress",
  },
  {
    id: "TASK-1046",
    title: "Employee onboarding checklist wizard",
    project: "HR Management",
    assignee: "Daniel Lee",
    assigneeInitials: "DL",
    due: "08 Nov",
    priority: "Medium",
    column: "Review",
  },
  {
    id: "TASK-1039",
    title: "OAuth2 Google login integration",
    project: "Billing Platform",
    assignee: "Alex Morgan",
    assigneeInitials: "AM",
    due: "20 Oct",
    priority: "High",
    column: "Completed",
  },
  {
    id: "TASK-1040",
    title: "Optimize database connection pooling",
    project: "Billing Platform",
    assignee: "Sneha Rao",
    assigneeInitials: "SR",
    due: "22 Oct",
    priority: "Medium",
    column: "Completed",
  },
];

export const initialChatMessages: Record<string, ChatMessage[]> = {
  "alpha-engineering": [
    {
      id: "cm-1",
      sender: "Arun Patel",
      senderInitials: "AP",
      text: "Morning team! Let's lock in the invoice export endpoint today before sprint review.",
      time: "09:15 AM",
    },
    {
      id: "cm-2",
      sender: "Rahul Varma",
      senderInitials: "RV",
      text: "Working on the Excel line items formatting right now. GST calculations match the specs.",
      time: "09:22 AM",
    },
    {
      id: "cm-3",
      sender: "Sneha Rao",
      senderInitials: "SR",
      text: "Currency cache is ready on staging. The fallback API behaves smoothly under test load.",
      time: "09:40 AM",
    },
  ],
  "beta-mobile": [
    {
      id: "cm-4",
      sender: "Priya Sharma",
      senderInitials: "PS",
      text: "Hey mobile crew! Test builds are deployed on TestFlight and Google Play Internal track.",
      time: "10:05 AM",
    },
    {
      id: "cm-5",
      sender: "Vikram Malhotra",
      senderInitials: "VM",
      text: "Tested push notifications on iOS 18 and Android 15. Real-time delivery looks solid.",
      time: "10:18 AM",
    },
  ],
  "billing-platform": [
    {
      id: "cm-6",
      sender: "Admin Director",
      senderInitials: "AD",
      text: "Billing platform audit passed security compliance checks today. Great job everyone!",
      time: "11:00 AM",
    },
  ],
  "design-sync": [
    {
      id: "cm-7",
      sender: "Pooja Hegde",
      senderInitials: "PH",
      text: "Updated the dark & emerald design system tokens in Figma. Ready for review.",
      time: "11:30 AM",
    },
  ],
};

export const initialDirectMessages: Record<string, ChatMessage[]> = {
  "arun-patel": [
    {
      id: "dm-1",
      sender: "Arun Patel",
      senderInitials: "AP",
      text: "Hi Rahul, how's the invoice export endpoint coming along? Need any help with the currency matrix?",
      time: "09:30 AM",
    },
    {
      id: "dm-2",
      sender: "Rahul Varma",
      senderInitials: "RV",
      text: "Hey Arun! It's almost wrapped up. I'm verifying the acceptance checklist items now.",
      time: "09:45 AM",
      isSelf: true,
    },
  ],
  "priya-sharma": [
    {
      id: "dm-3",
      sender: "Priya Sharma",
      senderInitials: "PS",
      text: "Could you check if the billing API responses match our mobile JSON schema?",
      time: "10:12 AM",
    },
  ],
  "sneha-rao": [
    {
      id: "dm-4",
      sender: "Sneha Rao",
      senderInitials: "SR",
      text: "I just pushed the currency conversion test mocks to our branch.",
      time: "10:45 AM",
    },
  ],
};

export const initialTimeLogs: TimeLogEntry[] = [
  {
    id: "tl-1",
    time: "Today, 11:20 AM",
    user: "Rahul Varma",
    userInitials: "RV",
    activity: "Coding & Unit Tests",
    task: "TASK-1042: Implement invoice export endpoint",
    duration: "1h 45m",
    event: "Started",
  },
  {
    id: "tl-2",
    time: "Today, 10:15 AM",
    user: "Sneha Rao",
    userInitials: "SR",
    activity: "API Integration",
    task: "TASK-1043: Configure multi-currency billing",
    duration: "2h 30m",
    event: "Completed",
  },
  {
    id: "tl-3",
    time: "Today, 09:30 AM",
    user: "Arun Patel",
    userInitials: "AP",
    activity: "Sprint Planning",
    task: "TASK-1044: Prepare sprint review milestone notes",
    duration: "45m",
    event: "Updated",
  },
  {
    id: "tl-4",
    time: "Yesterday, 04:15 PM",
    user: "Vikram Malhotra",
    userInitials: "VM",
    activity: "FCM Push Testing",
    task: "TASK-1045: Mobile push notification triggers",
    duration: "3h 10m",
    event: "Started",
  },
  {
    id: "tl-5",
    time: "Yesterday, 02:00 PM",
    user: "Alex Morgan",
    userInitials: "AM",
    activity: "Security Testing",
    task: "TASK-1039: OAuth2 Google login integration",
    duration: "1h 15m",
    event: "Completed",
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: "notif-1",
    title: "New Task Assigned",
    detail: "Arun Patel assigned you 'TASK-1042: Implement invoice export endpoint'.",
    time: "10 min ago",
    unread: true,
    type: "task",
  },
  {
    id: "notif-2",
    title: "Milestone Completed",
    detail: "Billing Platform reached 74% progress milestone.",
    time: "45 min ago",
    unread: true,
    type: "system",
  },
  {
    id: "notif-3",
    title: "New Team Announcement",
    detail: "Sprint 14 code freeze scheduled for Friday 5:00 PM.",
    time: "2 hours ago",
    unread: false,
    type: "chat",
  },
  {
    id: "notif-4",
    title: "Mention in Alpha Engineering",
    detail: "Sneha Rao mentioned you in currency caching thread.",
    time: "Yesterday",
    unread: false,
    type: "mention",
  },
];


export default function App() {
  // Auth & Session States
  const [authStep, setAuthStep] = useState<AuthStep>("welcome");
  const [portalRole, setPortalRole] = useState<PortalRole>("admin");
  const [leadWorkspace, setLeadWorkspace] = useState<LeadWorkspace>("lead");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [availableWorkspaces, setAvailableWorkspaces] = useState<WorkspaceRole[]>(["admin"]);
  const [selectedSignupWorkspaces, setSelectedSignupWorkspaces] = useState<WorkspaceRole[]>([]);
  const [signupUsername, setSignupUsername] = useState("");
  const [registeredAccount, setRegisteredAccount] = useState<LocalAccount | null>(null);
  const [signedInAccount, setSignedInAccount] = useState<LocalAccount | null>(null);

  // Form Inputs for Auth
  const [loginId, setLoginId] = useState("abc@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  // Navigation & Search
  const [activePage, setActivePage] = useState<PageName>("Dashboard");
  const [profileOpen, setProfileOpen] = useState(false);

  // Visual Atmosphere
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  // Core Data States
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);
  const [teamsList, setTeamsList] = useState<TeamData[]>(initialTeams);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [boardCards] = useState<BoardCard[]>(initialBoardCards);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>(initialDirectMessages);
  const [timeLogs] = useState<TimeLogEntry[]>(initialTimeLogs);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Active Chats
  const [activeChannelId, setActiveChannelId] = useState<string>("alpha-engineering");
  const [chatInputText, setChatInputText] = useState<string>("");
  const [chatAttachmentMenuOpen, setChatAttachmentMenuOpen] = useState(false);
  const [chatPendingAttachment, setChatPendingAttachment] = useState("");
  const [activeDmContactId, setActiveDmContactId] = useState<string>("arun-patel");
  const [dmInputText, setDmInputText] = useState<string>("");
  const [dmAttachmentMenuOpen, setDmAttachmentMenuOpen] = useState(false);
  const [dmPendingAttachment, setDmPendingAttachment] = useState("");

  // Modals & Drawers
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState<boolean>(false);
  const [assignTaskProjectId, setAssignTaskProjectId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Filter States
  const [projectSearch, setProjectSearch] = useState<string>("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>("all");
  const [projectMemberSearch, setProjectMemberSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState<string>("");
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<string>("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");
  const [teamSearch, setTeamSearch] = useState<string>("");

  // Create Project Form State
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjTeam, setNewProjTeam] = useState("Alpha Engineering");
  const [newProjLead, setNewProjLead] = useState("Arun Patel");
  const [newProjMembers, setNewProjMembers] = useState<string[]>([
    "Arun Patel",
    "Rahul Varma",
    "Sneha Rao",
  ]);
  const [newProjDueDate, setNewProjDueDate] = useState("2026-06-30");
  const [newProjStatus, setNewProjStatus] = useState<ProjectItem["status"]>("In Progress");

  // Assign Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("Billing Platform");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Rahul Varma");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("Medium");
  const [newTaskDue, setNewTaskDue] = useState("2026-11-15");

  // Employee Timer System (persistent ticking)
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!runningTaskId) return;
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === runningTaskId
            ? { ...t, timeSpentSeconds: (t.timeSpentSeconds || 0) + 1 }
            : t
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [runningTaskId]);

  // Atmosphere Cursor effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Format Seconds to HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const activeWorkspace: WorkspaceRole =
    portalRole === "admin" ? "admin" : leadWorkspace;
  const isManager = activeWorkspace === "admin";
  const isTeamLead = activeWorkspace === "lead";
  const isEmployee = activeWorkspace === "employee";

  // Determine current user profile based on portal and workspace
  const currentUser = useMemo(() => {
    if (activeWorkspace === "admin") {
      return {
        name: signedInAccount?.name || "Arun Patel",
        email: signedInAccount?.email || "abc@gmail.com",
        role: "Manager",
        initials: (signedInAccount?.name || "Arun Patel")
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      };
    }
    if (activeWorkspace === "lead") {
      return {
        name: signedInAccount?.name || "Arun Patel",
        email: signedInAccount?.email || "abc@gmail.com",
        role: "Team Lead",
        initials: (signedInAccount?.name || "Arun Patel")
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      };
    }
    return {
      name: signedInAccount?.name || "Arun Patel",
      email: signedInAccount?.email || "abc@gmail.com",
      role: "Employee",
      initials: (signedInAccount?.name || "Arun Patel")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    };
  }, [activeWorkspace, signedInAccount]);

  const currentMenuItems = useMemo(() => {
    const projectPage: PageName = isManager ? "All Projects" : "My Projects";
    const teamsPage: PageName = isManager ? "All Teams" : isTeamLead ? "My Teams" : "My Team";
    const tasksPage: PageName = isManager ? "All Tasks" : isTeamLead ? "Team Tasks" : "My Tasks";
    if (isManager) {
      return [
        { label: "Overview", icon: <LayoutDashboard size={18} />, destination: "Dashboard" as PageName },
        { label: "Project", icon: <FolderKanban size={18} />, destination: projectPage },
        { label: "Team", icon: <UsersRound size={18} />, destination: teamsPage },
        { label: "Task", icon: <ListTodo size={18} />, destination: tasksPage },
        { label: "Team Board", icon: <BarChart3 size={18} />, destination: "Team Board" as PageName },
        { label: "Team Chat", icon: <MessagesSquare size={18} />, destination: "Group Chat" as PageName },
        { label: "Direct Message", icon: <MessageCircle size={18} />, destination: "Direct Chat" as PageName },
        { label: "Notification", icon: <Bell size={18} />, destination: "Notifications" as PageName },
      ];
    }
    if (isTeamLead) {
      return [
        { label: "Overview", icon: <LayoutDashboard size={18} />, destination: "Dashboard" as PageName },
        { label: "Projects", icon: <FolderKanban size={18} />, destination: projectPage },
        { label: "Teams", icon: <UsersRound size={18} />, destination: teamsPage },
        { label: "Tasks", icon: <ListTodo size={18} />, destination: tasksPage },
        { label: "Team Chat", icon: <MessagesSquare size={18} />, destination: "Group Chat" as PageName },
        { label: "Direct Message", icon: <MessageCircle size={18} />, destination: "Direct Chat" as PageName },
        { label: "Notifications", icon: <Bell size={18} />, destination: "Notifications" as PageName },
      ];
    }
    return [
      { label: "Overview", icon: <LayoutDashboard size={18} />, destination: "Dashboard" as PageName },
      { label: "My Tasks", icon: <ListTodo size={18} />, destination: tasksPage },
      { label: "Team Board", icon: <BarChart3 size={18} />, destination: "Team Board" as PageName },
      { label: "Team Chat", icon: <MessagesSquare size={18} />, destination: "Group Chat" as PageName },
      { label: "Direct Message", icon: <MessageCircle size={18} />, destination: "Direct Chat" as PageName },
      { label: "Notification", icon: <Bell size={18} />, destination: "Notifications" as PageName },
    ];
  }, [isManager, isTeamLead]);

  // Filtered Projects based on Role / Workspace
  const visibleProjects = useMemo(() => {
    let list = projectsList;
    if (portalRole === "lead_employee") {
      if (leadWorkspace === "lead") {
        // Team Lead sees only projects where they are assigned as Team Lead
        // Lead sees ONLY projects the admin assigned to them as Team Lead
        list = list.filter((p) => p.teamLeader === currentUser.name);
      } else {
        // Employees see projects assigned through membership or their task assignments.
        const memberProjects = new Set(
          [
            ...tasks
              .filter((task) => task.assignedTo === currentUser.name)
              .map((task) => task.project),
            ...teamsList
              .filter((team) => team.members.some((member) => member.name === currentUser.name))
              .map((team) => team.project),
          ]
        );
        list = list.filter((project) => memberProjects.has(project.name) || project.members.includes(currentUser.name));
      }
    }
    if (projectSearch.trim()) {
      const q = projectSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.teamLeader.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (projectStatusFilter !== "all") {
      list = list.filter((p) => p.status === projectStatusFilter);
    }
    return list;
  }, [projectsList, teamsList, tasks, portalRole, leadWorkspace, currentUser.name, projectSearch, projectStatusFilter]);

  // Filtered Teams based on Role / Workspace
  const visibleTeams = useMemo(() => {
    let list = teamsList;
    if (portalRole === "lead_employee") {
      if (leadWorkspace === "lead") {
        // Lead sees only teams they manage
        const ledProjects = new Set(projectsList.filter((p) => p.teamLeader === currentUser.name).map((p) => p.name));
        list = list.filter((t) => t.lead === currentUser.name || ledProjects.has(t.project));
      } else {
        const memberProjects = new Set(
          [
            ...tasks
              .filter((task) => task.assignedTo === currentUser.name)
              .map((task) => task.project),
            ...teamsList
              .filter((team) => team.members.some((member) => member.name === currentUser.name))
              .map((team) => team.project),
          ]
        );
        list = list.filter(
          (team) =>
            memberProjects.has(team.project) ||
            team.members.some((member) => member.name === currentUser.name)
        );
      }
    }
    if (teamSearch.trim()) {
      const q = teamSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q) ||
          t.lead.toLowerCase().includes(q)
      );
    }
    return list;
  }, [teamsList, projectsList, tasks, portalRole, leadWorkspace, currentUser.name, teamSearch]);

  // Filtered Tasks based on Role / Workspace
  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (portalRole === "lead_employee") {
      if (leadWorkspace === "lead") {
        // Team tasks in Arun's projects or assigned by Arun
        // Only tasks inside projects the admin assigned to this lead
        const ledProjects = new Set(projectsList.filter((p) => p.teamLeader === currentUser.name).map((p) => p.name));
        list = list.filter((t) => ledProjects.has(t.project));
      } else {
        // As a team member: tasks assigned directly to them
        list = list.filter(
          (task) =>
            task.assignedTo === currentUser.name ||
            (task.availableForPickup && visibleProjects.some((project) => project.name === task.project))
        );
      }
    }
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q) ||
          t.assignedTo.toLowerCase().includes(q)
      );
    }
    if (taskPriorityFilter !== "all") {
      list = list.filter((t) => t.priority === taskPriorityFilter);
    }
    if (taskStatusFilter !== "all") {
      list = list.filter((t) => t.status === taskStatusFilter);
    }
    return list;
  }, [tasks, projectsList, teamsList, visibleProjects, portalRole, leadWorkspace, currentUser.name, taskSearch, taskPriorityFilter, taskStatusFilter]);

  const canAccessPage = (page: PageName) => {
    if (isManager) return true;
    if (isTeamLead) {
      return !["All Projects", "All Tasks", "All Teams", "My Team"].includes(page);
    }
    return [
      "Dashboard",
      "My Projects",
      "My Team",
      "My Tasks",
      "Group Chat",
      "Direct Chat",
      "Notifications",
      "Profile",
      "Settings",
      "Time Tracking",
      "Reports",
    ].includes(page);
  };

  const canManageTask = (task: Task) =>
    isManager ||
    (isTeamLead && visibleProjects.some((project) => project.name === task.project)) ||
    (isEmployee && task.assignedTo === currentUser.name);

  const workspaceLabel = (workspace: WorkspaceRole) =>
    workspace === "admin" ? "Manager" : workspace === "lead" ? "Team Lead" : "Employee";

  const switchWorkspace = (workspace: WorkspaceRole) => {
    if (!availableWorkspaces.includes(workspace)) return;
    setPortalRole(workspace === "admin" ? "admin" : "lead_employee");
    if (workspace !== "admin") setLeadWorkspace(workspace);
    setActivePage("Dashboard");
    setProfileOpen(false);
    setRunningTaskId(null);
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    setSelectedTeamId(null);
    setShowCreateProjectModal(false);
    setShowAssignTaskModal(false);
    setNotice(`Switched to ${workspaceLabel(workspace)} workspace.`);
  };

  // Navigation Helper
  const navigateTo = (page: PageName) => {
    if (!canAccessPage(page)) {
      setNotice("You do not have permission to access that page.");
      return;
    }
    if (page === activePage) return;
    setSelectedProjectId(null);
    setSelectedTeamId(null);
    setAssignTaskProjectId(null);
    setShowAssignTaskModal(false);
    setSelectedTaskId(null);
    setActivePage(page);
    setProfileOpen(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthStep("signin");
    setPortalRole("admin");
    setLeadWorkspace("lead");
    setAvailableWorkspaces(["admin", "lead", "employee"]);
    setLoginId("abc@gmail.com");
    setPassword("123456");
    setSignedInAccount(null);
    setActivePage("Dashboard");
    setNotice("");
    setRunningTaskId(null);
  };

  // Sign In Handler
  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password) {
      setNotice("Enter your email or username and password.");
      return;
    }
    if (
      loginId.trim().toLowerCase() === "abc@gmail.com" &&
      password === "123456"
    ) {
      const demoAccount: LocalAccount = {
        name: "Arun Patel",
        email: "abc@gmail.com",
        username: "abc",
        password: "123456",
        workspaces: ["admin", "lead", "employee"],
      };
      setSignedInAccount(demoAccount);
      setAvailableWorkspaces(demoAccount.workspaces);
      setPortalRole("admin");
      setLeadWorkspace("lead");
      setIsLoggedIn(true);
      setActivePage("Dashboard");
      setNotice("");
      return;
    }
    const signingInAsRegisteredAccount =
      registeredAccount &&
      [registeredAccount.email, registeredAccount.username].some(
        (identifier) => identifier.toLowerCase() === loginId.trim().toLowerCase()
      );
    if (signingInAsRegisteredAccount) {
      if (password !== registeredAccount.password) {
        setNotice("The password is incorrect.");
        return;
      }
      setSignedInAccount(registeredAccount);
      setAvailableWorkspaces(registeredAccount.workspaces);
      const firstWorkspace = registeredAccount.workspaces[0] ?? "admin";
      setPortalRole(firstWorkspace === "admin" ? "admin" : "lead_employee");
      if (firstWorkspace !== "admin") setLeadWorkspace(firstWorkspace);
    } else {
      setNotice("Those credentials are not recognized. Use abc@gmail.com / 123456 for the demo.");
      return;
    }
    setIsLoggedIn(true);
    setActivePage("Dashboard");
    setNotice("");
  };

  // Toggle Timer on a Task
  const toggleTaskTimer = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.assignedTo !== currentUser.name) {
      setNotice("You can only track time on your own assigned tasks.");
      return;
    }
    if (runningTaskId === taskId) {
      setRunningTaskId(null);
      setNotice(`Timer paused for ${taskId}.`);
    } else {
      setRunningTaskId(taskId);
      setNotice(`Timer running on ${taskId}.`);
    }
  };

  const takeAvailableTask = (taskId: string) => {
    if (!isEmployee) return;
    const task = tasks.find((item) => item.id === taskId);
    if (!task?.availableForPickup || !visibleProjects.some((project) => project.name === task.project)) {
      setNotice("This task is not available in your assigned projects.");
      return;
    }
    setTasks((previous) =>
      previous.map((item) =>
        item.id === taskId
          ? {
              ...item,
              assignedTo: currentUser.name,
              assignedToAvatar: currentUser.avatar,
              availableForPickup: false,
            }
          : item
      )
    );
    setNotice(`You are now assigned to "${task.title}".`);
  };

  // Create Project Form Submit
  const handleCreateProject = (e: FormEvent) => {
    e.preventDefault();
    if (!isManager) {
      setNotice("Only Managers can create projects.");
      return;
    }
    if (!newProjName.trim()) {
      setNotice("Please provide a project name.");
      return;
    }
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      description: newProjDesc.trim() || "Active project in sprint cycle.",
      team: newProjTeam,
      teamLeader: newProjLead,
      teamLeaderAvatar:
        newProjLead.toLowerCase().includes("arun")
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      members: newProjMembers.length > 0 ? newProjMembers : [newProjLead],
      memberAvatars: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      ],
      progress: 10,
      startDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      dueDate: newProjDueDate || "2026-07-31",
      status: newProjStatus,
      totalTasks: 4,
      completedTasks: 0,
    };
    setProjectsList((prev) => [newProj, ...prev]);
    setShowCreateProjectModal(false);
    setNewProjName("");
    setNewProjDesc("");
    setNotice(`Project "${newProj.name}" created successfully.`);
  };

  // Assign Task Form Submit
  const handleAssignTask = (e: FormEvent) => {
    e.preventDefault();
    if (!isManager && !isTeamLead) {
      setNotice("Employees cannot assign tasks.");
      return;
    }
    if (!newTaskTitle.trim()) {
      setNotice("Please provide a task title.");
      return;
    }
    if (
      isTeamLead &&
      !visibleProjects.some((project) => project.name === newTaskProject)
    ) {
      setNotice("Team Leads can only assign tasks within their assigned projects.");
      return;
    }
    if (
      isTeamLead &&
      !teamsList
        .find((team) => team.project === newTaskProject)
        ?.members.some((member) => member.name === newTaskAssignee)
    ) {
      setNotice("Team Leads can only assign tasks to members of their assigned team.");
      return;
    }
    const createdTask: Task = {
      id: `TASK-${Math.floor(1050 + Math.random() * 900)}`,
      title: newTaskTitle.trim(),
      project: newTaskProject,
      projectCode: newTaskProject.charAt(0).toUpperCase(),
      projectBadgeColor: "#d8f3ec",
      assignedTo: newTaskAssignee,
      assignedToAvatar:
        newTaskAssignee.toLowerCase().includes("rahul")
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      assignedBy: currentUser.name,
      created: "Today",
      due: newTaskDue,
      priority: newTaskPriority,
      status: "To do",
      description: newTaskDesc.trim() || "Assigned task deliverable.",
      acceptanceChecklist: [
        { id: "c-1", text: "Code implementation & PR linked", completed: false },
        { id: "c-2", text: "Quality assurance sign-off", completed: false },
      ],
      timeSpentSeconds: 0,
    };
    setTasks((prev) => [createdTask, ...prev]);
    setShowAssignTaskModal(false);
    setAssignTaskProjectId(null);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNotice(`Task ${createdTask.id} assigned to ${newTaskAssignee}.`);
  };

  const createTeam = () => {
    if (!isManager) {
      setNotice("Only Managers can create teams.");
      return;
    }
    const name = window.prompt("Enter the team name:");
    if (!name?.trim()) return;
    const defaultProject = projectsList[0]?.name || "";
    const projectName = window.prompt(
      `Enter the project name for this team:\n${projectsList.map((project) => project.name).join(", ")}`,
      defaultProject
    );
    const project = projectsList.find(
      (item) => item.name.toLowerCase() === projectName?.trim().toLowerCase()
    );
    if (!project) {
      setNotice("Choose an existing project for the new team.");
      return;
    }
    const lead = window.prompt("Assign a Team Lead:", project.teamLeader)?.trim();
    if (!lead) return;
    const newTeam: TeamData = {
      id: `team-${Date.now()}`,
      name: name.trim(),
      description: `Team for ${project.name}.`,
      project: project.name,
      lead,
      leadAvatar: project.teamLeaderAvatar,
      leadEmail: `${lead.toLowerCase().replace(/\s+/g, ".")}@workflow.internal`,
      members: [],
      totalTasks: 0,
      completedTasks: 0,
    };
    setTeamsList((previous) => [newTeam, ...previous]);
    setProjectsList((previous) =>
      previous.map((item) =>
        item.id === project.id ? { ...item, team: newTeam.name, teamLeader: lead } : item
      )
    );
    setNotice(`Team "${newTeam.name}" created for ${project.name}.`);
  };

  const addTeamMember = (team: TeamData) => {
    if (!isManager) return;
    const name = window.prompt(`Add a member to ${team.name}:`)?.trim();
    if (!name) return;
    const email = window.prompt("Member email address:")?.trim();
    if (!email) return;
    const role = window.prompt("Member job title:", "Employee")?.trim() || "Employee";
    const member: TeamMemberInfo = {
      id: `member-${Date.now()}`,
      name,
      email,
      role,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      activeTasks: 0,
      status: "Active",
    };
    setTeamsList((previous) =>
      previous.map((item) =>
        item.id === team.id ? { ...item, members: [...item.members, member] } : item
      )
    );
    setProjectsList((previous) =>
      previous.map((item) =>
        item.name === team.project && !item.members.includes(name)
          ? { ...item, members: [...item.members, name] }
          : item
      )
    );
    setNotice(`${name} added to ${team.name}.`);
  };

  const removeTeamMember = (team: TeamData, member: TeamMemberInfo) => {
    if (!isManager || !window.confirm(`Remove ${member.name} from ${team.name}?`)) return;
    setTeamsList((previous) =>
      previous.map((item) =>
        item.id === team.id
          ? { ...item, members: item.members.filter((candidate) => candidate.id !== member.id) }
          : item
      )
    );
    setProjectsList((previous) =>
      previous.map((item) =>
        item.name === team.project
          ? { ...item, members: item.members.filter((name) => name !== member.name) }
          : item
      )
    );
    setNotice(`${member.name} removed from ${team.name}.`);
  };

  const changeTeamLead = (team: TeamData) => {
    if (!isManager) return;
    const lead = window.prompt("Assign a Team Lead:", team.lead)?.trim();
    if (!lead || lead === team.lead) return;
    const leadEmail = `${lead.toLowerCase().replace(/\s+/g, ".")}@workflow.internal`;
    setTeamsList((previous) =>
      previous.map((item) =>
        item.id === team.id
          ? { ...item, lead, leadEmail }
          : item
      )
    );
    setProjectsList((previous) =>
      previous.map((item) =>
        item.name === team.project ? { ...item, teamLeader: lead } : item
      )
    );
    setNotice(`${team.name} is now led by ${lead}.`);
  };

  // Send Group Chat Message
  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() && !chatPendingAttachment) return;
    const msg: ChatMessage = {
      id: `cm-${Date.now()}`,
      sender: currentUser.name,
      senderInitials: currentUser.initials,
      text: chatPendingAttachment ? `${chatInputText.trim()}${chatInputText.trim() ? "  " : ""}${chatPendingAttachment}` : chatInputText.trim(),
      time: "Just now",
      isSelf: true,
    };
    setChatMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), msg],
    }));
    setChatInputText("");
    setChatPendingAttachment("");
    setChatAttachmentMenuOpen(false);
  };

  // Send Direct Message
  const handleSendDirectMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!dmInputText.trim() && !dmPendingAttachment) return;
    const msg: ChatMessage = {
      id: `dm-${Date.now()}`,
      sender: currentUser.name,
      senderInitials: currentUser.initials,
      text: dmPendingAttachment ? `${dmInputText.trim()}${dmInputText.trim() ? "  " : ""}${dmPendingAttachment}` : dmInputText.trim(),
      time: "Just now",
      isSelf: true,
    };
    setDirectMessages((prev) => ({
      ...prev,
      [activeDmContactId]: [...(prev[activeDmContactId] || []), msg],
    }));
    setDmInputText("");
    setDmPendingAttachment("");
    setDmAttachmentMenuOpen(false);
  };

  // Task Selected for View Details
  const selectedTaskObj = tasks.find((t) => t.id === selectedTaskId);
  // Project Selected for View Details
  const selectedProjectObj = projectsList.find((p) => p.id === selectedProjectId);
  // Team Selected for View Details
  const selectedTeamObj = teamsList.find((t) => t.id === selectedTeamId);
  const assignableTaskMembers = isManager
    ? Array.from(
        new Set(
          teamsList.flatMap((team) => [team.lead, ...team.members.map((member) => member.name)])
        )
      )
    : teamsList.find((team) => team.project === newTaskProject)?.members.map((member) => member.name) || [];
  const selectedTaskAssignees = selectedTaskObj
    ? isManager
      ? assignableTaskMembers
      : teamsList.find((team) => team.project === selectedTaskObj.project)?.members.map((member) => member.name) || []
    : [];

  // -------------------------------------------------------------
  // RENDER: AUTH / LOGIN FLOW
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <main className={`auth-page auth-step-${authStep}`}>
        {/* Cursor light blur */}
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
              <small>ENTERPRISE MANAGEMENT</small>
              </div>
          </div>
          <div className="brand-message">
            <span className="brand-eyebrow">WORK FLOW PLATFORM</span>
            <h1>
              Welcome to
              <br />
              Work Flow.
            </h1>
            <p>Your work, your teams, and your projects — all unified in one place.</p>
            {authStep === "welcome" && (
              <button
                className="welcome-signin-button"
                type="button"
                onClick={() => {
                  setLoginId("abc@gmail.com");
                  setPassword("123456");
                  setAvailableWorkspaces(["admin", "lead", "employee"]);
                  setAuthStep("signin");
                  setNotice("");
                }}
              >
                Sign In
              </button>
            )}
          </div>
          <div className="brand-footer">
            <span>Work Flow © 2026</span>
        </div>
        </section>

        {authStep !== "welcome" && (
          <section className="auth-card-panel">
            <div className="auth-card">
              <div className="auth-card-header">
                <span className="auth-tag">
                  {authStep === "signup-profile" || authStep === "verify-email" || authStep === "signup-credentials"
                    ? "GET STARTED"
                    : authStep === "signin"
                    ? "SIGN IN"
                    : "RESET PASSWORD"}
                </span>
                <h2>
                  {authStep === "signin"
                    ? "Welcome Back"
                    : authStep === "signup-profile"
                    ? "Create your account"
                    : authStep === "verify-email"
                    ? "Verify your email"
                    : authStep === "signup-credentials"
                    ? "Set your password"
                    : "Reset Password"}
                </h2>
                <p className="subtitle">
                  {authStep === "signin"
                    ? "Sign in to your account. Switch workspaces anytime from your profile menu."
                    : authStep === "signup-profile"
                    ? "Tell us a little about yourself to get started."
                    : authStep === "verify-email"
                    ? `We sent a 6-digit code to ${signupEmail || "your email"}. (Demo code: 123456)`
                    : authStep === "signup-credentials"
                    ? "Choose a secure password to finish creating your account."
                    : "Enter your registered email to receive reset instructions."}
                </p>

                {notice && <div className="auth-notice-banner">{notice}</div>}
              </div>

              {/* 2. SIGN IN STEP */}
              {authStep === "signin" && (
                <form onSubmit={handleSignIn} className="auth-form">
                  <div className="form-group">
                    <label>Email or Username</label>
                    <input
                      type="text"
                      required
                      placeholder="abc@gmail.com"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <div className="label-row">
                      <label>Password</label>
                      <button
                        type="button"
                        className="link-btn-text"
                        onClick={() => setAuthStep("forgot")}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="password-input-wrap">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="123456"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="form-row-checkbox">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>Remember this device</span>
                    </label>
                  </div>

                  <button type="submit" className="btn-primary-auth">
                    Sign In →
                  </button>
                  <p className="auth-switch-text">
                    Demo account: <strong>abc@gmail.com</strong> / <strong>123456</strong>
                  </p>

                  <p className="auth-switch-text">
                    New to Work Flow?{" "}
                    <button
                      type="button"
                      className="link-btn-text"
                      onClick={() => {
                        setNotice("");
                        setAuthStep("signup-profile");
                      }}
                    >
                      Create new account →
                    </button>
                  </p>

                </form>
              )}

              {/* CREATE ACCOUNT — PROFILE */}
              {authStep === "signup-profile" && (
                <form
                  className="auth-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedSignupWorkspaces.length === 0) {
                      setNotice("Select at least one workspace to continue.");
                      return;
                    }
                    setNotice("");
                    setAuthStep("verify-email");
                  }}
                >
                  <div className="form-group">
                    <label>Full name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      required
                      minLength={7}
                      maxLength={15}
                      placeholder="Enter your phone number"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <fieldset className="form-group" style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend style={{ marginBottom: 10, fontWeight: 700 }}>Choose your workspaces</legend>
                    <div style={{ display: "grid", gap: 8 }}>
                      {([
                        ["admin", "Manager"],
                        ["lead", "Team Lead"],
                        ["employee", "Employee"],
                      ] as const).map(([workspace, label]) => (
                        <label key={workspace} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedSignupWorkspaces.includes(workspace)}
                            onChange={() => {
                              setSelectedSignupWorkspaces((current) =>
                                current.includes(workspace)
                                  ? current.filter((item) => item !== workspace)
                                  : [...current, workspace]
                              );
                            }}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <button type="submit" className="btn-primary-auth btn-arrow">
                    <span>Continue to email verification</span>
                    <span aria-hidden="true">⟶</span>
                  </button>
                  <p className="auth-switch-text">
                    Already have an account?{" "}
                    <button type="button" className="link-btn-text" onClick={() => setAuthStep("signin")}>
                      Sign in →
                    </button>
                  </p>
                </form>
              )}

              {/* CREATE ACCOUNT — VERIFY EMAIL */}
              {authStep === "verify-email" && (
                <form
                  className="auth-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (signupOtp.trim() !== "123456") {
                      setNotice("Please enter the correct 6-digit email code (demo: 123456).");
                      return;
                    }
                    setNotice("");
                    setAuthStep("signup-credentials");
                  }}
                >
                  <div className="form-group">
                    <label>Email verification code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit code"
                      value={signupOtp}
                      onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <button type="submit" className="btn-primary-auth btn-arrow">
                    <span>Verify email</span>
                    <span aria-hidden="true">⟶</span>
                  </button>
                  <div className="auth-footer-links">
                    <button type="button" className="link-btn-secondary" onClick={() => setAuthStep("signup-profile")}>
                      ← Edit details
                    </button>
                  </div>
                </form>
              )}

              {/* CREATE ACCOUNT — CREDENTIALS */}
              {authStep === "signup-credentials" && (
                <form
                  className="auth-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (signupPassword.length < 6) {
                      setNotice("Password must be at least 6 characters.");
                      return;
                    }
                    if (signupPassword !== signupConfirm) {
                      setNotice("Passwords do not match.");
                      return;
                    }
                    if (selectedSignupWorkspaces.length === 0) {
                      setNotice("Select at least one workspace before creating your account.");
                      return;
                    }
                    const workspaces = (["admin", "lead", "employee"] as WorkspaceRole[])
                      .filter((workspace) => selectedSignupWorkspaces.includes(workspace));
                    const firstWorkspace = workspaces[0] ?? "admin";
                    setRegisteredAccount({
                      name: signupName.trim(),
                      email: signupEmail.trim(),
                      username: signupUsername.trim(),
                      password: signupPassword,
                      workspaces,
                    });
                    setAvailableWorkspaces(workspaces);
                    setPortalRole(firstWorkspace === "admin" ? "admin" : "lead_employee");
                    if (firstWorkspace !== "admin") setLeadWorkspace(firstWorkspace);
                    setLoginId(signupEmail);
                    setPassword("");
                    setSignupPassword("");
                    setSignupConfirm("");
                    setSignupOtp("");
                    setNotice("Account created! Please sign in with your new credentials.");
                    setAuthStep("signin");
                  }}
                >
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      required
                      minLength={3}
                      placeholder="Choose a username"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Create password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm password</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter your password"
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary-auth btn-arrow">
                    <span>Create account</span>
                    <span aria-hidden="true">⟶</span>
                  </button>
                  <div className="auth-footer-links">
                    <button type="button" className="link-btn-secondary" onClick={() => setAuthStep("verify-email")}>
                      ← Back
                    </button>
                  </div>
                </form>
              )}

              {/* 3. FORGOT PASSWORD STEP */}
              {authStep === "forgot" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNotice("Demo password reset link has been dispatched to your email.");
                    setTimeout(() => setAuthStep("signin"), 1500);
                  }}
                  className="auth-form"
                >
                  <div className="form-group">
                    <label>Enter Registered Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@workflow.internal"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary-auth">
                    Send Reset Link
                  </button>
                  <div className="auth-footer-links">
                    <button
                      type="button"
                      className="link-btn-secondary"
                      onClick={() => setAuthStep("signin")}
                    >
                      ← Return to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
        </section>
        )}
      </main>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN APP SHELL (LOGGED IN)
  // -------------------------------------------------------------
  return (
    <main className={`app-shell green-black-theme ${activePage === "Dashboard" ? "ov-mode" : ""} ${notice ? "has-global-notice" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <span className="brand-logo" aria-label="Team">
            <TeamIcon />
          </span>
          <div>
            <strong>WORK FLOW</strong>
            <small>{isManager ? "Manager" : isTeamLead ? "Team Lead" : "Employee"} Workspace</small>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {currentMenuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              title={item.label}
              className={`nav-item ${activePage === item.destination ? "selected" : ""}`}
              onClick={() => navigateTo(item.destination)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activePage === item.destination && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-profile-wrap">
          {profileOpen && (
            <div className="sidebar-profile-menu" role="menu">
              <div className="dropdown-user-header">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.email}</small>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-user-header">
                <strong>Workspaces</strong>
                <small>Switch your active workspace</small>
              </div>
              {(["admin", "lead", "employee"] as WorkspaceRole[])
                .filter((workspace) => availableWorkspaces.includes(workspace))
                .map((workspace) => (
                  <button
                    key={workspace}
                    type="button"
                    className="dropdown-item"
                    aria-current={activeWorkspace === workspace ? "page" : undefined}
                    onClick={() => switchWorkspace(workspace)}
                  >
                    {workspaceLabel(workspace)}
                    {activeWorkspace === workspace ? " · Current" : ""}
                  </button>
                ))}
              <hr className="dropdown-divider" />
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  navigateTo("Notifications");
                  setProfileOpen(false);
                }}
              >
                Notifications ({notifications.filter((notification) => notification.unread).length})
              </button>
              <button type="button" className="dropdown-item logout" onClick={logout}>
                Log Out
              </button>
            </div>
          )}
          <button
            type="button"
            className="sidebar-profile-trigger"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label={`Open ${currentUser.name}'s profile menu`}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img src={currentUser.avatar} alt="" className="sidebar-user-avatar" />
            <span className="sidebar-user-info">
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </span>
            <span className="sidebar-profile-caret" aria-hidden="true">{profileOpen ? "▴" : "▾"}</span>
          </button>
        </div>
      </aside>

      {/* WORKSPACE CONTENT AREA */}
      <section className="workspace">
        {/* GLOBAL NOTICE BANNER */}
        {notice && (
          <div className="global-notice-bar">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")}>×</button>
          </div>
        )}

        {/* ========================================================
            PAGE CONTENT ROUTING
           ======================================================== */}
        <div className="workspace-scrollable">
          {activePage !== "Dashboard" && (
            <div className="workspace-content-header">
              <button
                type="button"
                className="workspace-content-back"
                onClick={() => setActivePage("Dashboard")}
                aria-label={`Back from ${activePage}`}
              >
                ←
              </button>
              <div>
                <h1>{activePage === "My Projects" ? "All Projects" : activePage}</h1>
                <p>
                  {activePage === "All Projects" || activePage === "My Projects"
                    ? "Manage projects, team members and task assignment"
                    : activePage === "All Tasks" || activePage === "My Tasks" || activePage === "Team Tasks"
                      ? "View and manage tasks across your workspace"
                      : activePage === "All Teams" || activePage === "My Teams"
                        ? "View teams, members and project ownership"
                        : `${activePage} workspace details`}
                </p>
              </div>
              {(activePage === "All Projects" || activePage === "My Projects") && portalRole === "admin" && (
                <button type="button" className="btn-primary-emerald workspace-content-action" onClick={() => setShowCreateProjectModal(true)}>
                  + Create Project
                </button>
              )}
            </div>
          )}
          {/* 1. OVERVIEW (role based) */}
          {activePage === "Dashboard" && (() => {
            const pct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : 0);
            const statusClass = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
            const initialsOf = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
            const Ring = ({ value }: { value: number }) => (
              <span className="ov-ring" style={{ background: `conic-gradient(var(--ov-accent) ${value * 3.6}deg, var(--ov-track) 0deg)` }}>
                <span>{value}%</span>
              </span>
            );
            const StatCard = ({ label, value, note }: { label: string; value: string | number; note: string }) => (
              <article className="ov-stat">
                <small>{label}</small>
                <strong>{value}</strong>
                <span>{note}</span>
              </article>
            );
            const ProjectRow = ({ p }: { p: ProjectItem }) => (
              <article className="ov-project-row">
                <span className="ov-project-icon"><FolderKanban size={18} /></span>
                <div className="ov-project-info">
                  <strong>{p.name}</strong>
                  <small>{p.team} · {p.members.length} members</small>
                </div>
                <span className="ov-project-lead">{p.teamLeader.split(" ")[0]}</span>
                <div className="ov-project-progress">
                  <Ring value={p.progress} />
                  <small>{p.completedTasks}/{p.totalTasks} Tasks</small>
                </div>
              </article>
            );

            if (isManager) {
              const done = tasks.filter((t) => t.status === "Completed").length;
              return (
                <div className="ov-page">
                  <section className="ov-stats">
                    <StatCard label="All Projects" value={projectsList.length} note="Managed" />
                    <StatCard label="All Team" value={teamsList.length} note="Across projects" />
                    <StatCard label="All Task" value={tasks.length} note="Across all teams" />
                    <StatCard label="Completion Rate" value={`${pct(done, tasks.length)}%`} note={`${done} of ${tasks.length} tasks`} />
                  </section>
                  <section className="ov-grid-2">
                    <div className="ov-card">
                      <h3>Project Overview</h3>
                      <div className="ov-scroll">
                        {projectsList.map((p) => <ProjectRow key={p.id} p={p} />)}
                      </div>
                    </div>
                    <div className="ov-card">
                      <h3>Quick Actions</h3>
                      <div className="ov-action">
                        <div><strong>Create Project</strong><small>Create project & add team members</small></div>
                        <button type="button" onClick={() => setShowCreateProjectModal(true)}>Create</button>
                      </div>
                      <div className="ov-action">
                        <div><strong>Assign Task</strong><small>Assign task to the team members</small></div>
                        <button type="button" onClick={() => setShowAssignTaskModal(true)}>Assign</button>
                      </div>
                      <div className="ov-action">
                        <div><strong>Team Board</strong><small>View team details & projects</small></div>
                        <button type="button" onClick={() => navigateTo("Team Board")}>Team board</button>
                      </div>
                    </div>
                  </section>
                  <section className="ov-card">
                    <h3>Recent Activity</h3>
                    <div className="ov-scroll ov-table-wrap">
                      <table className="ov-table">
                        <thead><tr><th>Name</th><th>Project</th><th>Task</th><th>Status</th></tr></thead>
                        <tbody>
                          {tasks.slice(0, 8).map((t) => (
                            <tr key={t.id} onClick={() => setSelectedTaskId(t.id)}>
                              <td><span className="ov-user"><span className="ov-avatar">{initialsOf(t.assignedTo)}</span>{t.assignedTo}</span></td>
                              <td>{t.project}</td>
                              <td>{t.title}</td>
                              <td><span className={`ov-pill ${statusClass(t.status)}`}>{t.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              );
            }

            if (isTeamLead) {
              const leadProjects = projectsList.filter((p) => p.teamLeader === currentUser.name);
              const leadProjectNames = new Set(leadProjects.map((p) => p.name));
              const leadTeams = teamsList.filter((tm) => tm.lead === currentUser.name || leadProjectNames.has(tm.project));
              const leadTasks = tasks.filter((t) => leadProjectNames.has(t.project));
              const teamOf = (projectName: string) => leadProjects.find((p) => p.name === projectName)?.team ?? "—";
              return (
                <div className="ov-page">
                  <section className="ov-stats">
                    <StatCard label="Projects" value={leadProjects.length} note="Assigned to you" />
                    <StatCard label="Teams" value={leadTeams.length} note="You lead" />
                    <StatCard label="Tasks" value={leadTasks.length} note="In your projects" />
                    <StatCard label="Completed" value={leadTasks.filter((t) => t.status === "Completed").length} note="Tasks done" />
                  </section>
                  <section className="ov-grid-3">
                    <div className="ov-card">
                      <h3>Project Overview</h3>
                      <div className="ov-scroll">
                        {leadProjects.length === 0 ? (
                          <p className="ov-empty">No project assigned yet. Projects appear here once the admin assigns you as Team Lead.</p>
                        ) : (
                          leadProjects.map((p) => <ProjectRow key={p.id} p={p} />)
                        )}
                      </div>
                    </div>
                    <div className="ov-card">
                      <h3>Teams</h3>
                      <div className="ov-scroll">
                        {leadTeams.length === 0 && <p className="ov-empty">No teams yet.</p>}
                        {leadTeams.map((tm) => (
                          <div key={tm.id} className="ov-team-row">
                            <strong>{tm.name}</strong>
                            <small>{tm.members.length} members</small>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="ov-card">
                      <h3>Quick Actions</h3>
                      <div className="ov-action">
                        <div><strong>Assign Task</strong><small>Assign task to team members</small></div>
                        <button type="button" onClick={() => setShowAssignTaskModal(true)}>Assign</button>
                      </div>
                      <div className="ov-action">
                        <div><strong>View Team</strong><small>View team members & details</small></div>
                        <button type="button" onClick={() => navigateTo("My Teams")}>View</button>
                      </div>
                    </div>
                  </section>
                  <section className="ov-card">
                    <h3>Team Members Recent Activity</h3>
                    <div className="ov-scroll ov-table-wrap">
                      <table className="ov-table">
                        <thead><tr><th>Name</th><th>Team</th><th>Project</th><th>Task</th><th>Status</th></tr></thead>
                        <tbody>
                          {leadTasks.length === 0 && <tr><td colSpan={5} className="ov-empty">No activity yet.</td></tr>}
                          {leadTasks.slice(0, 8).map((t) => (
                            <tr key={t.id} onClick={() => setSelectedTaskId(t.id)}>
                              <td><span className="ov-user"><span className="ov-avatar">{initialsOf(t.assignedTo)}</span>{t.assignedTo}</span></td>
                              <td>{teamOf(t.project)}</td>
                              <td>{t.project}</td>
                              <td>{t.title}</td>
                              <td><span className={`ov-pill ${statusClass(t.status)}`}>{t.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              );
            }

            const myTasks = tasks.filter((t) => t.assignedTo === currentUser.name);
            const openTasks = myTasks.filter((t) => t.status !== "Completed");
            const myTeamCount = teamsList.filter((tm) => tm.members.some((m) => m.name === currentUser.name)).length;
            const totalSeconds = myTasks.reduce((sum, t) => sum + t.timeSpentSeconds, 0);
            const current = myTasks.find((t) => t.id === runningTaskId) ?? myTasks.find((t) => t.status === "In progress") ?? openTasks[0];
            const timerOn = current ? runningTaskId === current.id : false;
            return (
              <div className="ov-page">
                <section className="ov-stats">
                  <StatCard label="My Open Tasks" value={openTasks.length} note="To finish" />
                  <StatCard label="My Teams" value={myTeamCount} note="You belong to" />
                  <StatCard label="Time" value={`${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m`} note="Tracked" />
                  <StatCard label="Completed" value={myTasks.length - openTasks.length} note="Tasks done" />
                </section>
                <section className="ov-grid-2">
                  <div className="ov-card">
                    <div className="ov-card-head">
                      <h3>Current Task</h3>
                      {current && <span className={`ov-pill ${statusClass(current.status)}`}>{current.status}</span>}
                    </div>
                    {current ? (
                      <>
                        <strong className="ov-current-title">{current.title}</strong>
                        <p className="ov-current-meta">
                          Project: {current.project} · Assigned by: {current.assignedBy} · Due: {current.due}
                        </p>
                        <div className="ov-timer-row">
                          <div><small>Active Timer</small><strong>{formatTimer(current.timeSpentSeconds)}</strong></div>
                          <button type="button" onClick={(e) => toggleTaskTimer(current.id, e)}>{timerOn ? "Pause" : "Start"}</button>
                        </div>
                      </>
                    ) : (
                      <p className="ov-empty">No open tasks right now.</p>
                    )}
                  </div>
                  <div className="ov-card">
                    <h3>Team Activity</h3>
                    <div className="ov-scroll">
                      {timeLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="ov-activity-row">
                          <span><strong>{log.user}</strong> {log.activity.toLowerCase()}</span>
                          <small>{log.time}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                <section className="ov-card">
                  <h3>Upcoming Tasks</h3>
                  <div className="ov-scroll ov-table-wrap">
                    <table className="ov-table">
                      <thead><tr><th>Task</th><th>Project</th><th>Due Date</th><th>Priority</th><th>Status</th></tr></thead>
                      <tbody>
                        {openTasks.length === 0 && <tr><td colSpan={5} className="ov-empty">No upcoming tasks.</td></tr>}
                        {openTasks.map((t) => (
                          <tr key={t.id} onClick={() => setSelectedTaskId(t.id)}>
                            <td>{t.title}</td>
                            <td>{t.project}</td>
                            <td>{t.due}</td>
                            <td><span className={`ov-priority ${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                            <td><span className={`ov-pill ${statusClass(t.status)}`}>{t.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            );
          })()}

          {/* 2. ALL PROJECTS & MY PROJECTS (GRID VIEW!) */}
          {(activePage === "All Projects" || activePage === "My Projects") && (
            <div className="projects-view-page">
              <div className="manager-project-metrics">
                <div><span>Total Projects</span><strong>{visibleProjects.length}</strong></div>
                <div><span>In Progress</span><strong>{visibleProjects.filter((project) => project.status === "In Progress").length}</strong></div>
                <div><span>Completed</span><strong>{visibleProjects.filter((project) => project.status === "Completed").length}</strong></div>
                <div><span>Open Tasks</span><strong>{tasks.filter((task) => task.status !== "Completed").length}</strong></div>
              </div>

              <div className="manager-project-toolbar">
                <div className="search-filters-left">
                  <div className="search-box-input">
                    <span className="search-icon">⌕</span>
                    <input
                      type="search"
                      placeholder="Search projects by name, team, or lead..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="project-status-select"
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                    aria-label="Filter projects by status"
                  >
                    <option value="all">All statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>

              </div>

              <div className="project-directory-table-wrap">
                <table className="project-directory-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Team</th>
                      <th>Lead</th>
                      <th>Tasks</th>
                      <th>Progress</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProjects.map((project) => (
                      <tr key={project.id} onClick={() => setSelectedProjectId(project.id)}>
                        <td><strong>{project.name}</strong><span>{project.description}</span></td>
                        <td>{project.team}</td>
                        <td>
                          <div className="project-table-person">
                            <span className="project-lead-avatar">{project.teamLeader.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                            <span>{project.teamLeader}</span>
                          </div>
                        </td>
                        <td>{tasks.filter((task) => task.project === project.name).length}</td>
                        <td>
                          <div className="project-table-progress">
                            <div><i style={{ width: `${project.progress}%` }} /></div>
                            <strong>{project.progress}%</strong>
                          </div>
                        </td>
                        <td>{project.dueDate}</td>
                        <td><span className={`status-badge-pill ${project.status.toLowerCase().replace(" ", "-")}`}>{project.status}</span></td>
                        <td><button type="button" className="project-row-open" onClick={(e) => { e.stopPropagation(); setSelectedProjectId(project.id); }}>Open →</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {visibleProjects.length === 0 && (
                <div className="empty-state-card">
                  <h3>{portalRole === "lead_employee" && leadWorkspace === "lead" && !projectSearch && projectStatusFilter === "all" ? "No project assigned yet" : "No Projects Found"}</h3>
                  <p>{portalRole === "lead_employee" && leadWorkspace === "lead" && !projectSearch && projectStatusFilter === "all" ? "Projects appear here once the admin assigns you as Team Lead." : "Try clearing your search query or status filter."}</p>
                </div>
              )}
            </div>
          )}

          {/* 3. ALL TASKS, TEAM TASKS, MY TASKS (LIST VIEW!) */}
          {(activePage === "All Tasks" || activePage === "Team Tasks" || activePage === "My Tasks") && (
            <div className="tasks-view-page">
              {/* Action Bar */}
              <div className="view-action-bar">
                <div className="search-filters-left">
                  <div className="search-box-input">
                    <span className="search-icon">⌕</span>
                    <input
                      type="search"
                      placeholder="Search tasks, deliverables, projects..."
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                    />
                  </div>

                  {/* Priority Filter */}
                  <select
                    className="select-filter-dropdown"
                    value={taskPriorityFilter}
                    onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    className="select-filter-dropdown"
                    value={taskStatusFilter}
                    onChange={(e) => setTaskStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="To do">To do</option>
                    <option value="In progress">In progress</option>
                    <option value="Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {isManager && (
                  <button
                    type="button"
                    className="btn-primary-emerald"
                    onClick={createTeam}
                  >
                    + Create Team
                  </button>
                )}
                {(isManager || isTeamLead) && (
                  <button
                    type="button"
                    className="btn-primary-emerald"
                    onClick={() => {
                      setNewTaskProject("Billing Platform");
                      setShowAssignTaskModal(true);
                    }}
                  >
                    + Assign Task
                  </button>
                )}
              </div>

              {/* LIST VIEW FOR TASKS */}
              <div className="tasks-list-table-container">
                <table className="tasks-list-table">
                  <thead>
                    <tr>
                      <th style={{ width: "35%" }}>TASK DELIVERABLE</th>
                      <th style={{ width: "16%" }}>ASSIGNEE</th>
                      <th style={{ width: "10%" }}>PRIORITY</th>
                      <th style={{ width: "12%" }}>STATUS</th>
                      <th style={{ width: "12%" }}>DUE DATE</th>
                      <th style={{ width: "15%", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTasks.map((task) => {
                      const isTimerActive = runningTaskId === task.id;
                      return (
                        <tr
                          key={task.id}
                          className="task-row-interactive"
                          onClick={() => setSelectedTaskId(task.id)}
                        >
                          {/* Task details */}
                          <td>
                            <div className="task-title-cell">
                              <span className="task-id-tag">{task.id}</span>
                              <div>
                                <strong className="task-name-text">{task.title}</strong>
                                <div className="task-subline">
                                  <span className="proj-pill-mini">{task.project}</span>
                                  <span>· Assigned by {task.assignedBy}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Assignee */}
                          <td>
                            <div className="assignee-cell">
                              <img src={task.assignedToAvatar} alt={task.assignedTo} className="assignee-avatar-sm" />
                              <span>{task.assignedTo}</span>
                            </div>
                          </td>

                          {/* Priority */}
                          <td>
                            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`status-badge-pill ${task.status.toLowerCase().replace(" ", "-")}`}>
                              {task.status}
                            </span>
                          </td>

                          {/* Due Date */}
                          <td>
                            <span className="due-date-text">📅 {task.due}</span>
                          </td>

                          {/* Actions: Timer & Details */}
                          <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                            <div className="task-actions-right">
                              {/* Employee Interactive Timer */}
                              {isEmployee && task.availableForPickup && (
                                <button
                                  type="button"
                                  className="btn-table-action"
                                  onClick={() => takeAvailableTask(task.id)}
                                >
                                  Take Task
                                </button>
                              )}
                              {task.assignedTo === currentUser.name && (
                                <button
                                  type="button"
                                  className={`btn-timer-toggle ${isTimerActive ? "running pulse" : ""}`}
                                  onClick={(e) => toggleTaskTimer(task.id, e)}
                                  title={isTimerActive ? "Pause Timer" : "Start Timer"}
                                >
                                  {isTimerActive ? `⏸ ${formatTimer(task.timeSpentSeconds)}` : `▶ Start (${formatTimer(task.timeSpentSeconds)})`}
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={() => setSelectedTaskId(task.id)}
                              >
                                Details →
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {visibleTasks.length === 0 && (
                  <div className="empty-state-card">
                    <h3>No Tasks Found</h3>
                    <p>No matching task records for your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. ALL TEAMS & MY TEAMS (GRID VIEW!) */}
          {(activePage === "All Teams" || activePage === "My Teams") && (
            <div className="teams-view-page">
              <div className="view-action-bar">
                <div className="search-filters-left">
                  <div className="search-box-input">
                    <span className="search-icon">⌕</span>
                    <input
                      type="search"
                      placeholder="Search teams by name, project, or lead..."
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                    />
                  </div>
                </div>

                {(portalRole === "admin" || leadWorkspace === "lead") && (
                  <button
                    type="button"
                    className="btn-primary-emerald"
                    onClick={() => {
                      setNewTaskProject("Billing Platform");
                      setShowAssignTaskModal(true);
                    }}
                  >
                    + Assign Task to Team
                  </button>
                )}
              </div>

              <div className="project-directory-table-wrap team-directory-table-wrap">
                <table className="project-directory-table team-directory-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Project</th>
                      <th>Lead</th>
                      <th>Team Members</th>
                      <th>Tasks</th>
                      <th>Status</th>
                      <th aria-label="Open team" />
                    </tr>
                  </thead>
                  <tbody>
                {visibleTeams.map((team) => (
                  <tr key={team.id} onClick={() => setSelectedTeamId(team.id)}>
                    <td><strong># {team.name}</strong></td>
                    <td>{team.project}</td>
                    <td>
                      <div className="project-table-person">
                        <span className="project-lead-avatar">{team.lead.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                        <span>{team.lead}</span>
                      </div>
                    </td>
                    <td>
                      <div className="team-member-avatar-list">
                        {team.members.slice(0, 4).map((member) => <span key={member.id}>{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>)}
                        <small>{team.members.length} members</small>
                      </div>
                    </td>
                    <td>{team.totalTasks}</td>
                    <td><span className={`status-badge-pill ${team.completedTasks === team.totalTasks ? "completed" : "in-progress"}`}>{team.completedTasks === team.totalTasks ? "Inactive" : "Active"}</span></td>
                    <td><button type="button" className="project-row-open" onClick={(event) => { event.stopPropagation(); setSelectedTeamId(team.id); }}>›</button></td>
                  </tr>
                ))}
                  </tbody>
                </table>
              </div>

              {visibleTeams.length === 0 && (
                <div className="empty-state-card">
                  <h3>No Teams Found</h3>
                  <p>No matching team squads here.</p>
                </div>
              )}
            </div>
          )}

          {/* 5. EMPLOYEE MY TEAM VIEW */}
          {activePage === "My Team" && (
            <div className="employee-my-team-page">
              <div className="my-team-hero-card">
                <div className="hero-lead-box">
                  <span className="lead-hero-tag">YOUR TEAM LEAD</span>
                  <div className="lead-hero-content">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Arun Patel"
                      className="lead-hero-avatar"
                    />
                    <div>
                      <h2>Arun Patel</h2>
                      <p>Lead Engineer · Alpha Engineering & Analytics</p>
                      <small>arun.patel@workflow.internal</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-emerald"
                    onClick={() => {
                      setActiveDmContactId("arun-patel");
                      navigateTo("Direct Chat");
                    }}
                  >
                    Direct Message Lead →
                  </button>
                </div>

                <div className="hero-team-meta">
                  <h3>Alpha Engineering Squad</h3>
                  <p>Responsible for Core Billing Architecture, multi-currency processing, and high-performance financial transactions.</p>
                  <div className="team-stats-mini-row">
                    <span>👥 4 Engineers Active</span>
                    <span>✓ 12 Sprints Completed</span>
                    <span>⚡ 100% SLA Uptime</span>
                  </div>
                </div>
              </div>

              <h3 className="section-subtitle-text">Teammates in Alpha Squad</h3>
              <div className="teammates-grid">
                {(initialTeams[0]?.members ?? []).map((member) => (
                  <div key={member.id} className="teammate-card">
                    <img src={member.avatar} alt={member.name} className="teammate-avatar" />
                    <h4>{member.name}</h4>
                    <span className="teammate-role">{member.role}</span>
                    <span className={`status-dot-indicator ${member.status.toLowerCase()}`}>
                      ● {member.status}
                    </span>
                    <small>{member.email}</small>
                    <span className="active-tasks-count">{member.activeTasks} assigned tasks</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TEAM BOARD (KANBAN) */}
          {activePage === "Team Board" && (
            <div className="team-board-page">
              <div className="board-columns-container">
                {(["To do", "In progress", "Review", "Completed"] as const).map((column) => {
                  const cards = boardCards.filter((c) => c.column === column);
                  return (
                    <div key={column} className="kanban-column">
                      <div className="column-header">
                        <span className="column-title">{column}</span>
                        <span className="column-count-badge">{cards.length}</span>
                      </div>
                      <div className="column-cards-list">
                        {cards.map((card) => (
                          <div
                            key={card.id}
                            className="kanban-card"
                            onClick={() => setSelectedTaskId(card.id)}
                          >
                            <div className="kcard-top">
                              <span className="kcard-project">{card.project}</span>
                              <span className={`priority-pill-mini ${card.priority.toLowerCase()}`}>
                                {card.priority}
                              </span>
                            </div>
                            <strong className="kcard-title">{card.title}</strong>
                            <div className="kcard-bottom">
                              <span className="kcard-due">📅 {card.due}</span>
                              <div className="kcard-assignee-badge">
                                {card.assigneeInitials}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. GROUP CHAT (TEAM WISE) */}
          {activePage === "Group Chat" && (
            <div className="chat-system-page">
              <div className="chat-channels-sidebar">
                <span className="chat-sidebar-header">TEAM CHANNELS</span>
                <label className="chat-search-box">
                  <span>⌕</span>
                  <input type="search" placeholder="Search team" />
                </label>
                {[
                  { id: "alpha-engineering", name: "#alpha-engineering", tag: "Alpha Team" },
                  { id: "beta-mobile", name: "#beta-mobile", tag: "Mobile Team" },
                  { id: "billing-platform", name: "#billing-platform", tag: "Billing Core" },
                  { id: "design-sync", name: "#design-sync", tag: "Design & UX" },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    className={`channel-nav-btn ${activeChannelId === ch.id ? "active" : ""}`}
                    onClick={() => setActiveChannelId(ch.id)}
                  >
                    <strong>{ch.name}</strong>
                    <small>{ch.tag}</small>
                  </button>
                ))}
              </div>

              <div className="chat-conversation-area">
                <div className="chat-top-header">
                  <h3>#{activeChannelId}</h3>
                  <small>Team-wise live engineering communication</small>
                </div>

                <div className="chat-messages-scroll">
                  {(chatMessages[activeChannelId] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${msg.isSelf ? "self" : ""}`}
                    >
                      <div className="chat-sender-avatar">{msg.senderInitials}</div>
                      <div className="chat-bubble-body">
                        <div className="chat-bubble-meta">
                          <strong>{msg.sender}</strong>
                          <small>{msg.time}</small>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                  <div className="chat-attachment-wrap">
                    <button
                      type="button"
                      className="chat-attach-button"
                      aria-label="Add attachment"
                      onClick={() => setChatAttachmentMenuOpen((open) => !open)}
                    >
                      ×
                    </button>
                    {chatAttachmentMenuOpen && (
                      <div className="chat-attachment-menu">
                        <label>▤ Documents<input type="file" accept=".pdf,.doc,.docx,.txt,.csv" onChange={(event) => setChatPendingAttachment(event.target.files?.[0] ? `Attached: ${event.target.files[0].name}` : "")} /></label>
                        <button type="button" onClick={() => { const link = window.prompt("Paste link"); setChatPendingAttachment(link ? `Link: ${link}` : ""); }}>⌁ Links</button>
                        <label>▧ Image<input type="file" accept="image/*" onChange={(event) => setChatPendingAttachment(event.target.files?.[0] ? `Image: ${event.target.files[0].name}` : "")} /></label>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder={`Message #${activeChannelId}...`}
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                  />
                  <button type="submit" className="btn-chat-send">
                    ➤ Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 8. DIRECT CHAT (MEMBER WISE) */}
          {activePage === "Direct Chat" && (
            <div className="chat-system-page">
              <div className="chat-channels-sidebar">
                <span className="chat-sidebar-header">DIRECT MESSAGES</span>
                <label className="chat-search-box">
                  <span>⌕</span>
                  <input type="search" placeholder="Search user" />
                </label>
                {[
                  { id: "arun-patel", name: "Arun Patel", role: "Team Lead", status: "Active" },
                  { id: "priya-sharma", name: "Priya Sharma", role: "Mobile Lead", status: "Active" },
                  { id: "sneha-rao", name: "Sneha Rao", role: "Backend Architect", status: "Away" },
                ].map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    className={`channel-nav-btn ${activeDmContactId === contact.id ? "active" : ""}`}
                    onClick={() => setActiveDmContactId(contact.id)}
                  >
                    <strong>{contact.name}</strong>
                    <small>{contact.role} · {contact.status}</small>
                  </button>
                ))}
              </div>

              <div className="chat-conversation-area">
                <div className="chat-top-header">
                  <h3>{activeDmContactId.replace("-", " ").toUpperCase()}</h3>
                  <small>Private 1-on-1 member conversation</small>
                </div>

                <div className="chat-messages-scroll">
                  {(directMessages[activeDmContactId] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${msg.isSelf ? "self" : ""}`}
                    >
                      <div className="chat-sender-avatar">{msg.senderInitials}</div>
                      <div className="chat-bubble-body">
                        <div className="chat-bubble-meta">
                          <strong>{msg.sender}</strong>
                          <small>{msg.time}</small>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendDirectMessage} className="chat-input-bar">
                  <div className="chat-attachment-wrap">
                    <button
                      type="button"
                      className="chat-attach-button"
                      aria-label="Add attachment"
                      onClick={() => setDmAttachmentMenuOpen((open) => !open)}
                    >
                      +
                    </button>
                    {dmAttachmentMenuOpen && (
                      <div className="chat-attachment-menu">
                        <label>▤ Documents<input type="file" accept=".pdf,.doc,.docx,.txt,.csv" onChange={(event) => setDmPendingAttachment(event.target.files?.[0] ? `Attached: ${event.target.files[0].name}` : "")} /></label>
                        <button type="button" onClick={() => { const link = window.prompt("Paste link"); setDmPendingAttachment(link ? `Link: ${link}` : ""); }}>⌁ Links</button>
                        <label>▧ Image<input type="file" accept="image/*" onChange={(event) => setDmPendingAttachment(event.target.files?.[0] ? `Image: ${event.target.files[0].name}` : "")} /></label>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a direct message..."
                    value={dmInputText}
                    onChange={(e) => setDmInputText(e.target.value)}
                  />
                  <button type="submit" className="btn-chat-send">
                    ➤ Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 9. TEAM PROGRESS & TIME LOGS (FOR LEAD) */}
          {activePage === "Team Progress" && (
            <div className="team-progress-page">
              <div className="progress-overview-hero">
                <div>
                  <h2>Team Velocity & Progress</h2>
                  <p>Live tracking of member deliverable completion and logged sprint hours.</p>
                </div>
                <button
                  type="button"
                  className="btn-primary-emerald"
                  onClick={() => setShowAssignTaskModal(true)}
                >
                  + Assign Deliverable
                </button>
              </div>

              {/* Member progress metrics */}
              <div className="member-progress-cards-grid">
                {visibleTeams.flatMap((team) =>
                  team.members.map((member) => ({ ...member, teamName: team.name }))
                ).map((member) => (
                  <div key={`${member.teamName}-${member.id}`} className="member-progress-card">
                    <div className="mp-header">
                      <img src={member.avatar} alt={member.name} className="mp-avatar" />
                      <div>
                        <strong>{member.name}</strong>
                        <small>{member.role} · {member.teamName}</small>
                      </div>
                    </div>
                    <div className="mp-stats">
                      <span>Tasks in flight: <strong>{member.activeTasks}</strong></span>
                      <span>Logged this sprint: <strong>32h 15m</strong></span>
                    </div>
                    <div className="progress-track" style={{ marginTop: "12px" }}>
                      <div className="progress-fill-emerald" style={{ width: `${80 - member.activeTasks * 10}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Integrated Time Logs */}
              <div className="time-logs-card">
                <div className="time-logs-header">
                  <h3>Recent Team Activity & Time Logs</h3>
                  <small>Recorded time logs across Alpha Engineering & Analytics projects</small>
                </div>

                <table className="time-logs-table">
                  <thead>
                    <tr>
                      <th>ENGINEER</th>
                      <th>TASK DELIVERABLE</th>
                      <th>ACTIVITY</th>
                      <th>DURATION</th>
                      <th>TIMESTAMP</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeLogs
                      .filter((log) => visibleTasks.some((task) => log.task.includes(task.id)))
                      .map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div className="user-initials-chip">
                            <span className="log-avatar">{log.userInitials}</span>
                            <strong>{log.user}</strong>
                          </div>
                        </td>
                        <td>{log.task}</td>
                        <td>{log.activity}</td>
                        <td><strong>{log.duration}</strong></td>
                        <td><small>{log.time}</small></td>
                        <td><span className="badge-event">{log.event}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === "Time Tracking" && (
            <div className="time-logs-card">
              <div className="time-logs-header">
                <h3>{isManager ? "Project Time Tracking" : isTeamLead ? "Team Time Tracking" : "My Time Tracking"}</h3>
                <small>
                  {isManager
                    ? "Time recorded across all projects."
                    : isTeamLead
                    ? "Time recorded for your assigned teams and your own tasks."
                    : "Personal time recorded on your assigned tasks."}
                </small>
              </div>
              <table className="time-logs-table">
                <thead>
                  <tr>
                    <th>TASK</th>
                    <th>PROJECT</th>
                    <th>ASSIGNEE</th>
                    <th>TIME SPENT</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}: {task.title}</td>
                      <td>{task.project}</td>
                      <td>{task.assignedTo}</td>
                      <td><strong>{formatTimer(task.timeSpentSeconds)}</strong></td>
                      <td><span className="badge-event">{task.status}</span></td>
                      <td>
                        {task.assignedTo === currentUser.name && (
                          <button
                            type="button"
                            className="btn-table-action"
                            onClick={() => toggleTaskTimer(task.id)}
                          >
                            {runningTaskId === task.id ? "Pause" : "Start"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activePage === "Reports" && (
            <div className="dashboard-content-page">
              <div className="stats-grid-row">
                <div className="metric-kpi-card green-accent">
                  <div className="kpi-top"><span>PROJECTS IN SCOPE</span><span className="kpi-icon">🗂</span></div>
                  <strong className="kpi-value">{visibleProjects.length}</strong>
                  <small className="kpi-subtext">Projects visible to this workspace</small>
                </div>
                <div className="metric-kpi-card dark-accent">
                  <div className="kpi-top"><span>TEAMS IN SCOPE</span><span className="kpi-icon">👥</span></div>
                  <strong className="kpi-value">{visibleTeams.length}</strong>
                  <small className="kpi-subtext">Teams visible to this workspace</small>
                </div>
                <div className="metric-kpi-card green-accent">
                  <div className="kpi-top"><span>ACTIVE TASKS</span><span className="kpi-icon">⚡</span></div>
                  <strong className="kpi-value">{visibleTasks.filter((task) => task.status === "In progress").length}</strong>
                  <small className="kpi-subtext">Tasks currently in progress</small>
                </div>
                <div className="metric-kpi-card dark-accent">
                  <div className="kpi-top"><span>COMPLETED TASKS</span><span className="kpi-icon">✓</span></div>
                  <strong className="kpi-value">{visibleTasks.filter((task) => task.status === "Completed").length}</strong>
                  <small className="kpi-subtext">Completed tasks in scope</small>
                </div>
              </div>
              <div className="time-logs-card">
                <div className="time-logs-header">
                  <h3>Project Performance</h3>
                  <small>Progress and task completion for the projects you are permitted to view.</small>
                </div>
                <table className="time-logs-table">
                  <thead>
                    <tr><th>PROJECT</th><th>TEAM</th><th>TEAM LEAD</th><th>PROGRESS</th><th>TASKS</th><th>COMPLETED</th></tr>
                  </thead>
                  <tbody>
                    {visibleProjects.map((project) => {
                      const projectTasks = visibleTasks.filter((task) => task.project === project.name);
                      return (
                        <tr key={project.id}>
                          <td>{project.name}</td>
                          <td>{project.team}</td>
                          <td>{project.teamLeader}</td>
                          <td>{project.progress}%</td>
                          <td>{projectTasks.length}</td>
                          <td>{projectTasks.filter((task) => task.status === "Completed").length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="time-logs-card">
                <div className="time-logs-header">
                  <h3>Team & Employee Performance</h3>
                  <small>Task completion and tracked time limited to teams available in this workspace.</small>
                </div>
                <table className="time-logs-table">
                  <thead>
                    <tr><th>TEAM</th><th>MEMBER</th><th>ACTIVE TASKS</th><th>COMPLETED</th><th>TIME TRACKED</th></tr>
                  </thead>
                  <tbody>
                    {visibleTeams.flatMap((team) =>
                      team.members.map((member) => {
                        const memberTasks = visibleTasks.filter(
                          (task) => task.project === team.project && task.assignedTo === member.name
                        );
                        const trackedSeconds = memberTasks.reduce(
                          (total, task) => total + task.timeSpentSeconds,
                          0
                        );
                        return (
                          <tr key={`${team.id}-${member.id}`}>
                            <td>{team.name}</td>
                            <td>{member.name}</td>
                            <td>{memberTasks.filter((task) => task.status !== "Completed").length}</td>
                            <td>{memberTasks.filter((task) => task.status === "Completed").length}</td>
                            <td>{formatTimer(trackedSeconds)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === "Settings" && (
            <div className="dash-card">
              <div className="dash-card-header"><h3>Profile & Workspace Settings</h3></div>
              <div className="dash-card-body">
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Active workspace:</strong> {workspaceLabel(activeWorkspace)}</p>
                <p><strong>Available workspaces:</strong> {availableWorkspaces.map(workspaceLabel).join(", ")}</p>
                <p>Workspace switching and role access are based on the workspaces selected for this account.</p>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activePage === "Notifications" && (
            <div className="notifications-page">
              <div className="notifications-container-card">
                <div className="notif-header-row">
                  <h3>Notifications ({notifications.filter((n) => n.unread).length} Unread)</h3>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                      setNotice("All notifications marked as read.");
                    }}
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="notif-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notif-item ${notif.unread ? "unread" : ""}`}>
                      <span className="notif-icon-badge">
                        {notif.type === "task" ? "✓" : notif.type === "chat" ? "✉" : "★"}
                      </span>
                      <div className="notif-content">
                        <strong>{notif.title}</strong>
                        <p>{notif.detail}</p>
                        <small>{notif.time}</small>
                      </div>
                      {notif.unread && <span className="unread-dot"></span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          MODALS & DRAWERS
         ======================================================== */}

      {/* CREATE PROJECT MODAL (ADMIN ONLY) */}
      {showCreateProjectModal && (
        <div className="modal-overlay" onClick={() => setShowCreateProjectModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Project</h3>
              <button type="button" className="close-btn" onClick={() => setShowCreateProjectModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Client App"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Scope, objectives, and deliverables..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                />
              </div>

              <div className="form-row-two-col">
                <div className="form-group">
                  <label>Assign Team Lead *</label>
                  <select value={newProjLead} onChange={(e) => setNewProjLead(e.target.value)}>
                    <option value="Arun Patel">Arun Patel (Senior Lead)</option>
                    <option value="Priya Sharma">Priya Sharma (Mobile Lead)</option>
                    <option value="Maya Chen">Maya Chen (Operations Lead)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Team Squad</label>
                  <select value={newProjTeam} onChange={(e) => setNewProjTeam(e.target.value)}>
                    <option value="Alpha Engineering">Alpha Engineering</option>
                    <option value="Beta Mobile Squad">Beta Mobile Squad</option>
                    <option value="Core HR & Ops">Core HR & Ops</option>
                    <option value="Analytics & Design">Analytics & Design</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Select Team Members</label>
                <div className="checkboxes-members-grid">
                  {[
                    "Arun Patel",
                    "Rahul Varma",
                    "Sneha Rao",
                    "Alex Morgan",
                    "Vikram Malhotra",
                    "Ananya Sen",
                    "Karan Mehta",
                    "Pooja Hegde",
                  ].map((memberName) => (
                    <label key={memberName} className="checkbox-member-item">
                      <input
                        type="checkbox"
                        checked={newProjMembers.includes(memberName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProjMembers([...newProjMembers, memberName]);
                          } else {
                            setNewProjMembers(newProjMembers.filter((m) => m !== memberName));
                          }
                        }}
                      />
                      <span>{memberName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row-two-col">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newProjDueDate}
                    onChange={(e) => setNewProjDueDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newProjStatus}
                    onChange={(e) => setNewProjStatus(e.target.value as ProjectItem["status"])}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
                </div>

                <div className="modal-actions-footer">
                  <button
                    type="button"
                    className="btn-modal-cancel"
                  onClick={() => setShowCreateProjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Create Project →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TASK MODAL (ADMIN & LEAD) */}
      {showAssignTaskModal && (
        <section className="workspace-page-view assign-task-page-view" aria-label="Assign task">
          <div className="workspace-page-view-body">
            <div className="modal-header">
              <button
                type="button"
                className="workspace-page-back"
                onClick={() => {
                  setShowAssignTaskModal(false);
                  if (assignTaskProjectId) setSelectedProjectId(assignTaskProjectId);
                  setAssignTaskProjectId(null);
                }}
              >
                <span aria-hidden="true">←</span> Project details
              </button>
              <h3>Assign New Task</h3>
            </div>

            <form onSubmit={handleAssignTask} className="modal-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Webhook retry architecture"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>

              <div className="form-row-two-col">
                <div className="form-group">
                  <label>Select Project *</label>
                  <select
                    value={newTaskProject}
                    onChange={(e) => {
                      const projectName = e.target.value;
                      setNewTaskProject(projectName);
                      if (isTeamLead) {
                        const firstTeamMember = teamsList
                          .find((team) => team.project === projectName)
                          ?.members[0]?.name;
                        if (firstTeamMember) setNewTaskAssignee(firstTeamMember);
                      }
                    }}
                  >
                    {(isManager ? projectsList : visibleProjects).map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign to Employee *</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                  >
                    {assignableTaskMembers.map((memberName) => (
                      <option key={memberName} value={memberName}>{memberName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Task Description</label>
                <textarea
                  rows={3}
                  placeholder="Acceptance checklist, endpoints, requirements..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </div>

              <div className="form-row-two-col">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Task["priority"])}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => {
                    setShowAssignTaskModal(false);
                    if (assignTaskProjectId) setSelectedProjectId(assignTaskProjectId);
                    setAssignTaskProjectId(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Assign Task →
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* PROJECT DETAILS MODAL */}
      {selectedProjectObj && (
        <section className="workspace-page-view project-detail-page-view" aria-label="Project details">
          <div className="project-detail-page-view-body">
            <div className="modal-header">
              <div className="project-details-page-heading">
                <button type="button" className="workspace-page-back" onClick={() => setSelectedProjectId(null)}>
                  <span aria-hidden="true">←</span> All Projects
                </button>
                <div>
                  <h2>All Projects</h2>
                  <span>Project details</span>
                </div>
              </div>
            </div>

            <div className="modal-body-scroll">
              <div className="project-detail-page-grid">
                <div className="project-detail-main-column">
                  <section className="project-detail-summary-card">
                    <p className="modal-description-lead">{selectedProjectObj.description}</p>
                    <div className="project-detail-stats-grid">
                      <div className="stat-box">
                        <span>TEAM LEAD</span>
                        <div className="lead-stat-chip">
                          <img src={selectedProjectObj.teamLeaderAvatar} alt={selectedProjectObj.teamLeader} />
                          <strong>{selectedProjectObj.teamLeader}</strong>
                        </div>
                      </div>
                      <div className="stat-box">
                        <span>OVERALL PROGRESS</span>
                        <strong>{selectedProjectObj.progress}%</strong>
                        <div className="progress-track">
                          <div className="progress-fill-emerald" style={{ width: `${selectedProjectObj.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="stat-box">
                        <span>TIMELINE</span>
                        <strong>Due: {selectedProjectObj.dueDate}</strong>
                        <small>Started: {selectedProjectObj.startDate}</small>
                      </div>
                      <div className="stat-box">
                        <span>STATUS</span>
                        <span className={`status-badge-pill ${selectedProjectObj.status.toLowerCase().replace(" ", "-")}`}>
                          {selectedProjectObj.status}
                        </span>
                      </div>
                    </div>
                  </section>

                  <h4 className="detail-section-title">Tasks in this Project</h4>
                  <div className="detail-tasks-mini-table">
                    {tasks.filter((t) => t.project === selectedProjectObj.name).map((t) => (
                      <div key={t.id} className="detail-task-row">
                        <span className="task-id-tag">{t.id}</span>
                        <strong>{t.title}</strong>
                        <span>Assignee: {t.assignedTo}</span>
                        <span className={`status-badge-pill ${t.status.toLowerCase().replace(" ", "-")}`}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <aside className="project-detail-members-column">
                  <div className="project-members-heading">
                    <div>
                      <h4>Team members</h4>
                      <span>{selectedProjectObj.members.length} members</span>
                    </div>
                    <button type="button" className="btn-primary-emerald" onClick={() => setProjectMemberSearch("")}>+ Add team member</button>
                  </div>
                  <div className="search-box-input project-member-search">
                    <span className="search-icon">⌕</span>
                    <input
                      type="search"
                      placeholder="Search member name or email"
                      value={projectMemberSearch}
                      onChange={(e) => setProjectMemberSearch(e.target.value)}
                    />
                  </div>
                  <div className="project-member-directory">
                    {teamsList.flatMap((team) => team.members).filter((member, index, all) => all.findIndex((candidate) => candidate.name === member.name) === index).filter((member) => {
                      const query = projectMemberSearch.trim().toLowerCase();
                      return !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query);
                    }).map((member) => {
                      const assigned = selectedProjectObj.members.includes(member.name);
                      return (
                        <div className="project-member-row" key={member.id}>
                          <span className="detail-member-avatar-char">{member.name.charAt(0)}</span>
                          <div><strong>{member.name}</strong><span>{member.email}</span></div>
                          {assigned ? (
                            <button type="button" onClick={() => {
                              setAssignTaskProjectId(selectedProjectObj.id);
                              setNewTaskProject(selectedProjectObj.name);
                              setSelectedProjectId(null);
                              setShowAssignTaskModal(true);
                            }}>Assign task</button>
                          ) : (
                            <button type="button" onClick={() => setProjectsList((previous) => previous.map((project) => project.id === selectedProjectObj.id ? { ...project, members: [...project.members, member.name] } : project))}>Add</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* TASK DETAILS PAGE */}
      {selectedTaskObj && (
        <section className="workspace-page-view task-detail-page-view" aria-label="Task details">
          <div className="project-detail-page-view-body">
            <div className="modal-header">
              <div className="project-details-page-heading">
                <button type="button" className="workspace-page-back" onClick={() => setSelectedTaskId(null)}>
                  <span aria-hidden="true">←</span> All Tasks
                </button>
                <div>
                  <h2>All Tasks</h2>
                  <span>Task details</span>
                </div>
              </div>
            </div>

            <div className="modal-body-scroll">
            {(isManager || isTeamLead) && canManageTask(selectedTaskObj) && (
              <div className="form-group">
                <label>Task title</label>
                <input
                  type="text"
                  value={selectedTaskObj.title}
                  onChange={(e) =>
                    setTasks((previous) =>
                      previous.map((task) =>
                        task.id === selectedTaskObj.id
                          ? { ...task, title: e.target.value }
                          : task
                      )
                    )
                  }
                />
              </div>
            )}
            <p className="modal-description-lead">{selectedTaskObj.description}</p>

              {(isManager || isTeamLead) && canManageTask(selectedTaskObj) && (
                <div className="form-group">
                  <label>Task description</label>
                  <textarea
                    rows={3}
                    value={selectedTaskObj.description}
                    onChange={(e) =>
                      setTasks((previous) =>
                        previous.map((task) =>
                          task.id === selectedTaskObj.id
                            ? { ...task, description: e.target.value }
                            : task
                        )
                      )
                    }
                  />
                </div>
              )}
              {isEmployee && selectedTaskObj.assignedTo === currentUser.name && (
                <div className="form-group">
                  <label>My task notes</label>
                  <textarea
                    rows={3}
                    placeholder="Record your progress or changes..."
                    value={selectedTaskObj.changesDescription || ""}
                    onChange={(e) =>
                      setTasks((previous) =>
                        previous.map((task) =>
                          task.id === selectedTaskObj.id
                            ? { ...task, changesDescription: e.target.value }
                            : task
                        )
                      )
                    }
                  />
                </div>
              )}

              <div className="task-detail-meta-grid">
                <div>
                  <label>Assignee</label>
                  {(isManager || isTeamLead) && canManageTask(selectedTaskObj) ? (
                    <select
                      value={selectedTaskObj.assignedTo}
                      onChange={(e) => {
                        const name = e.target.value;
                        const member = teamsList
                          .flatMap((team) => team.members)
                          .find((candidate) => candidate.name === name);
                        const lead = teamsList.find((team) => team.lead === name);
                        setTasks((previous) =>
                          previous.map((task) =>
                            task.id === selectedTaskObj.id
                              ? {
                                  ...task,
                                  assignedTo: name,
                                  assignedToAvatar: member?.avatar || lead?.leadAvatar || task.assignedToAvatar,
                                }
                              : task
                          )
                        );
                      }}
                    >
                      {[...new Set([...selectedTaskAssignees, selectedTaskObj.assignedTo])].map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="meta-assignee-box">
                      <img src={selectedTaskObj.assignedToAvatar} alt={selectedTaskObj.assignedTo} className="avatar-mini" />
                      <strong>{selectedTaskObj.assignedTo}</strong>
                    </div>
                  )}
                </div>

                <div>
                  <label>Priority</label>
                  {(isManager || isTeamLead) && canManageTask(selectedTaskObj) ? (
                    <select
                      value={selectedTaskObj.priority}
                      onChange={(e) =>
                        setTasks((previous) =>
                          previous.map((task) =>
                            task.id === selectedTaskObj.id
                              ? { ...task, priority: e.target.value as Task["priority"] }
                              : task
                          )
                        )
                      }
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  ) : (
                    <span className={`priority-badge ${selectedTaskObj.priority.toLowerCase()}`}>
                      {selectedTaskObj.priority}
                    </span>
                  )}
                </div>

                <div>
                  <label>Status</label>
                  <select
                    className="select-status-inline"
                    value={selectedTaskObj.status}
                    disabled={!canManageTask(selectedTaskObj)}
                    onChange={(e) => {
                      const newStatus = e.target.value as Task["status"];
                      setTasks((prev) =>
                        prev.map((t) => (t.id === selectedTaskObj.id ? { ...t, status: newStatus } : t))
                      );
                      setNotice(`Task ${selectedTaskObj.id} status updated to ${newStatus}.`);
                    }}
                  >
                    <option value="To do">To do</option>
                    <option value="In progress">In progress</option>
                    <option value="Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label>Time Spent</label>
                  <div className="task-timer-display-box">
                    <strong>{formatTimer(selectedTaskObj.timeSpentSeconds)}</strong>
                    <button
                      type="button"
                      className="btn-inline-timer-toggle"
                      disabled={selectedTaskObj.assignedTo !== currentUser.name}
                      onClick={() => toggleTaskTimer(selectedTaskObj.id)}
                    >
                      {runningTaskId === selectedTaskObj.id ? "⏸ Pause" : "▶ Start"}
                    </button>
                  </div>
                </div>
              </div>

              {(isManager || isTeamLead) && canManageTask(selectedTaskObj) && (
                <div className="form-group">
                  <label>Due date</label>
                  <input
                    type="text"
                    value={selectedTaskObj.due}
                    onChange={(e) =>
                      setTasks((previous) =>
                        previous.map((task) =>
                          task.id === selectedTaskObj.id
                            ? { ...task, due: e.target.value }
                            : task
                        )
                      )
                    }
                  />
                </div>
              )}

              {/* Acceptance Checklist */}
              <h4 className="detail-section-title">Acceptance Checklist</h4>
              <div className="checklist-items-wrap">
                {selectedTaskObj.acceptanceChecklist?.map((chk) => (
                  <label key={chk.id} className="checklist-label-row">
                    <input
                      type="checkbox"
                      checked={chk.completed}
                      disabled={!canManageTask(selectedTaskObj)}
                      onChange={() => {
                        setTasks((prev) =>
                          prev.map((t) =>
                            t.id === selectedTaskObj.id
                              ? {
                                  ...t,
                                  acceptanceChecklist: t.acceptanceChecklist.map((c) =>
                                    c.id === chk.id ? { ...c, completed: !c.completed } : c
                                  ),
                                }
                              : t
                          )
                        );
                      }}
                    />
                    <span className={chk.completed ? "completed-strike" : ""}>{chk.text}</span>
                  </label>
                ))}
              </div>

              {(isManager || selectedTaskObj.assignedTo === currentUser.name) && (
                <div className="form-group">
                  <label>Completion notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the work completed..."
                    value={selectedTaskObj.completionNotes || ""}
                    onChange={(e) =>
                      setTasks((previous) =>
                        previous.map((task) =>
                          task.id === selectedTaskObj.id
                            ? { ...task, completionNotes: e.target.value }
                            : task
                        )
                      )
                    }
                  />
                </div>
              )}
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedTaskId(null)}
              >
                Close
              </button>
              {isManager && (
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => {
                    if (!window.confirm(`Delete task ${selectedTaskObj.id}?`)) return;
                    setTasks((previous) =>
                      previous.filter((task) => task.id !== selectedTaskObj.id)
                    );
                    setSelectedTaskId(null);
                    setNotice(`Task ${selectedTaskObj.id} deleted.`);
                  }}
                >
                  Delete Task
                </button>
              )}
              {(isManager || selectedTaskObj.assignedTo === currentUser.name) && (
                <button
                  type="button"
                  className="btn-modal-submit"
                  onClick={() => {
                    if (!isManager && !selectedTaskObj.completionNotes?.trim()) {
                      setNotice("Add completion notes before completing this task.");
                      return;
                    }
                    setTasks((previous) =>
                      previous.map((task) =>
                        task.id === selectedTaskObj.id
                          ? { ...task, status: "Completed" }
                          : task
                      )
                    );
                    setNotice(`Task ${selectedTaskObj.id} marked as Completed.`);
                    setSelectedTaskId(null);
                  }}
                >
                  Mark Complete ✓
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TEAM DETAILS PAGE */}
      {selectedTeamObj && (
        <section className="workspace-page-view team-detail-page-view" aria-label="Team details">
          <div className="project-detail-page-view-body">
            <div className="modal-header">
              <div className="project-details-page-heading">
                <button type="button" className="workspace-page-back" onClick={() => setSelectedTeamId(null)}>
                  <span aria-hidden="true">←</span> All Teams
                </button>
                <div>
                  <h2>All Teams</h2>
                  <span>Team details</span>
                </div>
              </div>
            </div>

            <div className="modal-body-scroll">
              <div className="team-detail-overview-grid">
                <section className="team-detail-info-card">
                  <span className="team-detail-status">{selectedTeamObj.completedTasks === selectedTeamObj.totalTasks ? "Inactive" : "Active"}</span>
                  <h3># {selectedTeamObj.name}</h3>
                  <p className="team-detail-project">Project: <strong>{selectedTeamObj.project}</strong></p>
                  <p className="team-detail-description">{selectedTeamObj.description}</p>
                  <div className="team-detail-lead">
                    <span className="team-detail-avatar">
                      {selectedTeamObj.lead.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      <i />
                    </span>
                    <div>
                      <small>Team Lead</small>
                      <strong>{selectedTeamObj.lead}</strong>
                      <span>{selectedTeamObj.leadEmail}</span>
                    </div>
                  </div>
                  <div className="team-detail-stat-grid">
                    <div><span>Total Tasks</span><strong>{selectedTeamObj.totalTasks}</strong></div>
                    <div><span>Completed</span><strong>{selectedTeamObj.completedTasks}</strong></div>
                    <div><span>Members</span><strong>{selectedTeamObj.members.length}</strong></div>
                  </div>
                </section>

                <section className="team-detail-members-card">
                  <h4>Members &amp; Active Status</h4>
                  {selectedTeamObj.members.map((member) => (
                    <div className="team-detail-member-row" key={member.id}>
                      <span className="team-detail-avatar">
                        {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        <i />
                      </span>
                      <div>
                        <strong>{member.name}</strong>
                        <span>{member.status === "Active" ? "Active now" : member.status}</span>
                      </div>
                      <small>{member.activeTasks} {member.activeTasks === 1 ? "task" : "tasks"}</small>
                      {isManager && (
                        <button
                          type="button"
                          className="team-detail-remove-member"
                          onClick={() => removeTeamMember(selectedTeamObj, member)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </section>
              </div>

              {isManager && (
                <div className="team-detail-actions">
                  <button
                    type="button"
                    className="btn-team-secondary"
                    onClick={() => addTeamMember(selectedTeamObj)}
                  >
                    + Add Member
                  </button>
                  <button
                    type="button"
                    className="btn-team-secondary"
                    onClick={() => changeTeamLead(selectedTeamObj)}
                  >
                    Change Team Lead
                  </button>
                </div>
              )}
              <section className="team-detail-task-card">
                <h4>Members &amp; Active Tasks</h4>
                <table className="team-detail-task-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Task</th>
                      <th>Assigned by</th>
                      <th>Time spent</th>
                      <th>Status</th>
                      <th aria-label="Open task" />
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.filter((task) => task.project === selectedTeamObj.project).map((task) => (
                      <tr key={task.id} onClick={() => setSelectedTaskId(task.id)}>
                        <td>
                          <div className="team-detail-table-person">
                            <span className="team-detail-avatar small">
                              {task.assignedTo.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                              <i />
                            </span>
                            <strong>{task.assignedTo}</strong>
                          </div>
                        </td>
                        <td><strong>{task.title}</strong></td>
                        <td>{task.assignedBy}</td>
                        <td>{formatTimer(task.timeSpentSeconds).replace(/^(00:)/, "")}</td>
                        <td><span className={`team-task-status ${task.status.toLowerCase().replace(/\s+/g, "-")}`}>{task.status}</span></td>
                        <td><span className="team-task-open">›</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}