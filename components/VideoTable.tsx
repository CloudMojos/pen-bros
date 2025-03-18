"use client"

import { memo } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TikTokVideo } from "@/lib/interfaces"
import { SortField, SortDirection } from "@/lib/types"
import { formatDate, formatNumber, sortVideos } from "@/lib/helpers"

interface VideoTableProps {
  videos: TikTokVideo[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

const VideoTable = memo(function VideoTable({ videos, sortField, sortDirection, onSort }: VideoTableProps) {
  const sortedVideos = sortVideos(videos, sortField, sortDirection)

  const renderSortIndicator = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
    }
    return null
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
              <div className="flex items-center">
                Name
                {renderSortIndicator("name")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("postDate")}>
              <div className="flex items-center">
                Post Date
                {renderSortIndicator("postDate")}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => onSort("viewsCount")}>
              <div className="flex items-center justify-end">
                Views Count
                {renderSortIndicator("viewsCount")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVideos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>
                <a
                  href={video.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {video.name}
                </a>
              </TableCell>
              <TableCell>{formatDate(video.postDate)}</TableCell>
              <TableCell className="text-right">{formatNumber(video.viewsCount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})

export default VideoTable 