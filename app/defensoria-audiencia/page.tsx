import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Footer from "@/components/footer"
import ContactModal from "@/components/defensoria/contact-modal"
import DefensoraProfile from "@/components/defensoria/defensora-profile"
import RecentRequests from "@/components/defensoria/recent-requests"
import ReportsSection from "@/components/defensoria/reports-section"
import ConoceTuLeyButton from "@/components/defensoria/conoce-tu-ley-button"

export default function DefensoriaAudienciaPage() {
  return (
    <>
      <main className="min-h-screen">
        {/* HERO */}
        <section className="relative w-full min-h-[70vh] md:min-h-[78vh] flex flex-col items-center justify-center overflow-hidden py-12 md:py-16">
          {/* Fondo */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/defensoria-fondo-header.png"
              alt="Fondo Defensoría de Audiencia"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay morado como en mockup */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#3c0f66]/85 via-[#5b199a]/80 to-[#5b199a]/80" />
          </div>

          {/* Contenido */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 text-center text-white">
            {/* Logo */}
            <div className="flex justify-center mb-6 md:mb-8">
              <Image
                src="/images/defensoria-logo.png"
                alt="Defensoría de Audiencia"
                width={320}
                height={160}
                className="w-[220px] md:w-[280px] lg:w-[320px] h-auto"
                priority
              />
            </div>

            {/* Slogan */}
            <div className="mb-6 md:mb-8">
              <h1 className="font-bold tracking-tight drop-shadow-xl text-[34px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05]">
                ¡TU VOZ IMPORTA!
              </h1>
              <p className="mt-2 md:mt-3 text-lg sm:text-xl md:text-2xl font-medium drop-shadow">
                Comparte con nosotros tus comentarios
              </p>
            </div>

            {/* Botones de acción (imágenes como en mockup) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
              <ContactModal type="Queja">
                <button
                  type="button"
                  aria-label="Abrir formulario de Quejas"
                  aria-haspopup="dialog"
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <Image
                    src="/images/boton-quejas.png"
                    alt=""
                    width={220}
                    height={66}
                    className="w-[170px] md:w-[200px] lg:w-[220px] h-auto"
                  />
                </button>
              </ContactModal>

              <ContactModal type="Sugerencia">
                <button
                  type="button"
                  aria-label="Abrir formulario de Sugerencias"
                  aria-haspopup="dialog"
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <Image
                    src="/images/boton-sugerencias.png"
                    alt=""
                    width={220}
                    height={66}
                    className="w-[170px] md:w-[200px] lg:w-[220px] h-auto"
                  />
                </button>
              </ContactModal>

              <ContactModal type="Felicitaciones">
                <button
                  type="button"
                  aria-label="Abrir formulario de Felicitaciones"
                  aria-haspopup="dialog"
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <Image
                    src="/images/boton-felicitaciones.png"
                    alt=""
                    width={220}
                    height={66}
                    className="w-[170px] md:w-[200px] lg:w-[220px] h-auto"
                  />
                </button>
              </ContactModal>
            </div>

            {/* Redes (una línea, como en mockup) */}
            <div className="flex justify-center items-center gap-4 sm:gap-5 md:gap-6 flex-wrap max-w-2xl mx-auto">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/16ZPgemiKV/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-1.5 hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* X */}
              <a
                href="https://x.com/defensoriacanal?s=21"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="p-1.5 hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/defensoriacanalmx?igsh=Zmc5d21laW84MWZ4&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-1.5 hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.01
