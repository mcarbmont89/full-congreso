"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProgramCarousel, {
  type CarouselItem,
} from "@/components/program-carousel";
import { useFloatingPlayer } from "@/components/floating-player-context";
import ProgramBannerHtml from "@/components/program-banner-html";
import Footer from "@/components/footer";

import ChannelBar from "@/components/channel-bar";

// Types for our CMS data
interface RadioProgram {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  latestEpisode: {
    title: string;
    date: string;
    duration: string;
    description: string;
  };
  programLink: string;
  episodesLink: string;
  featured?: boolean;
}

interface RadioConfig {
  streamUrl: string;
  heroImage: string;
  channels: Array<{
    id: string;
    img: string;
    name: string;
    color: string;
    active: boolean;
  }>;
  navigation: Array<{
    name: string;
    href: string;
  }>;
  categoryImages: {
    [key: string]: string;
  };
  carousel: Array<{
    id: string;
    title: string;
    image: string;
    link: string;
  }>;
}

// Default fallback data
const DEFAULT_CONFIG: RadioConfig = {
  streamUrl:
    "https://ccstreaming.packet.mx/LiveApp/streams/Radio_kd5oiNTTWO0gEOFc23dr762145.m3u8",
  heroImage: "/images/radio-hero-banner.png",
  channels: [
    {
      id: "radio-congreso",
      name: "Radio Congreso",
      color: "transparent",
      img: "",
      active: false,
    },
    {
      id: "canal-45-1",
      img: "/images/channel-c-logo.png",
      name: "CANAL 45.1",
      color: "#4a4a4a",
      active: false,
    },
    {
      id: "canal-45-2",
      img: "/images/channel-g-logo.png",
      name: "CANAL 45.2",
      color: "#b91c1c",
      active: false,
    },
    {
      id: "canal-45-3",
      img: "/images/channel-d-logo.png",
      name: "CANAL 45.3",
      color: "#15803d",
      active: false,
    },
  ],
  navigation: [
    { name: "Toma Tribuna", href: "/radio/toma-tribuna" },
    { name: "Entrevistas", href: "/radio/entrevistas" },
    { name: "Sitio Abierto", href: "/radio/sitio-abierto" },
    { name: "Noticias del Congreso", href: "/radio/noticias" },
  ],
  categoryImages: {},
  carousel: [],
};

const DEFAULT_CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: "programas",
    title: "",
    image: "/images/placeholder.jpg",
    link: "/radio/programas",
  },
  {
    id: "sitio-abierto",
    title: "",
    image: "/images/placeholder.jpg",
    link: "/radio/sitio-abierto",
  },
  {
    id: "entrevistas",
    title: "",
    image: "/images/placeholder.jpg",
    link: "/radio/entrevistas",
  },
  {
    id: "noticias-congreso",
    title: "",
    image: "/images/placeholder.jpg",
    link: "/radio/noticias-congreso",
  },
];

