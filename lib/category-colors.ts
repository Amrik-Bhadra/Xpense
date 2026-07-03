const categoryColors: Record<string, { bg: string; text: string }> = {
  Food:          { bg: "#fef0e6", text: "#c2540d" }, // orange
  Transport:     { bg: "#eaf0fb", text: "#2f5fd6" }, // blue
  Utilities:     { bg: "#f4ecfb", text: "#8a3fd1" }, // purple
  Entertainment: { bg: "#fce8f3", text: "#c2298a" }, // pink
  Health:        { bg: "#fbe9e8", text: "#d0473e" }, // brick
  Salary:        { bg: "#e6f4f1", text: "#12876f" }, // teal
  Reimbursement: { bg: "#e6f6f9", text: "#0e7f96" }, // cyan
  Freelance:     { bg: "#eeeefd", text: "#5b5fef" }, // violet
  Gifts:         { bg: "#fdeaf0", text: "#c23e5e" }, // rose
  Interest:      { bg: "#e9f7ec", text: "#1f9d4b" }, // green
}

const fallbackColor = { bg: "#f3f0e8", text: "#8a6d1f" } // olive — used for any category not listed above

export function categoryColor(name: string) {
  return categoryColors[name] ?? fallbackColor
}