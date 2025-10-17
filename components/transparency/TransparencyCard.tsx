import Link from 'next/link'

interface TransparencyCardProps {
  title: string
  description: string
  linkUrl?: string
  hasButton?: boolean
}

export default function TransparencyCard({ 
  title, 
  description, 
  linkUrl, 
  hasButton 
}: TransparencyCardProps) {
  return (
    <div className="relative group flex flex-col items-center">
      <div className="relative w-full max-w-md px-4 mb-3">
        <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 rounded-full px-8 py-4 shadow-lg shadow-purple-500/50 ring-2 ring-white/20">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide text-center">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-900/90 rounded-3xl p-8 min-h-[280px] flex items-center justify-center shadow-2xl shadow-purple-900/60 backdrop-blur-sm border border-purple-400/20">
          <p className="text-white/95 text-sm leading-relaxed text-center">
            {description}
          </p>
        </div>
      </div>

      {hasButton && linkUrl && (
        <Link 
          href={linkUrl}
          aria-label={`Ver más sobre ${title}`}
          className="mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/50 hover:scale-110 transition-transform ring-2 ring-white/20 group-hover:shadow-xl group-hover:shadow-purple-500/70 focus:outline-none focus:ring-4 focus:ring-purple-400"
        >
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
    </div>
  )
}
