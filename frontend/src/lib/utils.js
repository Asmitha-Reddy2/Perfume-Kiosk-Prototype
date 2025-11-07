import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Standard Shadcn/UI utility for merging Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}