import Image from "next/image";
import Link from "next/link";

interface ProgramBannerProps {
  title: string;
  subtitle?: string;
  leftImageUrl?: string;
  episodeTitle: string;
  episodeDate: string;
  episodeDescription: string;
  episodeLength: string;
  programLink: string;
  episodesLink: string;
  variant: "red" | "blue";
  className?: string;
}

export default function ProgramBanner({
  title,
  subtitle,
  leftImageUrl,
  episodeTitle,
  episodeDate,
  episodeDescription,
  episodeLength,
  programLink,
  episodesLink,
  variant = "red",
  className,
}: ProgramBannerProps) {
  return (
    <div
      className={`flex flex-col md:flex-row ${className}`}
      style={{
        boxShadow: "none",
        border: "none",
        overflow: "hidden",
      }}
    >
      {/* Left panel - Program info */}
      <div
        className="relative overflow-hidden h-[400px] md:w-2/3"
        style={{
          border: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <Link
          href={programLink}
          className="block w-full h-full"
          style={{ display: "block" }}
        >
          {leftImageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={leftImageUrl || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                style={{
                  display: "block",
                  margin: 0,
                  padding: 0,
                  border: "none",
                }}
              />
              <div
                className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"
                style={{ pointerEvents: "none" }}
              ></div>
            </div>
          ) : (
            <div className="bg-[#0c1e3e] h-full w-full flex items-center justify-center">
              <p className="text-white text-2xl">Program Image</p>
            </div>
          )}

          {/* Play button overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Right panel - Episode info */}
      <div
        className="bg-[#333333] text-white p-8 md:w-1/3"
        style={{
          border: "none",
          margin: 0,
          boxShadow: "none",
        }}
      >
        <h3 className="text-3xl font-bold mb-4">{title}</h3>

        <p className="text-lg font-bold mb-4 leading-tight">"{episodeTitle}"</p>

        <p className="text-sm mb-6">
          {episodeDate} {episodeLength}
        </p>

        <p className="text-sm mb-8">{episodeDescription}</p>

        {/* Radio logo and play button */}
        <div className="flex justify-between items-center">
          <Link
            href={episodesLink}
            className="text-white/80 hover:text-white transition-colors text-sm underline"
          >
            Ver todos los episodios
          </Link>

          <Image
            src="/images/radio-congreso.png"
            alt="Radio Congreso"
            width={80}
            height={80}
          />
        </div>
      </div>
    </div>
  );
}
