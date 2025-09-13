import Link from "next/link"

interface ProgramBannerProps {
  title: string
  leftImageUrl: string
  episodeTitle: string
  episodeDate: string
  episodeDescription: string
  episodeLength: string
  programLink: string
  episodesLink: string
}

export default function ProgramBanner({
  title,
  leftImageUrl,
  episodeTitle,
  episodeDate,
  episodeDescription,
  episodeLength,
  programLink,
  episodesLink,
}: ProgramBannerProps) {
  return (
    <div style={{ display: "table", width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
      <div style={{ display: "table-row" }}>
        {/* Left side - Program Image */}
        <div
          style={{
            display: "table-cell",
            width: "66.666%",
            height: "400px",
            padding: 0,
            margin: 0,
            border: "none",
            borderSpacing: 0,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Link href={programLink}>
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${leftImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "none",
                margin: 0,
                padding: 0,
              }}
            />
          </Link>
        </div>

        {/* Right side - Episode details */}
        <div
          style={{
            display: "table-cell",
            width: "33.333%",
            backgroundColor: "#333333",
            color: "white",
            padding: "32px",
            margin: 0,
            border: "none",
            borderSpacing: 0,
            verticalAlign: "top",
          }}
        >
          <h3 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1rem" }}>{title}</h3>

          <p style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem", lineHeight: "1.25" }}>
            "{episodeTitle}"
          </p>

          <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            {episodeDate} {episodeLength}
          </p>

          <p style={{ fontSize: "0.875rem", marginBottom: "2rem" }}>{episodeDescription}</p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link
              href={episodesLink}
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.875rem",
                textDecoration: "underline",
              }}
            >
              Ver todos los episodios
            </Link>

            <div style={{ width: "80px", height: "80px", position: "relative" }}>
              <img
                src="/images/radio-congreso-plus.png"
                alt="Radio Congreso"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
