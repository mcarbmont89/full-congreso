import Image from "next/image";
import Link from "next/link";
import { getLiveStreams, getNews, Organ } from "@/lib/api";
import { fetchPrograms } from "@/lib/api-client";
import { Program } from "@/lib/api";
import AutoScrollCarousel from "@/components/auto-scroll-carousel";
import ProgramNavigation from "@/components/program-navigation";
import EncuentraParticipacion from "@/components/encuentra-participacion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProgramsGrid from "@/components/programs-grid";
import OrganImage from "@/components/organ-image";
import SafeImage from "@/components/safe-image";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category?: string;
  publishedAt: Date;
  createdAt: Date;
  status?: string; // Added status field for filtering
}

// Type for API response items
interface NewsItemAPI {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category?: string;
  publishedAt: string;
  createdAt: string;
  status?: string;
}

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
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

  // Fetch live streams from API route to avoid client-side database imports
  let liveStreams = [];
  try {
    const liveStreamsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/live-streams?_=${Date.now()}`,
      {
        cache: "no-store", // Ensure fresh data from CMS
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
    if (liveStreamsResponse.ok) {
      liveStreams = await liveStreamsResponse.json();
    }
  } catch (error) {
    console.error("Failed to load live streams:", error);
    // Fallback to mock data if API fails
    const { getLiveStreams } = await import("@/lib/api");
    liveStreams = await getLiveStreams();
  }

  // Fetch news from database API
  let news = [];
  try {
    const newsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/news`,
      {
        cache: "no-store", // Ensure fresh data from CMS
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
    if (newsResponse.ok) {
      const newsResult = await newsResponse.json();
      const allNews = newsResult.news || newsResult; // Handle both paginated and old format
      console.log("Homepage: Fetched news from API:", allNews.length, "items");
      // Filter to only show published news with publishedAt <= current date
      const now = new Date();
      const publishedNews = allNews.filter((item: NewsItemAPI) => {
        const publishedDate = new Date(item.publishedAt || item.createdAt);
        return (!item.status || item.status === 'published') && publishedDate <= now;
      }).sort((a: NewsItemAPI, b: NewsItemAPI) => {
        // Sort by publishedAt date, most recent first
        const aDate = new Date(a.publishedAt || a.createdAt);
        const bDate = new Date(b.publishedAt || b.createdAt);
        return bDate.getTime() - aDate.getTime();
      });

      // Get the first 5 published news items
      news = publishedNews.slice(0, 5);
      console.log("Homepage: Using", news.length, "news items for display");
    } else {
      console.error(
        "Homepage: News API response not OK:",
        newsResponse.status,
        newsResponse.statusText,
      );
      news = [];
    }
  } catch (error) {
    console.error("Failed to load news:", error);
    news = [];
  }

  // Parliamentary groups removed from CMS

  // Fetch organs from database API
  let organs: Organ[] = [];
  try {
    const organsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/organs`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
    if (organsResponse.ok) {
      organs = await organsResponse.json();
    }
  } catch (error) {
    console.error("Failed to load organs:", error);
    organs = [];
  }

  // Fetch homepage configuration
  let homepageConfig: any = {};
  try {
    const configResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/homepage-config`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
    if (configResponse.ok) {
      const configArray = await configResponse.json();
      console.log("Homepage: Fetched config data:", configArray);
      // Convert array to object for easier access
      homepageConfig = configArray.reduce((acc: any, item: any) => {
        acc[item.section] = item;
        return acc;
      }, {});
      console.log("Homepage: Processed config:", homepageConfig);
    } else {
      console.error(
        "Homepage: Config API response not OK:",
        configResponse.status,
        configResponse.statusText,
      );
    }
  } catch (error) {
    console.error("Failed to load homepage config:", error);
  }

  let programs: Program[] = [];
  try {
    programs = await fetchPrograms();
  } catch (error) {
    console.error("Failed to load programs:", error);
    // Try to fetch programs directly from API as fallback
    try {
      const programsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/programs`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );
      if (programsResponse.ok) {
        programs = await programsResponse.json();
        console.log(
          "Homepage: Using fallback programs:",
          programs.length,
          "items",
        );
      }
    } catch (fallbackError) {
      console.error("Homepage: Fallback programs also failed:", fallbackError);
      programs = [];
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-[url('/images/light-hexagon-pattern.png')] bg-cover">
        {/* Live Now Section */}
        <section
          className="text-white py-6"
          style={{
            backgroundColor: "#3b0764",
            backgroundImage: homepageConfig.liveSection?.backgroundImageUrl
              ? `url(${homepageConfig.liveSection.backgroundImageUrl})`
              : "url(/images/purple-pattern-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="container mx-auto px-4">
            <AutoScrollCarousel
              items={liveStreams}
              showLiveIndicator={
                homepageConfig.liveSection?.configData?.showLiveIndicator !==
                false
              }
              liveIndicatorText={
                homepageConfig.liveSection?.configData?.liveIndicatorText ||
                "EN VIVO AHORA"
              }
            />
          </div>
        </section>

        {/* Program Navigation */}
        <ProgramNavigation />

        {/* Our Programs Section */}
        <section className="py-8 ">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-[#e91e63]">
              NUESTROS PROGRAMAS
            </h2>

            <ProgramsGrid programs={programs} />

            <div className="flex justify-center mt-6">
              <button className="text-[#e91e63] font-medium hover:text-[#f06292] transition-colors flex flex-col items-center">
                Ver más
                <svg
                  className="w-8 h-8 mt-1 text-[#e91e63]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-10 text-center text-[#3b0764]">
              NOTICIAS
            </h2>

            {news && news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6">
                {/* Main News */}
                <div>
                  <Link href={`/noticias/${news[0].id}`} className="block h-full">
                    <div className="relative h-[400px] md:h-[497px] w-full rounded-lg overflow-hidden">
                      <SafeImage
                        src={news[0].imageUrl || "/placeholder.svg"}
                        alt={news[0].title}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-bold text-white text-2xl">
                          {news[0].title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Small News */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2">
                  {news.slice(1, 5).map((item: NewsItem) => (
                    <Link key={item.id} href={`/noticias/${item.id}`} className="block h-full">
                      <div className="relative h-[240px] rounded-lg overflow-hidden">
                        <SafeImage
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="font-bold text-white text-sm line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No hay noticias disponibles
                </h3>
                <p className="text-gray-600">
                  Las noticias aparecerán aquí cuando sean publicadas desde el
                  panel administrativo.
                </p>
              </div>
            )}

            {/* Ver más link */}
            {news && news.length > 0 && (
              <div className="flex justify-center mt-10">
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
            )}
          </div>
        </section>


        {/* Find Participation Section */}
        <EncuentraParticipacion parliamentaryGroups={[]} />

        {/* Congress Channel Organs Section */}
        <section className="py-9">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-9 text-center text-[#3b0764]">
              ÓRGANOS DEL CANAL DEL CONGRESO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {organs.map((organ) => (
                <div key={organ.id} className="rounded-lg overflow-hidden">
                  {organ.url ? (
                    <a
                      href={organ.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative h-69 cursor-pointer"
                    >
                      <Image
                        src={organ.imageUrl || "/placeholder.svg"}
                        alt={organ.title}
                        width={320}
                        height={240}
                        className="object-cover w-full h-full"
                      />
                    </a>
                  ) : (
                    <div className="relative h-69">
                      <Image
                        src={organ.imageUrl || "/placeholder.svg"}
                        alt={organ.title}
                        width={320}
                        height={240}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Download App Section */}
        <section className="w-full">
          <div className="relative w-full h-[10.35rem] md:h-[27.6rem] overflow-hidden">
            {/* Mobile Image - Only show on mobile screens when mobileImageUrl exists */}
            {homepageConfig.downloadApp?.mobileImageUrl && (
              <Image
                src={homepageConfig.downloadApp.mobileImageUrl}
                alt={
                  homepageConfig.downloadApp?.title || "Descarga nuestra app"
                }
                fill
                className="object-cover object-center block md:hidden"
                priority={false}
                unoptimized={true}
              />
            )}

            {/* Desktop Image - Show on desktop screens, or on all screens if no mobile image exists */}
            <Image
              src={
                homepageConfig.downloadApp?.heroImageUrl ||
                "/images/descarga-app-nueva.png"
              }
              alt={homepageConfig.downloadApp?.title || "Descarga nuestra app"}
              fill
              className={`object-cover object-center ${homepageConfig.downloadApp?.mobileImageUrl ? "hidden md:block" : "block"}`}
              priority={false}
              unoptimized={true}
            />

            {(homepageConfig.downloadApp?.title ||
              homepageConfig.downloadApp?.description) && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
                <div className="text-center text-white max-w-sm md:max-w-2xl">
                  {homepageConfig.downloadApp?.title && (
                    <h2 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">
                      {homepageConfig.downloadApp.title}
                    </h2>
                  )}
                  {homepageConfig.downloadApp?.description && (
                    <p className="text-xs md:text-lg">
                      {homepageConfig.downloadApp.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}