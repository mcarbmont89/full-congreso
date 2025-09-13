import Link from "next/link";
import Image from "next/image";
import SocialBar from "@/components/social-bar";
import Footer from "@/components/footer";
import NewsCarousel from "@/components/news-carousel";
import NewsSubmenu from "@/components/news-submenu";
import ChannelBar from "@/components/channel-bar";
import VideoCarousel from "@/components/video-carousel";
import NewsGrid from "@/components/news-grid";
import { getNewsFromDB } from "@/lib/api-database";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category?: string;
  publishedAt: Date;
  createdAt: Date;
  status?: string;
}

interface VideoNewsItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: Date;
}

async function getVideoNewsFromDB(): Promise<VideoNewsItem[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/video-news/all`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch video news:", response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("News page: Raw video news data:", data);

    const mappedData = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      thumbnailUrl: item.thumbnailUrl || "/placeholder.svg",
      videoUrl: item.videoUrl || "#",
      createdAt: new Date(item.createdAt),
    }));

    console.log("News page: Mapped video news data:", mappedData);
    return mappedData;
  } catch (error) {
    console.error("Error fetching video news:", error);
    return [];
  }
}

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function NewsPage() {
  // Automatically publish any scheduled news that should now be live
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/news/publish-scheduled`,
      {
        method: "POST",
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("Error auto-publishing scheduled news:", error);
  }

  // Fetch news from API route to avoid client-side database imports
  let newsItems: NewsItem[] = [];
  let videoItems: VideoNewsItem[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/news/all`,
      {
        cache: "no-store",
      },
    );

    if (response.ok) {
      const allNews = await response.json();
      const now = new Date();
      
      // Filter to only show published news with publishedAt <= current date
      newsItems = allNews.filter((item: NewsItem) => {
        const publishedDate = new Date(item.publishedAt);
        return item.status === 'published' && publishedDate <= now;
      }).sort((a: NewsItem, b: NewsItem) => {
        // Sort by publishedAt date, most recent first
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    } else {
      console.error(
        "Failed to fetch news:",
        response.status,
        response.statusText,
      );
      newsItems = [];
    }
  } catch (error) {
    console.error("Failed to load news:", error);
    newsItems = [];
  }

  try {
    // Fetch video news items
    videoItems = await getVideoNewsFromDB();
    console.log("News page: Loaded", videoItems.length, "video news items");
    console.log(
      "News page: Video items details:",
      videoItems.map((item) => ({
        id: item.id,
        title: item.title?.substring(0, 30) + "...",
        thumbnailUrl: item.thumbnailUrl,
        hasImage: !!item.thumbnailUrl,
      })),
    );
  } catch (error) {
    console.error("Error loading video news:", error);
    videoItems = [];
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow bg-[url('/images/light-hexagon-pattern.png')] bg-cover">
        <ChannelBar />
        <NewsSubmenu />

        {newsItems.length > 0 && (
          <NewsCarousel
            newsItems={newsItems.slice(0, 4).map((item) => ({
              ...item,
              slug: createSlug(item.title),
              category: item.category || "General",
              date: new Date(item.publishedAt || item.createdAt)
                .toISOString()
                .split("T")[0],
            }))}
          />
        )}

        {/* News Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <NewsGrid newsItems={newsItems.slice(0, 6)} hideSearch={true} />
          </div>
        </section>

        {/* Ver más link */}
        {newsItems && newsItems.length > 0 && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex justify-center">
                <Link
                  href="/noticias/todas"
                  className="text-[#e91e63] font-medium hover:text-[#f06292] transition-colors flex flex-col items-center"
                >
                  Ver más
                  <svg
                    className="w-8 h-8 mt-1 text-[#e91e63]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Video Carousel Section - Updated with light pattern background */}
        {videoItems.length > 0 && (
          <section className="py-12 bg-contain bg-repeat-y">
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Videos Destacados
              </h2>
              <VideoCarousel
                videos={videoItems.map((item) => ({
                  id: parseInt(item.id),
                  title: item.title,
                  imageUrl: item.thumbnailUrl,
                  videoUrl: item.videoUrl,
                  playlistUrl: item.videoUrl?.includes("playlist?list=")
                    ? item.videoUrl
                    : undefined,
                }))}
              />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Social Bar */}
      <SocialBar />
    </div>
  );
}
