import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatJsonPretty(data: unknown): string {
  return JSON.stringify(data, null, 2)
}

export function getStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    blocked: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    rate_limited: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  }
  return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}
