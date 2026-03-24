// Shared constants for both sections

export const CATEGORIES = ["DSA", "SYSTEM_DESIGN", "PROJECT", "BUILD_IN_PUBLIC", "GENERAL"];
export const PRIORITIES = ["NOW", "THIS_WEEK", "BACKLOG"];
export const STATUSES = ["PENDING", "IN_PROGRESS", "DONE", "SKIPPED"];

// Color mapping: category → CSS accent variable suffix
// DSA=emerald(l1), SYSTEM_DESIGN=blue(l2), PROJECT=amber(l3), BUILD_IN_PUBLIC=pink(l4), GENERAL=purple(l5)
export const CATEGORY_COLORS = {
  DSA: "l1",
  SYSTEM_DESIGN: "l2",
  PROJECT: "l3",
  BUILD_IN_PUBLIC: "l4",
  GENERAL: "l5",
};

export const CATEGORY_LABELS = {
  DSA: "DSA",
  SYSTEM_DESIGN: "SYS_DESIGN",
  PROJECT: "PROJECT",
  BUILD_IN_PUBLIC: "BUILD_PUBLIC",
  GENERAL: "GENERAL",
};

export const STATUS_LABELS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROG",
  DONE: "DONE",
  SKIPPED: "SKIP",
};
