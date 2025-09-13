import Image from "next/image"

interface RadioLogoProps {
  size?: "sm" | "md" | "lg"
  withText?: boolean
  className?: string
}

export default function RadioLogo({ size = "md", withText = true, className = "" }: RadioLogoProps) {
  const sizes = {
    sm: { logo: 24, container: "h-6 w-6" },
    md: { logo: 40, container: "h-10 w-10" },
    lg: { logo: 120, container: "h-24 w-24" },
  }

  const { logo, container } = sizes[size]

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${container} rounded-full overflow-hidden bg-[#7e22ce]`}>
        <Image
          src="/placeholder-qjr0n.png"
          alt="Radio Congreso Logo"
          width={logo}
          height={logo}
          className="object-contain"
        />
      </div>
      {withText && (
        <div className="ml-2">
          {size === "lg" ? (
            <div className="text-left">
              <h1 className="text-6xl font-bold">Radio</h1>
              <h2 className="text-4xl font-bold">CONGRESO</h2>
            </div>
          ) : (
            <span className="font-bold">Radio Congreso</span>
          )}
        </div>
      )}
    </div>
  )
}
