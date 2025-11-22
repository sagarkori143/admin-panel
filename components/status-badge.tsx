"use client"

import { getStatusBadgeColor } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const displayLabel = label || status
  const colors = getStatusBadgeColor(status)

  return <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${colors}`}>{displayLabel}</span>
}
