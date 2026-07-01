const palette = [
  { bg: "#eeeefd", text: "#5b5fef" },
  { bg: "#e6f4f1", text: "#12876f" },
  { bg: "#fdf1e2", text: "#b6790a" },
  { bg: "#fbe9e8", text: "#d0473e" },
  { bg: "#eaf0fb", text: "#2f5fd6" },
  { bg: "#f4ecfb", text: "#8a3fd1" },
]

export function categoryColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}