// Streaming Player Button Component (for HLS streams)
function StreamingPlayerButton({ streamUrl }: { streamUrl: string }) {
  const { showPlayer } = useFloatingPlayer();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleStreamClick = () => {
    // Show floating player only for desktop
    showPlayer(streamUrl, "Radio Congreso - EN VIVO");
  };

  return (
    <div className="bg-black text-white py-3 px-4">
      <div className="container mx-auto flex items-center justify-center">
        {!isHydrated ? (
          // Show button during SSR and initial hydration
          <button
            onClick={handleStreamClick}
            className="bg-[#e11d48] hover:bg-[#be185d] text-white rounded-full p-3 flex items-center space-x-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span className="font-medium">Radio en Vivo</span>
          </button>
        ) : isMobileDevice ? (
          // HTML5 Audio Player for Mobile
          <div className="w-full max-w-md">
            <div className="bg-[#1f2937] rounded-lg p-4">
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">EN VIVO - Radio Congreso</span>
                </div>
              </div>

              <audio 
                src={streamUrl}
                controls
                playsInline
                crossOrigin="anonymous"
                webkit-playsinline="true"
                preload="none"
                className="w-full h-12 bg-gray-800 rounded"
                style={{
                  backgroundColor: '#374151',
                  borderRadius: '6px'
                }}
              />

              <div className="text-center mt-2 text-xs text-gray-400">
                Toca play para escuchar la transmisión en vivo
              </div>
            </div>
          </div>
        ) : (
          // Button for Desktop (shows floating player)
          <button
            onClick={handleStreamClick}
            className="bg-[#e11d48] hover:bg-[#be185d] text-white rounded-full p-3 flex items-center space-x-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span className="font-medium">Radio en Vivo</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function RadioPage() {
  const [radioPrograms, setRadioPrograms] = useState<RadioProgram[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [radioConfig, setRadioConfig] = useState<RadioConfig>(DEFAULT_CONFIG);
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    async function loadRadioData() {
      try {
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000";

        // Load config and carousel data in parallel
        const [configResult, carouselResult, programsResult] =
          await Promise.allSettled([
            fetch(`${baseUrl}/api/radio/config`, {
              cache: "no-store",
            }).then((res) => (res.ok ? res.json() : null)),

            fetch(`${baseUrl}/api/radio/carousel`, {
              cache: "no-store",
            }).then((res) => (res.ok ? res.json() : DEFAULT_CAROUSEL_ITEMS)),

            fetch(`${baseUrl}/api/radio/programs`, {
              cache: "no-store",
            }).then((res) => (res.ok ? res.json() : [])),
          ]);

        // Handle config
        const config =
          configResult.status === "fulfilled" ? configResult.value : null;
        const mergedConfig = {
          ...DEFAULT_CONFIG,
          ...config,
          streamUrl: config?.streamUrl || DEFAULT_CONFIG.streamUrl,
          heroImage: config?.heroImage || DEFAULT_CONFIG.heroImage,
          channels: config?.channels || DEFAULT_CONFIG.channels,
          navigation: config?.navigation || DEFAULT_CONFIG.navigation,
          categoryImages: config?.categoryImages || {},
        };
        setRadioConfig(mergedConfig);

        // Handle carousel - prioritize API data over defaults
        const carousel =
          carouselResult.status === "fulfilled" ? carouselResult.value : null;
        console.log("Carousel data from API:", carousel);

        if (carousel && Array.isArray(carousel) && carousel.length > 0) {
          const validCarousel = carousel
            .filter((item) => item && item.id && item.title && item.link)
            .map((item) => ({
              ...item,
              // Ensure image URL is properly handled - don't add timestamp if already present
              image:
                item.image && item.image !== "/images/placeholder.jpg"
                  ? item.image.includes("?t=")
                    ? item.image
                    : `${item.image}?t=${Date.now()}`
                  : item.image,
            }));

          if (validCarousel.length > 0) {
            console.log("Using CMS carousel data:", validCarousel);
            setCarouselItems(validCarousel);
          } else {
            console.log("No valid CMS carousel items, using defaults");
            setCarouselItems(DEFAULT_CAROUSEL_ITEMS);
          }
        } else {
          console.log("No carousel data from API, using defaults");
          setCarouselItems(DEFAULT_CAROUSEL_ITEMS);
        }

        // Handle programs
        const programs =
          programsResult.status === "fulfilled" ? programsResult.value : [];
        const validPrograms = Array.isArray(programs)
          ? programs.filter(
              (program) =>
                program &&
                program.id &&
                program.title &&
                program.programLink &&
                program.episodesLink,
            )
          : [];
        setRadioPrograms(validPrograms);
      } catch (error) {
        console.error("Error loading radio data:", error);
        // Use defaults on error
        setRadioConfig(DEFAULT_CONFIG);
        setCarouselItems(DEFAULT_CAROUSEL_ITEMS);
        setRadioPrograms([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadRadioData();
  }, [isHydrated]);

  const programSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[áéíóú]/g, (match: string) => {
        const accents: { [key: string]: string } = {
          á: "a",
          é: "e",
          í: "i",
          ó: "o",
          ú: "u",
        };
        return accents[match] || match;
      })
      .replace(/[^a-z0-9-]/g, "");
  };

  return (
      <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        <div className="bg-[#3b0764] text-white py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide min-w-0 flex-1">
              {radioConfig.channels.map((channel) => {
                // Map channel IDs to transmisiones routes
                const getChannelLink = (channelId: string) => {
                  switch (channelId) {
                    case 'canal-45-1':
                      return '/transmisiones?stream=1'
                    case 'canal-45-2': 
                      return '/transmisiones?stream=3'
                    case 'canal-45-3':
                      return '/transmisiones?stream=2'
                    case 'canal-45-4':
                      return '/transmisiones?stream=4'
                    default:
                      return '/radio' // Stay on radio for Radio Congreso
                  }
                }

                const channelLink = getChannelLink(channel.id)
                const isRadio = channel.id === 'radio-congreso'

                if (isRadio) {
                  return (
                    <div
                      key={channel.id}
                      className={`rounded-full px-4 py-0.5 flex items-center whitespace-nowrap flex-shrink-0 ${
                        channel.active && false ? "ring-2 ring-white/50" : ""
                      }`}
                      style={{ backgroundColor: channel.id === 'radio-congreso' ? 'transparent': channel.color }}
                    >
                      <Image
                        src="/images/radio-congreso-logo.png"
                        alt={channel.name}
                        width={120}
                        height={120}
                        className="h-30 w-30 object-contain"
                      />
                    </div>
                  )
                }

                return (
                  <Link
                    key={channel.id}
                    href={channelLink}
                    className={`rounded-full p-1.5 flex items-center whitespace-nowrap flex-shrink-0 hover:opacity-80 transition-opacity ${
                      channel.active ? "ring-2 ring-white/50" : ""
                    }`}
                    style={{ backgroundColor: channel.color }}
                  >
                    <Image
                      src={channel.img}
                      alt={channel.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-xs font-medium ml-1 mr-1 hidden md:inline">
                      {channel.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Bar with Created Programs */}
        <div className="bg-black text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-start">
              <div className="flex justify-start space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide min-w-0">
                {radioPrograms.map((program) => (
                  <Link
                    key={program.id}
                    href={`/radio/${programSlug(program.title)}`}
                    className="text-sm hover:text-gray-300 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {program.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="relative">
          <div className="w-full relative overflow-hidden">
            <Image
              src={radioConfig.heroImage}
              alt="Radio Congreso"
              width={1200}
              height={300}
              className="w-full object-cover h-48 md:h-64 lg:h-80"
              priority
            />
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-red-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center space-x-1 md:space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm font-medium">EN VIVO</span>
            </div>
          </div>
          <StreamingPlayerButton streamUrl={radioConfig.streamUrl} />
        </section>

        <section
          className="py-12"
          style={{ backgroundImage: "url('/images/light-hexagon-pattern.png')" }}
        >
          <div className="container mx-auto px-4">
            <ProgramCarousel items={carouselItems} />
          </div>
        </section>

        <section
          className="py-4 md:py-8"
          style={{ backgroundImage: "url('/images/light-hexagon-pattern.png')" }}
        >
          <div className="container mx-auto px-2 md:px-4">
            <div className="mb-4 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#3b0764]">
                Programas Destacados
              </h2>
              <div className="h-1 w-16 md:w-20 bg-[#e11d48] mt-2"></div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Cargando programas...</p>
              </div>
            ) : radioPrograms.filter((program) => program.featured).length >
              0 ? (
              <div className="space-y-12">
                {radioPrograms
                  .filter((program) => program.featured)
                  .map((program) => (
                    <div key={program.id} className="w-full overflow-hidden">
                      <div className="block md:hidden">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          <Link href={`/radio/${programSlug(program.title)}/episodios`}>
                            <div className="relative h-48 w-full cursor-pointer hover:opacity-90 transition-opacity">
                              <Image
                                src={
                                  program.imageUrl ||
                                  "/placeholder.svg?height=192&width=384"
                                }
                                alt={program.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>

                          <div className="p-4">
                            <h3 className="text-xl font-bold text-[#3b0764] mb-2">
                              {program.title}
                            </h3>

                            <div className="border-t pt-3 mt-3">
                              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                                Último episodio:
                              </h4>
                              <h5 className="font-bold text-gray-900 mb-2 text-base leading-tight">
                                {program.latestEpisode?.title || "Sin título"}
                              </h5>

                              <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600">
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  {program.latestEpisode?.date || ""}
                                </span>
                                <span className="bg-purple-100 px-2 py-1 rounded text-purple-700">
                                  {program.latestEpisode?.duration || ""}
                                </span>
                              </div>

                              <p className="text-gray-700 text-sm mb-4 line-clamp-6">
                                {program.latestEpisode?.description ||
                                  "No hay descripción disponible"}
                              </p>

                              <div className="flex flex-col gap-2">
                                <Link
                                  href={`/radio/${programSlug(program.title)}/episodios`}
                                  className="border border-[#3b0764] text-[#3b0764] py-2 px-4 rounded text-center text-sm font-medium hover:bg-[#3b0764] hover:text-white transition-colors"
                                >
                                  Todos los Episodios
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <ProgramBannerHtml
                          title={program.title}
                          leftImageUrl={program.imageUrl}
                          episodeTitle={
                            program.latestEpisode?.title || "Sin título"
                          }
                          episodeDate={program.latestEpisode?.date || ""}
                          episodeLength={program.latestEpisode?.duration || ""}
                          episodeDescription={
                            program.latestEpisode?.description ||
                            "No hay descripción disponible"
                          }
                          programLink={`/radio/${programSlug(program.title)}/episodios`}
                          episodesLink={`/radio/${programSlug(program.title)}/episodios`}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay programas disponibles
                </h3>
                <p className="text-gray-500">
                  Los programas destacados aparecerán aquí cuando estén
                  disponibles.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      </div>
  );
}