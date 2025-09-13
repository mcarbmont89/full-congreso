import Image from "next/image"
import Link from "next/link"

interface VideoItem {
  id: number
  title: string
  imageUrl: string
  videoUrl: string
}

interface VideoGridProps {
  videos: VideoItem[]
}

export default function VideoGrid({ videos }: VideoGridProps) {
  // Center video is the one in the middle (index 2 if there are 5 videos)
  const centerVideoIndex = Math.floor(videos.length / 2)
  const centerVideo = videos[centerVideoIndex]

  // Videos before and after the center video
  const leftVideos = videos.slice(0, centerVideoIndex)
  const rightVideos = videos.slice(centerVideoIndex + 1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
      {/* Left column videos */}
      <div className="md:col-span-2 grid grid-rows-2 gap-4">
        {leftVideos.map((video) => (
          <Link key={video.id} href={video.videoUrl} className="block">
            <div className="relative overflow-hidden rounded-lg h-[200px] group">
              <Image
                src={video.imageUrl || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="rounded-full bg-white/30 p-4 backdrop-blur-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-10 h-10 text-white"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-base font-medium line-clamp-2">{video.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Center video (larger) */}
      {centerVideo && (
        <div className="md:col-span-1">
          <Link href={centerVideo.videoUrl} className="block">
            <div className="relative overflow-hidden rounded-lg h-[410px] group">
              <Image
                src={centerVideo.imageUrl || "/placeholder.svg"}
                alt={centerVideo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="rounded-full bg-white/30 p-4 backdrop-blur-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-12 h-12 text-white"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-medium line-clamp-3">{centerVideo.title}</h3>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Right column videos */}
      <div className="md:col-span-2 grid grid-rows-2 gap-4">
        {rightVideos.map((video) => (
          <Link key={video.id} href={video.videoUrl} className="block">
            <div className="relative overflow-hidden rounded-lg h-[200px] group">
              <Image
                src={video.imageUrl || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="rounded-full bg-white/30 p-4 backdrop-blur-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-10 h-10 text-white"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-base font-medium line-clamp-2">{video.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
