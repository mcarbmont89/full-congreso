import Image from "next/image"
import Link from "next/link"

interface ProgramBannerHtmlProps {
  title: string
  subtitle?: string
  leftImageUrl?: string
  episodeTitle: string
  episodeDate: string
  episodeDescription: string
  episodeLength: string
  programLink: string
  episodesLink: string
  className?: string
}

export default function ProgramBannerHtml({
  title,
  subtitle,
  leftImageUrl,
  episodeTitle,
  episodeDate,
  episodeDescription,
  episodeLength,
  programLink,
  episodesLink,
  className,
}: ProgramBannerHtmlProps) {
  return (
    <div className={`flex flex-col md:flex-row shadow-xl overflow-hidden rounded-lg ${className}`}>
      {/* Left panel - Program info with branded design */}
      <div className="relative overflow-hidden h-[360px] md:h-[480px] md:w-2/3">
        <Link href={programLink} className="block w-full h-full">
          {leftImageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={leftImageUrl || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300"></div>

              {/* Title overlay hidden */}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#3b0764] to-[#1e1b4b] h-full w-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-white text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-white/90 text-lg">{subtitle}</p>
                )}
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Right panel - Episode info with improved styling */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 md:p-8 md:w-1/3 flex flex-col justify-between">
        <div>
          <h4 className="text-xl md:text-2xl font-bold mb-4 text-gray-100 uppercase tracking-wide">
            {title}
          </h4>

          <div className="border-l-4 border-[#e91e63] pl-4 mb-4">
            <p className="text-lg font-bold mb-2 leading-tight text-white">
              "{episodeTitle}"
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs">
              {episodeDate}
            </span>
            <span className="bg-[#e91e63] text-white px-3 py-1 rounded-full text-xs font-medium">
              {episodeLength}
            </span>
          </div>

          <p className="text-sm mb-6 leading-relaxed text-gray-300 line-clamp-8">
            {episodeDescription}
          </p>
        </div>

        <div className="flex justify-between items-center gap-4">
          <Link 
            href={episodesLink} 
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors text-sm flex-1 max-w-[50%] text-center"
          >
            Ver todos los episodios
          </Link>

          <Image src="/images/radio-congreso-logo.png" alt="Radio Congreso" width={80} height={80} className="flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}