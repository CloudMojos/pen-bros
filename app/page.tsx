"use client"

import { Suspense, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SortField, SortDirection } from "@/lib/types"
import { VideoProvider, useVideos } from "@/contexts/VideoContext"
import dynamic from "next/dynamic"

// Lazy load the VideoTable component
const VideoTable = dynamic(() => import("@/components/VideoTable"), {
  loading: () => (
    <div className="flex items-center justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ),
})

function VideoContent() {
  const { videos, isLoading, error } = useVideos()
  const [sortField, setSortField] = useState<SortField>("viewsCount")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "viewsCount" ? "desc" : "asc")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground mb-4">No data available.</p>
      </div>
    )
  }

  return (
    <VideoTable
      videos={videos}
      sortField={sortField}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  )
}

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>TikTok Videos Viewer</CardTitle>
          <CardDescription>View the top 20 TikTok videos by view count</CardDescription>
        </CardHeader>
        <CardContent>
          <VideoProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              }
            >
              <VideoContent />
            </Suspense>
          </VideoProvider>
        </CardContent>
      </Card>
    </main>
  )
}

