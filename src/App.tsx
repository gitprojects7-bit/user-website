import { useEffect, useState, useMemo } from "react";
import type { FormEvent } from "react";

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
  | "Settings";

export type AuthStep =
  | "welcome"
  | "portal-select"
  | "signin"
  | "signup-profile"
  | "verify-phone"
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

// The signed-in Team Lead / Employee demo user (one person, two views)
const LEAD_USER = "Arun Patel";

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

  // Form Inputs for Auth
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
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
  const [pageHistory, setPageHistory] = useState<PageName[]>([]);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Visual Atmosphere
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  // Core Data States
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(initialProjects);
  const [teamsList, setTeamsList] = useState<TeamData[]>(initialTeams);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [boardCards, setBoardCards] = useState<BoardCard[]>(initialBoardCards);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>(initialDirectMessages);
  const [timeLogs, setTimeLogs] = useState<TimeLogEntry[]>(initialTimeLogs);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Active Chats
  const [activeChannelId, setActiveChannelId] = useState<string>("alpha-engineering");
  const [chatInputText, setChatInputText] = useState<string>("");
  const [activeDmContactId, setActiveDmContactId] = useState<string>("arun-patel");
  const [dmInputText, setDmInputText] = useState<string>("");

  // Modals & Drawers
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState<boolean>(false);
  const [assignTaskPreselectedProject, setAssignTaskPreselectedProject] = useState<string>("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Filter States
  const [projectSearch, setProjectSearch] = useState<string>("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>("all");
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

  // Determine current user profile based on portal and workspace
  const currentUser = useMemo(() => {
    if (portalRole === "admin") {
      return {
        name: "Admin Director",
        email: "admin@workflow.internal",
        role: "System Administrator",
        initials: "AD",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      };
    }
    if (leadWorkspace === "lead") {
      return {
        name: "Arun Patel",
        email: "arun.patel@workflow.internal",
        role: "Lead · Alpha & Analytics",
        initials: "AP",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      };
    }
    return {
      name: "Arun Patel",
      email: "arun.patel@workflow.internal",
      role: "Team Member",
      initials: "AP",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    };
  }, [portalRole, leadWorkspace]);

  // Navigation items mapping
  const adminMenuItems: { label: PageName; icon: string }[] = [
    { label: "Dashboard", icon: "▦" },
    { label: "All Projects", icon: "🗂" },
    { label: "All Tasks", icon: "✓" },
    { label: "All Teams", icon: "👥" },
    { label: "Team Board", icon: "▤" },
    { label: "Group Chat", icon: "💬" },
    { label: "Direct Chat", icon: "✉" },
    { label: "Notifications", icon: "♢" },
  ];

  const leadMenuItems: { label: PageName; icon: string }[] = [
    { label: "Dashboard", icon: "▦" },
    { label: "My Projects", icon: "🗂" },
    { label: "My Teams", icon: "👥" },
    { label: "Team Tasks", icon: "✓" },
    { label: "Team Progress", icon: "📈" },
    { label: "Notifications", icon: "♢" },
  ];

  const employeeMenuItems: { label: PageName; icon: string }[] = [
    { label: "Dashboard", icon: "▦" },
    { label: "My Projects", icon: "🗂" },
    { label: "My Team", icon: "👥" },
    { label: "My Tasks", icon: "✓" },
    { label: "Notifications", icon: "♢" },
  ];

  const currentMenuItems = useMemo(() => {
    if (portalRole === "admin") return adminMenuItems;
    return leadWorkspace === "lead" ? leadMenuItems : employeeMenuItems;
  }, [portalRole, leadWorkspace]);

  // Filtered Projects based on Role / Workspace
  const visibleProjects = useMemo(() => {
    let list = projectsList;
    if (portalRole === "lead_employee") {
      if (leadWorkspace === "lead") {
        // Team Lead sees only projects where they are assigned as Team Lead
        // Lead sees ONLY projects the admin assigned to them as Team Lead
        list = list.filter((p) => p.teamLeader === LEAD_USER);
      } else {
        // As a team member: only projects where they have tasks assigned to them
        const memberProjects = new Set(
          tasks.filter((t) => t.assignedTo === LEAD_USER).map((t) => t.project)
        );
        list = list.filter((p) => memberProjects.has(p.name) && p.teamLeader !== LEAD_USER);
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
  }, [projectsList, tasks, portalRole, leadWorkspace, projectSearch, projectStatusFilter]);

  // Filtered Teams based on Role / Workspace
  const visibleTeams = useMemo(() => {
    let list = teamsList;
    if (portalRole === "lead_employee") {
      if (leadWorkspace === "lead") {
        // Lead sees only teams they manage
        const ledProjects = new Set(projectsList.filter((p) => p.teamLeader === LEAD_USER).map((p) => p.name));
        list = list.filter((t) => t.lead === LEAD_USER || ledProjects.has(t.project));
      } else {
        const memberProjects = new Set(
          tasks.filter((t) => t.assignedTo === LEAD_USER).map((t) => t.project)
        );
        list = list.filter((t) => memberProjects.has(t.project) && t.lead !== LEAD_USER);
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
  }, [teamsList, projectsList, tasks, portalRole, leadWorkspace, teamSearch]);

  // Filtered Tasks based on Role / Workspace
  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (portalRole === "lead_employee") {
      if (leadWorkspace === "lead") {
        // Team tasks in Arun's projects or assigned by Arun
        // Only tasks inside projects the admin assigned to this lead
        const ledProjects = new Set(projectsList.filter((p) => p.teamLeader === LEAD_USER).map((p) => p.name));
        list = list.filter((t) => ledProjects.has(t.project));
      } else {
        // As a team member: tasks assigned directly to them
        list = list.filter((t) => t.assignedTo === LEAD_USER);
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
  }, [tasks, projectsList, portalRole, leadWorkspace, taskSearch, taskPriorityFilter, taskStatusFilter]);

  // Navigation Helper
  const navigateTo = (page: PageName) => {
    if (page === activePage) return;
    setPageHistory((prev) => [...prev, activePage]);
    setActivePage(page);
    setProfileOpen(false);
    setSearch("");
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const previous = pageHistory[pageHistory.length - 1];
      setPageHistory((prev) => prev.slice(0, -1));
      if (previous) setActivePage(previous);
    } else if (activePage !== "Dashboard") {
      setActivePage("Dashboard");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthStep("portal-select");
    setLoginId("");
    setPassword("");
    setActivePage("Dashboard");
    setPageHistory([]);
    setNotice("");
    setRunningTaskId(null);
  };

  // Sign In Handler
  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || password.length < 3) {
      setNotice("Please enter a valid username/email and password (min 3 chars).");
      return;
    }
    setIsLoggedIn(true);
    setActivePage("Dashboard");
    setNotice("");
  };

  // Quick Demo Login
  const loginAsDemo = (role: PortalRole, ws: LeadWorkspace = "lead", id: string = "") => {
    setPortalRole(role);
    setLeadWorkspace(ws);
    setLoginId(id);
    setPassword("demo123");
    setIsLoggedIn(true);
    setActivePage("Dashboard");
    setNotice("");
  };

  // Toggle Timer on a Task
  const toggleTaskTimer = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (runningTaskId === taskId) {
      setRunningTaskId(null);
      setNotice(`Timer paused for ${taskId}.`);
    } else {
      setRunningTaskId(taskId);
      setNotice(`Timer running on ${taskId}.`);
    }
  };

  // Create Project Form Submit
  const handleCreateProject = (e: FormEvent) => {
    e.preventDefault();
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
    if (!newTaskTitle.trim()) {
      setNotice("Please provide a task title.");
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
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNotice(`Task ${createdTask.id} assigned to ${newTaskAssignee}.`);
  };

  // Send Group Chat Message
  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    const msg: ChatMessage = {
      id: `cm-${Date.now()}`,
      sender: currentUser.name,
      senderInitials: currentUser.initials,
      text: chatInputText.trim(),
      time: "Just now",
      isSelf: true,
    };
    setChatMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), msg],
    }));
    setChatInputText("");
  };

  // Send Direct Message
  const handleSendDirectMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!dmInputText.trim()) return;
    const msg: ChatMessage = {
      id: `dm-${Date.now()}`,
      sender: currentUser.name,
      senderInitials: currentUser.initials,
      text: dmInputText.trim(),
      time: "Just now",
      isSelf: true,
    };
    setDirectMessages((prev) => ({
      ...prev,
      [activeDmContactId]: [...(prev[activeDmContactId] || []), msg],
    }));
    setDmInputText("");
  };

  // Task Selected for View Details
  const selectedTaskObj = tasks.find((t) => t.id === selectedTaskId);
  // Project Selected for View Details
  const selectedProjectObj = projectsList.find((p) => p.id === selectedProjectId);
  // Team Selected for View Details
  const selectedTeamObj = teamsList.find((t) => t.id === selectedTeamId);

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
                  setAuthStep("portal-select");
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
                  {authStep === "portal-select"
                    ? "CHOOSE YOUR ROLE"
                    : authStep === "signup-profile" || authStep === "verify-phone" || authStep === "signup-credentials"
                    ? "GET STARTED"
                    : portalRole === "admin"
                    ? "ADMIN"
                    : "TEAM LEAD / EMPLOYEE"}
                </span>
                <h2>
                  {authStep === "portal-select"
                    ? "Who are you?"
                    : authStep === "signin"
                    ? "Welcome Back"
                    : authStep === "signup-profile"
                    ? "Create your account"
                    : authStep === "verify-phone"
                    ? "Verify your phone"
                    : authStep === "signup-credentials"
                    ? "Set your password"
                    : "Reset Password"}
                </h2>
                <p className="subtitle">
                  {authStep === "portal-select"
                    ? "Select Admin or Team Lead / Employee to continue."
                    : authStep === "signin"
                    ? `Sign in with your credentials to enter ${
                        portalRole === "admin" ? "the Admin console" : "your team dashboard"
                      }.`
                    : authStep === "signup-profile"
                    ? "Tell us a little about yourself to get started."
                    : authStep === "verify-phone"
                    ? `We sent a 6-digit code to ${signupPhone || "your phone"}. (Demo code: 123456)`
                    : authStep === "signup-credentials"
                    ? "Choose a secure password to finish creating your account."
                    : "Enter your registered email to receive reset instructions."}
                </p>

                {notice && <div className="auth-notice-banner">{notice}</div>}
              </div>

              {/* 1. PORTAL SELECTION STEP (2 PORTALS) */}
              {authStep === "portal-select" && (
                <div className="portal-selection-container">
                  <div className="portal-cards-list two-portals">
                    {/* Portal 1: Admin */}
                    <button
                      type="button"
                      className={`portal-role-card ${portalRole === "admin" ? "active" : ""}`}
                      onClick={() => {
                        setPortalRole("admin");
                        setLoginId("admin@workflow.internal");
                        setPassword("demo123");
                        setAuthStep("signin");
                      }}
                    >
                      <div className="portal-card-top">
                        <div className="portal-icon-wrapper admin">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18" />
                            <path d="M9 21V9" />
                          </svg>
                        </div>
                        <span className="portal-tag admin">FULL ACCESS</span>
                      </div>
                      <div className="portal-card-info">
                        <h3>Admin</h3>
                        <p>Complete control — create projects, assign leads and members, manage all teams, tasks, and communications.</p>
                      </div>
                      <div className="portal-card-action">
                        <span>Continue to Admin Sign in</span>
                        <span className="action-arrow">→</span>
                      </div>
                    </button>

                    {/* Portal 2: Team Lead or Employee */}
                    <button
                      type="button"
                      className={`portal-role-card ${portalRole === "lead_employee" ? "active" : ""}`}
                      onClick={() => {
                        setPortalRole("lead_employee");
                        setLoginId("arun.patel@workflow.internal");
                        setPassword("demo123");
                        setAuthStep("signin");
                      }}
                    >
                      <div className="portal-card-top">
                        <div className="portal-icon-wrapper lead-employee">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <span className="portal-tag lead-employee">LEAD + EMPLOYEE</span>
                      </div>
                      <div className="portal-card-info">
                        <h3>Team Lead or Employee</h3>
                        <p>One login, two views: see projects you lead and the tasks assigned to you.</p>
                      </div>
                      <div className="portal-card-action">
                        <span>Continue to Sign in</span>
                        <span className="action-arrow">→</span>
                      </div>
                    </button>
                  </div>

                  {/* Quick Demo Accounts Helper */}
                  <div className="demo-accounts-helper">
                    <span className="demo-helper-title">Quick Demo Logins (1-Click)</span>
                    <div className="demo-chips-row">
                      <button
                        type="button"
                        className="demo-chip-btn"
                        onClick={() => loginAsDemo("admin", "lead", "admin@workflow.internal")}
                      >
                        ⚡ Admin Console
                      </button>
                      <button
                        type="button"
                        className="demo-chip-btn"
                        onClick={() => loginAsDemo("lead_employee", "lead", "arun.patel@workflow.internal")}
                      >
                        👑 Team Lead (Arun)
                      </button>
                      <button
                        type="button"
                        className="demo-chip-btn"
                        onClick={() => loginAsDemo("lead_employee", "employee", "arun.patel@workflow.internal")}
                      >
                        💼 Employee (Arun)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SIGN IN STEP */}
              {authStep === "signin" && (
                <form onSubmit={handleSignIn} className="auth-form">
                  <div className="form-group">
                    <label>Email or Username</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin@workflow.internal or arun.patel"
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
                        placeholder="••••••••"
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

                  <div className="auth-footer-links">
                    <button
                      type="button"
                      className="link-btn-secondary"
                      onClick={() => setAuthStep("portal-select")}
                    >
                      ← Change role
                    </button>
                  </div>
                </form>
              )}

              {/* 2b. CREATE ACCOUNT — PROFILE */}
              {authStep === "signup-profile" && (
                <form
                  className="auth-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNotice("");
                    setAuthStep("verify-phone");
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
                    <label>Email address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9+\s-]{7,15}"
                      placeholder="Enter your phone number"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary-auth btn-arrow">
                    <span>Continue to phone verification</span>
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

              {/* 2c. CREATE ACCOUNT — VERIFY PHONE */}
              {authStep === "verify-phone" && (
                <form
                  className="auth-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (signupOtp.trim().length !== 6) {
                      setNotice("Please enter the 6-digit code (demo: 123456).");
                      return;
                    }
                    setNotice("");
                    setAuthStep("signup-credentials");
                  }}
                >
                  <div className="form-group">
                    <label>Verification code</label>
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
                    <span>Verify phone</span>
                    <span aria-hidden="true">⟶</span>
                  </button>
                  <div className="auth-footer-links">
                    <button type="button" className="link-btn-secondary" onClick={() => setAuthStep("signup-profile")}>
                      ← Edit details
                    </button>
                  </div>
                </form>
              )}

              {/* 2d. CREATE ACCOUNT — CREDENTIALS */}
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
                    <button type="button" className="link-btn-secondary" onClick={() => setAuthStep("verify-phone")}>
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
    <main className="app-shell green-black-theme">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <span className="brand-logo" aria-label="Team">
            <TeamIcon />
          </span>
          <div>
            <strong>WORK FLOW</strong>
            <small>ENTERPRISE SUITE</small>
          </div>
        </div>

        {/* Portal Pill Indicator */}
        <div className={`sidebar-portal-badge ${portalRole}`}>
          <span className="portal-dot"></span>
          <span>{portalRole === "admin" ? "ADMIN CONSOLE" : "TEAM LEAD / EMPLOYEE"}</span>
        </div>

        {/* WORKSPACE SWITCHER: ONLY FOR TEAM LEAD OR EMPLOYEE PORTAL */}
        {portalRole === "lead_employee" && (
          <div className="workspace-switcher-section">
            <span className="ws-section-label">CURRENT VIEW</span>
            <div className="ws-toggle-pill-wrap">
              <button
                type="button"
                className={`ws-toggle-pill ${leadWorkspace === "lead" ? "active" : ""}`}
                onClick={() => {
                  setLeadWorkspace("lead");
                  setActivePage("Dashboard");
                  setNotice("Switched to Team Lead view");
                }}
              >
                <span className="ws-icon">👑</span>
                <span>Lead</span>
              </button>
              <button
                type="button"
                className={`ws-toggle-pill ${leadWorkspace === "employee" ? "active" : ""}`}
                onClick={() => {
                  setLeadWorkspace("employee");
                  setActivePage("Dashboard");
                  setNotice("Switched to Employee view");
                }}
              >
                <span className="ws-icon">💼</span>
                <span>Employee</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {currentMenuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${activePage === item.label ? "selected" : ""}`}
              onClick={() => navigateTo(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activePage === item.label && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="sidebar-user">
          <img src={currentUser.avatar} alt={currentUser.name} className="sidebar-user-avatar" />
          <div className="sidebar-user-info">
            <strong>{currentUser.name}</strong>
            <small>{currentUser.role}</small>
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

      {/* WORKSPACE CONTENT AREA */}
      <section className="workspace">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-title">
            <button
              type="button"
              className="back-button"
              onClick={goBack}
              title="Go back"
            >
              ←
            </button>
            <div>
              <h1>{activePage}</h1>
              <p>
                {portalRole === "admin"
                  ? "Admin · Full organization visibility"
                  : leadWorkspace === "lead"
                  ? "Team Lead view · Oversee teams, assign deliverables, and review progress"
                  : "Employee view · Personal tasks, active timers, and team deliverables"}
              </p>
            </div>
          </div>

          <div className="topbar-actions">
            {/* Live Timer Alert if running */}
            {runningTaskId && (
              <div className="topbar-timer-alert pulse-green">
                <span className="timer-dot"></span>
                <span>
                  Timer active on <strong>{runningTaskId}</strong>:{" "}
                  {formatTimer(tasks.find((t) => t.id === runningTaskId)?.timeSpentSeconds || 0)}
                </span>
                <button
                  type="button"
                  className="btn-pause-inline"
                  onClick={() => setRunningTaskId(null)}
                >
                  Pause
                </button>
              </div>
            )}

            {/* Notifications Shortcut */}
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={() => navigateTo("Notifications")}
              title="Notifications"
            >
              <span className="bell-icon">♢</span>
              {notifications.some((n) => n.unread) && <span className="badge-dot"></span>}
            </button>

            {/* Profile Dropdown Toggle */}
            <div className="topbar-profile-wrap">
              <button
                type="button"
                className="profile-btn-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="topbar-avatar" />
                <span className="topbar-user-name">{currentUser.name}</span>
                <span className="caret-arrow">▾</span>
              </button>

              {profileOpen && (
                <div className="topbar-dropdown-menu">
                  <div className="dropdown-user-header">
                    <strong>{currentUser.name}</strong>
                    <small>{currentUser.email}</small>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      navigateTo("Notifications");
                      setProfileOpen(false);
                    }}
                  >
                    Notifications ({notifications.filter((n) => n.unread).length})
                  </button>
                  <button
                    type="button"
                    className="dropdown-item logout"
                    onClick={logout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

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
          {/* 1. DASHBOARD */}
          {activePage === "Dashboard" && (
            <div className="dashboard-content-page">
              {/* Top Stats Cards */}
              <div className="stats-grid-row">
                {portalRole === "admin" ? (
                  <>
                    <div className="metric-kpi-card green-accent">
                      <div className="kpi-top">
                        <span>TOTAL PROJECTS</span>
                        <span className="kpi-icon">🗂</span>
                      </div>
                      <strong className="kpi-value">{projectsList.length}</strong>
                      <small className="kpi-subtext">4 active teams participating</small>
                    </div>
                    <div className="metric-kpi-card dark-accent">
                      <div className="kpi-top">
                        <span>ORGANIZATION TEAMS</span>
                        <span className="kpi-icon">👥</span>
                      </div>
                      <strong className="kpi-value">{teamsList.length}</strong>
                      <small className="kpi-subtext">11 engineers assigned</small>
                    </div>
                    <div className="metric-kpi-card green-accent">
                      <div className="kpi-top">
                        <span>ACTIVE TASKS</span>
                        <span className="kpi-icon">✓</span>
                      </div>
                      <strong className="kpi-value">
                        {tasks.filter((t) => t.status !== "Completed").length}
                      </strong>
                      <small className="kpi-subtext">Across all sprints</small>
                    </div>
                    <div className="metric-kpi-card dark-accent">
                      <div className="kpi-top">
                        <span>COMPLETED TASKS</span>
                        <span className="kpi-icon">★</span>
                      </div>
                      <strong className="kpi-value">
                        {tasks.filter((t) => t.status === "Completed").length + 24}
                      </strong>
                      <small className="kpi-subtext">94% velocity completion</small>
                    </div>
                  </>
                ) : leadWorkspace === "lead" ? (
                  <>
                    <div className="metric-kpi-card green-accent">
                      <div className="kpi-top">
                        <span>ASSIGNED PROJECTS</span>
                        <span className="kpi-icon">🗂</span>
                      </div>
                      <strong className="kpi-value">{visibleProjects.length}</strong>
                      <small className="kpi-subtext">Billing Platform & Analytics</small>
                    </div>
                    <div className="metric-kpi-card dark-accent">
                      <div className="kpi-top">
                        <span>TEAM MEMBERS</span>
                        <span className="kpi-icon">👥</span>
                      </div>
                      <strong className="kpi-value">6</strong>
                      <small className="kpi-subtext">Alpha & Analytics squads</small>
                    </div>
                    <div className="metric-kpi-card green-accent">
                      <div className="kpi-top">
                        <span>TEAM TASKS IN PROGRESS</span>
                        <span className="kpi-icon">⚡</span>
                      </div>
                      <strong className="kpi-value">
                        {tasks.filter((t) => t.status === "In progress").length}
                      </strong>
                      <small className="kpi-subtext">On track for sprint delivery</small>
                    </div>
                    <div className="metric-kpi-card dark-accent">
                      <div className="kpi-top">
                        <span>PENDING REVIEWS</span>
                        <span className="kpi-icon">◷</span>
                      </div>
                      <strong className="kpi-value">2</strong>
                      <small className="kpi-subtext">Awaiting lead sign-off</small>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="metric-kpi-card green-accent">
                      <div className="kpi-top">
                        <span>MY ASSIGNED TASKS</span>
                        <span className="kpi-icon">✓</span>
                      </div>
                      <strong className="kpi-value">{visibleTasks.length}</strong>
                      <small className="kpi-subtext">2 priority tasks due soon</small>
                    </div>
                    <div className="metric-kpi-card dark-accent">
                      <div className="kpi-top">
                        <span>IN PROGRESS</span>
                        <span className="kpi-icon">⚡</span>
                      </div>
                      <strong className="kpi-value">
                        {visibleTasks.filter((t) => t.status === "In progress").length}
                      </strong>
                      <small className="kpi-subtext">Timer tracking available</small>
                    </div>
                    <div className="metric-kpi-card green-accent">
                      <div className="kpi-top">
                        <span>HOURS LOGGED TODAY</span>
                        <span className="kpi-icon">◷</span>
                      </div>
                      <strong className="kpi-value">4h 25m</strong>
                      <small className="kpi-subtext">Across 2 sprint deliverables</small>
                    </div>
                    <div className="metric-kpi-card dark-accent">
                      <div className="kpi-top">
                        <span>COMPLETED SPRINTS</span>
                        <span className="kpi-icon">★</span>
                      </div>
                      <strong className="kpi-value">12</strong>
                      <small className="kpi-subtext">100% acceptance rate</small>
                    </div>
                  </>
                )}
              </div>

              {/* Middle Section: Quick Actions & Highlights */}
              <div className="dashboard-grid-two-col">
                {/* Left Card: Active Focus */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3>{portalRole === "admin" ? "Projects Overview" : leadWorkspace === "lead" ? "Team Deliverables" : "My Current Priority"}</h3>
                    <button
                      type="button"
                      className="dash-link-action"
                      onClick={() => navigateTo(portalRole === "admin" ? "All Projects" : "My Projects")}
                    >
                      View All →
                    </button>
                  </div>
                  <div className="dash-card-body">
                    {visibleProjects.slice(0, 3).map((proj) => (
                      <div key={proj.id} className="dash-proj-row" onClick={() => setSelectedProjectId(proj.id)}>
                        <div className="dash-proj-info">
                          <strong>{proj.name}</strong>
                          <span className="dash-proj-team">{proj.team} · Lead: {proj.teamLeader}</span>
                        </div>
                        <div className="dash-proj-progress">
                          <div className="proj-progress-bar">
                            <div className="proj-progress-fill" style={{ width: `${proj.progress}%` }}></div>
                          </div>
                          <span className="proj-pct">{proj.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Quick Actions & Recent Tasks */}
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3>{portalRole === "admin" ? "Admin Quick Actions" : leadWorkspace === "lead" ? "Lead Controls" : "My Task Queue"}</h3>
                    <button
                      type="button"
                      className="dash-link-action"
                      onClick={() => navigateTo(portalRole === "admin" ? "All Tasks" : leadWorkspace === "lead" ? "Team Tasks" : "My Tasks")}
                    >
                      Task Center →
                    </button>
                  </div>
                  <div className="dash-card-body">
                    <div className="quick-action-buttons-row">
                      {portalRole === "admin" && (
                        <>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => setShowCreateProjectModal(true)}
                          >
                            + Create Project
                          </button>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => setShowAssignTaskModal(true)}
                          >
                            + Assign Task
                          </button>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => navigateTo("Team Board")}
                          >
                            ▤ Team Board
                          </button>
                        </>
                      )}
                      {portalRole === "lead_employee" && leadWorkspace === "lead" && (
                        <>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => setShowAssignTaskModal(true)}
                          >
                            + Assign Task
                          </button>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => navigateTo("My Teams")}
                          >
                            👥 My Teams
                          </button>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => navigateTo("Team Progress")}
                          >
                            📈 Team Progress
                          </button>
                        </>
                      )}
                      {portalRole === "lead_employee" && leadWorkspace === "employee" && (
                        <>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => navigateTo("My Tasks")}
                          >
                            ✓ Open Task List
                          </button>
                          <button
                            type="button"
                            className="btn-quick-action"
                            onClick={() => navigateTo("My Team")}
                          >
                            👥 Contact Team
                          </button>
                        </>
                      )}
                    </div>

                    <div className="recent-tasks-mini-list">
                      {visibleTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="mini-task-item"
                          onClick={() => setSelectedTaskId(task.id)}
                        >
                          <div className="mini-task-left">
                            <span className={`priority-indicator ${task.priority.toLowerCase()}`}></span>
                            <div>
                              <strong>{task.title}</strong>
                              <small>{task.project} · Due {task.due}</small>
                            </div>
                          </div>
                          <span className={`status-pill-small ${task.status.toLowerCase().replace(" ", "-")}`}>
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ALL PROJECTS & MY PROJECTS (GRID VIEW!) */}
          {(activePage === "All Projects" || activePage === "My Projects") && (
            <div className="projects-view-page">
              {/* Action Bar */}
              <div className="view-action-bar">
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
                  <div className="filter-pill-group">
                    {["all", "In Progress", "Pending", "Completed"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`filter-pill-btn ${projectStatusFilter === st ? "active" : ""}`}
                        onClick={() => setProjectStatusFilter(st)}
                      >
                        {st === "all" ? "All Statuses" : st}
                      </button>
                    ))}
                  </div>
                </div>

                {portalRole === "admin" && (
                  <button
                    type="button"
                    className="btn-primary-emerald"
                    onClick={() => setShowCreateProjectModal(true)}
                  >
                    + Create Project
                  </button>
                )}
              </div>

              {/* GRID VIEW FOR PROJECTS */}
              <div className="projects-grid-layout">
                {visibleProjects.map((project) => (
                  <div key={project.id} className="project-grid-card">
                    <div className="proj-card-top-row">
                      <span className="proj-team-badge">{project.team}</span>
                      <span className={`status-badge-pill ${project.status.toLowerCase().replace(" ", "-")}`}>
                        {project.status}
                      </span>
                    </div>

                    <h3 className="proj-card-title">{project.name}</h3>
                    <p className="proj-card-description">{project.description}</p>

                    {/* Progress Bar */}
                    <div className="proj-progress-section">
                      <div className="proj-progress-header">
                        <span>Milestone Progress</span>
                        <strong>{project.progress}%</strong>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill-emerald" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Team Lead & Member Avatars */}
                    <div className="proj-lead-row">
                      <div className="lead-chip">
                        <img src={project.teamLeaderAvatar} alt={project.teamLeader} className="lead-avatar-tiny" />
                        <span>Lead: <strong>{project.teamLeader}</strong></span>
                      </div>
                      <div className="member-avatar-cluster">
                        {project.memberAvatars.map((av, idx) => (
                          <img key={idx} src={av} alt="Member" className="cluster-avatar" />
                        ))}
                        {project.membersExtra && (
                          <span className="cluster-avatar-extra">+{project.membersExtra}</span>
                        )}
                      </div>
                    </div>

                    {portalRole === "admin" && (
                      <label className="assign-lead-row" onClick={(e) => e.stopPropagation()}>
                        <span>Assign Team Lead</span>
                        <select
                          value={project.teamLeader}
                          onChange={(e) => {
                            const lead = e.target.value;
                            setProjectsList((prev) =>
                              prev.map((p) =>
                                p.id === project.id
                                  ? { ...p, teamLeader: lead, members: p.members.includes(lead) ? p.members : [lead, ...p.members] }
                                  : p
                              )
                            );
                            setNotice(`${lead} is now Team Lead of ${project.name}.`);
                          }}
                        >
                          {Array.from(new Set(["Arun Patel", "Priya Sharma", "Maya Chen", project.teamLeader])).map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </label>
                    )}

                    {/* Card Footer */}
                    <div className="proj-card-footer">
                      <div className="proj-meta-due">
                        <span>📅 Due: {project.dueDate}</span>
                        <span>✓ {project.completedTasks}/{project.totalTasks} tasks</span>
                      </div>
                      <button
                        type="button"
                        className="btn-view-details-card"
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
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

                {(portalRole === "admin" || leadWorkspace === "lead") && (
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
                              {activePage === "My Tasks" && (
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

              {/* GRID VIEW FOR TEAMS */}
              <div className="teams-grid-layout">
                {visibleTeams.map((team) => (
                  <div key={team.id} className="team-grid-card">
                    <div className="team-card-header">
                      <div>
                        <span className="team-project-chip">Project: {team.project}</span>
                        <h3 className="team-card-title">{team.name}</h3>
                      </div>
                      <span className="team-members-count-badge">
                        {team.members.length} Members
                      </span>
                    </div>

                    <p className="team-card-description">{team.description}</p>

                    {/* Team Lead Row */}
                    <div className="team-lead-strip">
                      <img src={team.leadAvatar} alt={team.lead} className="lead-strip-avatar" />
                      <div className="lead-strip-info">
                        <span className="lead-strip-title">TEAM LEAD</span>
                        <strong>{team.lead}</strong>
                        <small>{team.leadEmail}</small>
                      </div>
                    </div>

                    {/* Members with active task count */}
                    <div className="team-members-roster-preview">
                      <span className="roster-preview-heading">Members & Active Tasks:</span>
                      <div className="roster-list-chips">
                        {team.members.map((m) => (
                          <div key={m.id} className="member-task-chip">
                            <img src={m.avatar} alt={m.name} className="m-chip-avatar" />
                            <span className="m-chip-name">{m.name}</span>
                            <span className="m-chip-task-count">({m.activeTasks} tasks)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Metrics Summary */}
                    <div className="team-metrics-row">
                      <span>⚡ Total Tasks: <strong>{team.totalTasks}</strong></span>
                      <span>✓ Completed: <strong>{team.completedTasks}</strong></span>
                    </div>

                    {/* Actions */}
                    <div className="team-card-actions">
                      <button
                        type="button"
                        className="btn-team-secondary"
                        onClick={() => setSelectedTeamId(team.id)}
                      >
                        View Team Details
                      </button>

                      {(portalRole === "admin" || leadWorkspace === "lead") && (
                        <button
                          type="button"
                          className="btn-team-assign"
                          onClick={() => {
                            setNewTaskProject(team.project);
                            setNewTaskAssignee(team.members[0]?.name || "Rahul Varma");
                            setShowAssignTaskModal(true);
                          }}
                        >
                          Assign Task
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
                  <input
                    type="text"
                    placeholder={`Message #${activeChannelId}...`}
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                  />
                  <button type="submit" className="btn-chat-send">
                    Send
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
                  <input
                    type="text"
                    placeholder="Type a direct message..."
                    value={dmInputText}
                    onChange={(e) => setDmInputText(e.target.value)}
                  />
                  <button type="submit" className="btn-chat-send">
                    Send
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
                {(initialTeams[0]?.members ?? []).map((member) => (
                  <div key={member.id} className="member-progress-card">
                    <div className="mp-header">
                      <img src={member.avatar} alt={member.name} className="mp-avatar" />
                      <div>
                        <strong>{member.name}</strong>
                        <small>{member.role}</small>
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
                    {timeLogs.map((log) => (
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

          {/* 10. NOTIFICATIONS */}
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
        <div className="modal-overlay" onClick={() => setShowAssignTaskModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign New Task</h3>
              <button type="button" className="close-btn" onClick={() => setShowAssignTaskModal(false)}>×</button>
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
                    onChange={(e) => setNewTaskProject(e.target.value)}
                  >
                    {projectsList.map((p) => (
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
                    <option value="Rahul Varma">Rahul Varma (Frontend Dev)</option>
                    <option value="Sneha Rao">Sneha Rao (Backend Dev)</option>
                    <option value="Alex Morgan">Alex Morgan (QA Dev)</option>
                    <option value="Vikram Malhotra">Vikram Malhotra (Mobile Dev)</option>
                    <option value="Daniel Lee">Daniel Lee (Ops Specialist)</option>
                    <option value="Chloe Bennett">Chloe Bennett (Data Analyst)</option>
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
                  onClick={() => setShowAssignTaskModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Assign Task →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT DETAILS MODAL */}
      {selectedProjectObj && (
        <div className="modal-overlay" onClick={() => setSelectedProjectId(null)}>
          <div className="modal-dialog large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-sub-tag">{selectedProjectObj.team}</span>
                <h2>{selectedProjectObj.name}</h2>
              </div>
              <button type="button" className="close-btn" onClick={() => setSelectedProjectId(null)}>×</button>
            </div>

            <div className="modal-body-scroll">
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

              <h4 className="detail-section-title">Assigned Team Members</h4>
              <div className="detail-members-row">
                {selectedProjectObj.members.map((name, i) => (
                  <div key={i} className="detail-member-pill">
                    <span className="detail-member-avatar-char">{name.charAt(0)}</span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>

              <h4 className="detail-section-title">Tasks in this Project</h4>
              <div className="detail-tasks-mini-table">
                {tasks
                  .filter((t) => t.project === selectedProjectObj.name)
                  .map((t) => (
                    <div key={t.id} className="detail-task-row">
                      <span className="task-id-tag">{t.id}</span>
                      <strong>{t.title}</strong>
                      <span>Assignee: {t.assignedTo}</span>
                      <span className={`status-badge-pill ${t.status.toLowerCase().replace(" ", "-")}`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedProjectId(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASK DETAILS MODAL */}
      {selectedTaskObj && (
        <div className="modal-overlay" onClick={() => setSelectedTaskId(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-sub-tag">{selectedTaskObj.id} · {selectedTaskObj.project}</span>
                <h2>{selectedTaskObj.title}</h2>
              </div>
              <button type="button" className="close-btn" onClick={() => setSelectedTaskId(null)}>×</button>
            </div>

            <div className="modal-body-scroll">
              <p className="modal-description-lead">{selectedTaskObj.description}</p>

              <div className="task-detail-meta-grid">
                <div>
                  <label>Assignee</label>
                  <div className="meta-assignee-box">
                    <img src={selectedTaskObj.assignedToAvatar} alt={selectedTaskObj.assignedTo} className="avatar-mini" />
                    <strong>{selectedTaskObj.assignedTo}</strong>
                  </div>
                </div>

                <div>
                  <label>Priority</label>
                  <span className={`priority-badge ${selectedTaskObj.priority.toLowerCase()}`}>
                    {selectedTaskObj.priority}
                  </span>
                </div>

                <div>
                  <label>Status</label>
                  <select
                    className="select-status-inline"
                    value={selectedTaskObj.status}
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
                      onClick={() => toggleTaskTimer(selectedTaskObj.id)}
                    >
                      {runningTaskId === selectedTaskObj.id ? "⏸ Pause" : "▶ Start"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Acceptance Checklist */}
              <h4 className="detail-section-title">Acceptance Checklist</h4>
              <div className="checklist-items-wrap">
                {selectedTaskObj.acceptanceChecklist?.map((chk) => (
                  <label key={chk.id} className="checklist-label-row">
                    <input
                      type="checkbox"
                      checked={chk.completed}
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
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedTaskId(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-modal-submit"
                onClick={() => {
                  setTasks((prev) =>
                    prev.map((t) => (t.id === selectedTaskObj.id ? { ...t, status: "Completed" } : t))
                  );
                  setNotice(`Task ${selectedTaskObj.id} marked as Completed!`);
                  setSelectedTaskId(null);
                }}
              >
                Mark Complete ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM DETAILS MODAL */}
      {selectedTeamObj && (
        <div className="modal-overlay" onClick={() => setSelectedTeamId(null)}>
          <div className="modal-dialog large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-sub-tag">Project: {selectedTeamObj.project}</span>
                <h2>{selectedTeamObj.name}</h2>
              </div>
              <button type="button" className="close-btn" onClick={() => setSelectedTeamId(null)}>×</button>
            </div>

            <div className="modal-body-scroll">
              <p className="modal-description-lead">{selectedTeamObj.description}</p>

              <div className="team-lead-strip" style={{ marginBottom: "20px" }}>
                <img src={selectedTeamObj.leadAvatar} alt={selectedTeamObj.lead} className="lead-strip-avatar" />
                <div className="lead-strip-info">
                  <span className="lead-strip-title">TEAM LEAD</span>
                  <strong>{selectedTeamObj.lead}</strong>
                  <small>{selectedTeamObj.leadEmail}</small>
                </div>
              </div>

              <h4 className="detail-section-title">All Team Members & Task Loads</h4>
              <table className="team-members-table">
                <thead>
                  <tr>
                    <th>MEMBER</th>
                    <th>ROLE</th>
                    <th>EMAIL</th>
                    <th>STATUS</th>
                    <th>ACTIVE TASKS</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTeamObj.members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="member-name-cell">
                          <img src={member.avatar} alt={member.name} className="m-table-avatar" />
                          <strong>{member.name}</strong>
                        </div>
                      </td>
                      <td>{member.role}</td>
                      <td><small>{member.email}</small></td>
                      <td>
                        <span className={`status-dot-indicator ${member.status.toLowerCase()}`}>
                          ● {member.status}
                        </span>
                      </td>
                      <td>
                        <strong>{member.activeTasks} tasks</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedTeamId(null)}
              >
                Close
              </button>
              {(portalRole === "admin" || leadWorkspace === "lead") && (
                <button
                  type="button"
                  className="btn-modal-submit"
                  onClick={() => {
                    setSelectedTeamId(null);
                    setNewTaskProject(selectedTeamObj.project);
                    setShowAssignTaskModal(true);
                  }}
                >
                  Assign Task to Squad →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}