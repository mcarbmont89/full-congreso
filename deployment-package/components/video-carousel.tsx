"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface VideoItem {
  id: number;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  url?: string;
  playlistUrl?: string;
}

interface VideoCarouselProps {
  videos: VideoItem[];
}

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalPages = Math.ceil(videos.length / 5);

  console.log("VideoCarousel: Received videos:", videos.length, "videos");
  console.log(
    "VideoCarousel: Videos data:",
    videos.map((v) => ({
      id: v.id,
      title: v.title.substring(0, 30) + "...",
      hasImage: !!v.imageUrl,
    })),
  );

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  // Get current page videos
  const getCurrentPageVideos = () => {
    const startIndex = currentIndex * 5;
    return videos.slice(startIndex, startIndex + 5);
  };

  const currentVideos = getCurrentPageVideos();
  const centerVideo = currentVideos[2] || videos[0]; // Center video is the 3rd item (index 2)
  const topLeftVideo = currentVideos[0];
  const topRightVideo = currentVideos[1];
  const bottomLeftVideo = currentVideos[3];
  const bottomRightVideo = currentVideos[4];

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-md transition-all"
        aria-label="Previous videos"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-700"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-md transition-all"
        aria-label="Next videos"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-700"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Video Grid Container */}
      <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto">
        {/* Top Row */}
        <div className="col-span-6 md:col-span-4 lg:col-span-6">
          {topLeftVideo && <VideoItem video={topLeftVideo} />}
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-6">
          {topRightVideo && <VideoItem video={topRightVideo} />}
        </div>

        {/* Center Row - Large Video */}
        <div className="col-span-12 my-4">
          {centerVideo && <VideoItem video={centerVideo} isLarge={true} />}
        </div>

        {/* Bottom Row */}
        <div className="col-span-6 md:col-span-4 lg:col-span-6">
          {bottomLeftVideo && <VideoItem video={bottomLeftVideo} />}
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-6">
          {bottomRightVideo && <VideoItem video={bottomRightVideo} />}
        </div>
      </div>

      {/* Ver más button */}
      <div className="flex flex-col items-center mt-10">
        <Link
          href="https://www.youtube.com/playlist?list=PLuH8BWke2UzDW9UYSYcOuuGE3V5t-qMCC"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-pink-600 hover:text-pink-500 transition-colors"
        >
          <span className="text-xl font-bold">Ver más videos</span>
          <div className="w-16 h-16 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-pink-600"
            >
              <path
                d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}

// Individual video item component
function VideoItem({
  video,
  isLarge = false,
}: {
  video: VideoItem;
  isLarge?: boolean;
}) {
  // Extract video ID from YouTube URL for embedding
  const getYouTubeVideoId = (url: string) => {
    if (!url) return "uAva6xw9qCg"; // Default video ID as fallback

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return "uAva6xw9qCg"; // Default video ID as fallback
  };

  const videoId = getYouTubeVideoId(video.videoUrl || video.url || "");

  return (
    <div className="block group">
      <div
        className={`relative ${isLarge ? "h-[400px]" : "h-[250px]"} w-full overflow-hidden rounded-lg`}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?si=bjKVY2uzQjg5SngC`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
        {/* Video title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
          <h3
            className={`${isLarge ? "text-xl" : "text-base"} font-medium line-clamp-2`}
          >
            {video.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
