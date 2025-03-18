"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { TikTokVideo } from "@/lib/interfaces"
import { parseCSV } from "@/lib/helpers"

interface VideoContextType {
  videos: TikTokVideo[]
  isLoading: boolean
  error: string | null
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true)
        // Add artificial delay to demonstrate loading state
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        const response = await fetch("/api/videos")
        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }
        
        const csvText = await response.text()
        const parsedData = parseCSV(csvText)
        
        // Sort by views count and get top 20
        const sortedData = parsedData.sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 20)
        
        setVideos(sortedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <VideoContext.Provider value={{ videos, isLoading, error }}>
      {children}
    </VideoContext.Provider>
  )
}

export function useVideos() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error("useVideos must be used within a VideoProvider")
  }
  return context
} 