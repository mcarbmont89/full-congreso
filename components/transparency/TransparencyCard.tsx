import Link from 'next/link'

interface TransparencyFileItem {
  label: string
  fileUrl?: string
  fileType?: string
}

interface TransparencyCardProps {
  title: string
  description: string
  linkUrl?: string
  hasButton?: boolean
  items?: TransparencyFileItem[]
}

export default function TransparencyCard({ 
  title, 
  description, 
  linkUrl, 
  hasButton,
  items 
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
        <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-900/90 rounded-3xl p-8 min-h-[280px] flex flex-col justify-center shadow-2xl shadow-purple-900/60 backdrop-blur-sm border border-purple-400/20">
          {items && items.length > 0 ? (
            <div className="space-y-4">
              {description && (
                <p className="text-white/90 text-sm leading-relaxed text-center mb-4">
                  {description}
                </p>
              )}
              <ul className="space-y-3">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    {item.fileUrl ? (
                      <a 
                        href={item.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-200 hover:text-white transition-colors flex items-center gap-2 group/item"
                      >
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{item.label}</span>
                        {item.fileType && (
                          <span className="text-xs bg-fuchsia-500/30 px-2 py-0.5 rounded">
                            {item.fileType.toUpperCase()}
                          </span>
                        )}
                      </a>
                    ) : (
                      <span className="text-purple-200 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"></span>
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-white/95 text-sm leading-relaxed text-center">
              {description}
            </p>
          )}
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
