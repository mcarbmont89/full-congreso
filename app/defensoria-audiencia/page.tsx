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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 8.001a4 4 0 110 8 4 4 0 010-8zm6.406-1.521c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com/@defensoriadeaudienciacanal5590?si=ODRuPtkx3wFkH2AJ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-1.5 hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@defensoriacongresomx?_t=ZS-8ze8m5kkjV1&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-1.5 hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              {/* Spotify */}
              <a
                href="https://open.spotify.com/show/defensoriacanal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Spotify"
                className="p-1.5 hover:text-purple-200 transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ¿Qué hace la Defensoría? */}
        <section
          className="py-16 md:py-20 relative"
          style={{
            backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="font-extrabold text-gray-900 leading-tight text-[28px] sm:text-[34px] md:text-[40px]">
                ¿QUÉ HACE LA <span className="text-purple-700">DEFENSORÍA</span>
                <br className="hidden sm:block" />
                <span className="text-purple-700">DE AUDIENCIAS</span> POR TI?
              </h2>
            </div>

            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-md border border-purple-200/60 p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Image
                    src="/images/defensoria-icono-1.png"
                    alt="Recibir documentar y procesar"
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                  Recibir documentar y
                  <br /> procesar tus observaciones,
                  <br /> quejas y sugerencias
                </h3>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-md border border-purple-200/60 p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Image
                    src="/images/defensoria-icono-2.png"
                    alt="Representar intereses"
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                  Representar tus intereses
                  <br /> cuando haces alguna
                  <br /> solicitud
                </h3>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl shadow-md border border-purple-200/60 p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Image
                    src="/images/defensoria-icono-3.png"
                    alt="Promover y proteger derechos"
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                  Promover y proteger
                  <br /> tus derechos en temas
                  <br /> de audiencia
                </h3>
              </div>
            </div>

            {/* Botón Conoce la Ley (centrado) */}
            <div className="text-center mt-10 md:mt-12">
              <ConoceTuLeyButton variant="primary" defaultText="Conoce la Ley" />
            </div>
          </div>
        </section>

        {/* Perfil Defensora (editable por CMS) */}
        <Suspense fallback={<div className="py-20 text-center">Cargando información…</div>}>
          <DefensoraProfile />
        </Suspense>

        {/* Recientes solicitudes (carrusel / tarjetas) */}
        <Suspense fallback={<div className="py-20 text-center">Cargando solicitudes…</div>}>
          <RecentRequests />
        </Suspense>

        {/* Informes (PDF/Word por año) */}
        <Suspense fallback={<div className="py-20 text-center">Cargando informes…</div>}>
          <ReportsSection />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
