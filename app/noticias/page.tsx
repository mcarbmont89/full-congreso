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
  isFeatured?: boolean;
  featuredRank?: number | null;
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
  let featuredNews: NewsItem[] = [];
  let videoItems: VideoNewsItem[] = [];

  try {
    // Fetch featured news first
    const featuredResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/news/featured`,
      {
        cache: "no-store",
      },
    );

    if (featuredResponse.ok) {
      const featuredData = await featuredResponse.json();
      featuredNews = featuredData.news || [];
      console.log("News page: Loaded", featuredNews.length, "featured news items");
    }

    // Fetch all news
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/news/all`,
      {
        cache: "no-store",
      },
    );

    if (response.ok) {
      const allNews = await response.json();
      const now = new Date();
      
      // Get featured news IDs to exclude from regular news
      const featuredNewsIds = featuredNews.map(item => item.id);
      
      // Filter to only show published news with publishedAt <= current date
      // Exclude featured news to avoid duplicates
      newsItems = allNews.news.filter((item: NewsItem) => {
        const publishedDate = new Date(item.publishedAt);
        return item.status === 'published' && 
               publishedDate <= now && 
               !featuredNewsIds.includes(item.id);
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
    featuredNews = [];
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

        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-[#9c1458] to-[#e91e63]">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <h2 className="text-3xl font-bold text-white">Noticias Destacadas</h2>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-white/90 text-lg">
                  Las noticias más importantes seleccionadas por nuestros editores
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Primary Featured Article */}
                <div className="lg:col-span-1">
                  <Link 
                    href={`/noticias/${createSlug(featuredNews[0].title)}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl">
                      <div className="relative h-80">
                        <Image
                          src={featuredNews[0].imageUrl || "/placeholder.svg"}
                          alt={featuredNews[0].title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Destacada
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[#e91e63] text-sm font-medium">
                            {featuredNews[0].category || "General"}
                          </span>
                          <span className="text-gray-400">•</span>
                          <time className="text-gray-500 text-sm">
                            {new Date(featuredNews[0].publishedAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#e91e63] transition-colors">
                          {featuredNews[0].title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3">
                          {featuredNews[0].summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Secondary Featured Articles */}
                <div className="space-y-6">
                  {featuredNews.slice(1, 3).map((item, index) => (
                    <Link 
                      key={item.id}
                      href={`/noticias/${createSlug(item.title)}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 group-hover:scale-102 group-hover:shadow-2xl">
                        <div className="flex">
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <Image
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                #{index + 2}
                              </span>
                              <span className="text-[#e91e63] text-xs font-medium">
                                {item.category || "General"}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#e91e63] transition-colors">
                              {item.title}
                            </h4>
                            <time className="text-gray-500 text-xs">
                              {new Date(item.publishedAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </time>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

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
