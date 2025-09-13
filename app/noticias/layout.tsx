import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noticias | Canal del Congreso",
  description: "Mantente informado sobre las últimas noticias del Congreso de México",
}

export default function NoticiasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
