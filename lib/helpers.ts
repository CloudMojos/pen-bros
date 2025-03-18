import { TikTokVideo } from "./interfaces"
import { SortField, SortDirection } from "./types"

export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    console.log(e)
    return dateStr
  }
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US")
}

export const parseCSVLine = (line: string): string[] => {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

export const parseCSV = (csvText: string): TikTokVideo[] => {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",")

  // Find the index of each required column
  const idIndex = headers.findIndex((h) => h.trim().toLowerCase() === "source_post_id")
  const nameIndex = headers.findIndex((h) => h.trim().toLowerCase() === "post_url")
  const hrefIndex = headers.findIndex((h) => h.trim().toLowerCase() === "post_url")
  const postDateIndex = headers.findIndex((h) => h.trim().toLowerCase() === "post_created")
  const viewsCountIndex = headers.findIndex((h) => h.trim().toLowerCase() === "views_count")

  const videos: TikTokVideo[] = []

  // Start from index 1 to skip headers
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    // Handle potential commas within quoted fields
    const values = parseCSVLine(lines[i])

    if (values.length >= Math.max(idIndex, nameIndex, hrefIndex, postDateIndex, viewsCountIndex)) {
      videos.push({
        id: Number.parseInt(values[idIndex], 10),
        name: values[nameIndex],
        href: values[hrefIndex],
        postDate: values[postDateIndex],
        viewsCount: Number.parseInt(values[viewsCountIndex].replace(/,/g, ""), 10),
      })
    }
  }

  return videos
}

export const sortVideos = (videos: TikTokVideo[], sortField: SortField, sortDirection: SortDirection): TikTokVideo[] => {
  return [...videos].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortField === "postDate") {
      const dateA = new Date(a.postDate).getTime()
      const dateB = new Date(b.postDate).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    } else {
      return sortDirection === "asc" ? a.viewsCount - b.viewsCount : b.viewsCount - a.viewsCount
    }
  })
} 