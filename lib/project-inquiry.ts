export const PROJECT_TYPE_IDS = [
  "corporate",
  "commerce",
  "landing",
  "personal",
  "restaurant",
  "blog",
  "event",
  "application",
] as const;

export type ProjectTypeId = (typeof PROJECT_TYPE_IDS)[number];

export function isProjectTypeId(value: string): value is ProjectTypeId {
  return PROJECT_TYPE_IDS.includes(value as ProjectTypeId);
}

export const FILE_RULES = {
  maxFiles: 5,
  maxFileBytes: 8 * 1024 * 1024,
  maxTotalBytes: 20 * 1024 * 1024,
  accept:
    ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  company: 120,
  message: 5000,
} as const;

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
