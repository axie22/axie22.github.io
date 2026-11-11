import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "Jun 2025 - Aug 2025" → "Jun 2025 – Aug 2025" (en dash for display). */
export function dateRange(date: string) {
  return date.replace(" - ", " – ")
}

/** Tag lists render as plain text joined by a middle dot. */
export function joinTags(tags: readonly string[]) {
  return tags.join(" · ")
}
