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
    <div className="relative group">
      <div className="flex flex-col items-center">
        <div 
          className="relative w-full h-[80px] flex items-center justify-center mb-2"
          style={{
            backgroundImage: 'url(/images/transparency/card-header.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        >
          <h3 className="text-white font-bold text-sm uppercase tracking-wide text-center px-8">
            {title}
          </h3>
        </div>

        <div 
          className="relative w-full min-h-[320px] flex items-center justify-center p-8"
          style={{
            backgroundImage: 'url(/images/transparency/card-body.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        >
          <p className="text-white/90 text-sm leading-relaxed text-center">
            {description}
          </p>
        </div>

        {hasButton && linkUrl && (
          <>
            <div 
              className="absolute right-0 top-[60px] h-[280px] w-[40px]"
              style={{
                backgroundImage: 'url(/images/transparency/card-connector-line.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top right'
              }}
            />

            <Link 
              href={linkUrl}
              className="absolute bottom-[-20px] left-[-20px] w-[200px] h-[80px] cursor-pointer transition-transform hover:scale-105 block"
              style={{
                backgroundImage: 'url(/images/transparency/card-button.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center'
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
