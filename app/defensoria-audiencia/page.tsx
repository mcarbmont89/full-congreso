"use client"

import Image from "next/image"
import Footer from "@/components/footer"
import ContactModal from "@/components/defensoria/contact-modal"
import SolicitudesCarousel from "@/components/SolicitudesCarousel"

export default function DefensoriaAudienciaPage() {
  return (
    <>
      <main className="min-h-screen">
        {/* ===================== HERO ===================== */}
        <section className="relative w-full h-[560px] md:h-[600px] overflow-hidden">
          {/* Fondo + overlay */}
          <Image
            src="/images/defensoria-fondo-header.png"
            alt="Fondo Defensoría de Audiencia"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#4f148c]/88" />

          {/* Contenido */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-4">
            {/* Logo */}
            <div className="mb-4 md:mb-6">
              <Image
                src="/images/defensoria-logo.png"
                alt="Defensoría de Audiencia"
                width={220}
                height={110}
                className="w-[160px] md:w-[200px] lg:w-[220px] h-auto"
                priority
              />
            </div>

            {/* Título + subtítulo */}
            <div className="text-center px-4">
              <h1 className="font-black tracking-tight drop-shadow-xl text-[80px] sm:text-[100px] md:text-[130px] lg:text-[160px] xl:text-[180px] leading-[0.85] mb-2">
                ¡TU VOZ IMPORTA!
              </h1>
              <p className="text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30px] font-normal drop-shadow-lg opacity-95">
                Comparte con nosotros tus comentarios
              </p>
            </div>

            {/* Botones (píldora 160×44) */}
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <ContactModal type="Queja">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  className="w-[180px] h-[50px] rounded-full bg-purple-400 hover:bg-purple-500 text-white text-[16px] font-bold shadow-lg transition-all duration-200"
                  style={{backgroundColor: '#b47bc7'}}
                >
                  Quejas
                </button>
              </ContactModal>
              <ContactModal type="Sugerencia">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  className="w-[180px] h-[50px] rounded-full bg-purple-400 hover:bg-purple-500 text-white text-[16px] font-bold shadow-lg transition-all duration-200"
                  style={{backgroundColor: '#b47bc7'}}
                >
                  Sugerencias
                </button>
              </ContactModal>
              <ContactModal type="Felicitaciones">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  className="w-[180px] h-[50px] rounded-full bg-purple-400 hover:bg-purple-500 text-white text-[16px] font-bold shadow-lg transition-all duration-200"
                  style={{backgroundColor: '#b47bc7'}}
                >
                  Felicitaciones
                </button>
              </ContactModal>
            </div>

            {/* Redes: fila centrada, íconos 28px */}
            <div className="mt-12 md:mt-16 flex items-center justify-center gap-5 md:gap-6">
              {[
                { href: "https://www.facebook.com/share/16ZPgemiKV/?mibextid=wwXIfr", label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { href: "https://x.com/defensoriacanal?s=21", label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { href: "https://www.instagram.com/defensoriacanalmx?igsh=Zmc5d21laW84MWZ4&utm_source=qr", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { href: "https://youtube.com/@defensoriadeaudienciacanal5590?si=ODRuPtkx3wFkH2AJ", label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                { href: "https://www.tiktok.com/@defensoriacongresomx?_t=ZS-8ze8m5kkjV1&_r=1", label: "TikTok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
                { href: "https://open.spotify.com/show/defensoriacanal", label: "Spotify", path: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-white/95 hover:text-white">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== ¿QUÉ HACE…? ===================== */}
        <section
          className="relative py-12 md:py-14"
          style={{
            backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-center font-black text-[#1f1f1f] tracking-tight uppercase leading-tight text-[26px] sm:text-[30px] md:text-[36px] mb-8 md:mb-10">
              ¿QUÉ HACE LA DEFENSORÍA<br className="hidden sm:block" /> DE AUDIENCIAS POR TI?
            </h2>

            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
              {/* Card 1 */}
              <div className="rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)] border border-[#7d4bcd] p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Image src="/images/defensoria-icono-1.png" alt="Recibir" width={52} height={52} />
                </div>
                <h3 className="text-[16px] md:text-[17px] font-extrabold text-[#262626] leading-snug">
                  Recibir documentar y procesar<br />
                  tus observaciones,<br />
                  quejas y sugerencias
                </h3>
              </div>

              {/* Card 2 con divisores laterales */}
              <div className="relative rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)] border border-[#7d4bcd] p-6 text-center">
                <span className="hidden md:block absolute -left-4 top-6 bottom-6 w-[2px] bg-[#7d4bcd] opacity-60" />
                <span className="hidden md:block absolute -right-4 top-6 bottom-6 w-[2px] bg-[#7d4bcd] opacity-60" />
                <div className="flex justify-center mb-4">
                  <Image src="/images/defensoria-icono-2.png" alt="Representar" width={52} height={52} />
                </div>
                <h3 className="text-[16px] md:text-[17px] font-extrabold text-[#262626] leading-snug">
                  Representar tus intereses<br />
                  cuando haces alguna<br />
                  solicitud
                </h3>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)] border border-[#7d4bcd] p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Image src="/images/defensoria-icono-3.png" alt="Promover" width={52} height={52} />
                </div>
                <h3 className="text-[16px] md:text-[17px] font-extrabold text-[#262626] leading-snug">
                  Promover y proteger<br />
                  tus derechos en temas<br />
                  de audiencia
                </h3>
              </div>
            </div>

            {/* Botón Conoce la Ley (chico) */}
            <div className="text-center mt-6">
              <a
                href="/files/ConoceTuLey.pdf"
                download
                className="inline-flex h-8 items-center px-5 rounded-full bg-[#7746d6] hover:bg-[#6a38cf] text-white text-[13px] font-semibold transition"
              >
                Conoce la Ley
              </a>
            </div>
          </div>
        </section>

        {/* ===================== CONOCE A TU DEFENSORA ===================== */}
        <section className="relative py-12 md:py-16 text-white" style={{ backgroundImage: "url('/images/defensora-background.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase mb-8 md:mb-12">
              CONOCE A TU DEFENSORA<br />DE AUDIENCIA
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:basis-1/4 md:shrink-0">
                <div className="relative h-[1920px] md:h-[2240px] rounded-lg overflow-hidden shadow-xl bg-purple-300 flex items-center justify-center">
                  <div className="text-center text-purple-800 font-bold">
                    <div className="text-6xl mb-2">👤</div>
                    <div>Defensora Photo</div>
                  </div>
                  <Image
                    src="/images/defensora-photo.jpg"
                    alt="Defensora de Audiencia"
                    fill
                    className="object-cover z-10"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="md:basis-3/4 md:min-w-0 space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-4">
                  Mtra. María Gabriela Ortiz Portilla
                </h3>
                <div className="space-y-4 text-sm md:text-[15px] leading-6 text-white/95">
                  <p>
                    Es Licenciada en Relaciones Internacionales por la Universidad Iberoamericana donde
                    realizó un Diplomado en Derecho Internacional en la Université Jean Moulin Lyon en
                    Francia, además, cuenta con una maestría en Derecho por la Universidad Anáhuac y un
                    Máster en Comunicación Política y Gobernanza por The George Washington University,
                    donde realizó un trabajo de investigación sobre perspectiva de género y su utilidad en las
                    instituciones de gobierno.
                  </p>
                  <p>
                    El 26 de abril de 2022 fue designada como Defensora de la Audiencia del Canal del
                    Congreso por el H. Comité de Información del Canal de Televisión del Congreso General de los
                    Estados Unidos Mexicanos.
                  </p>
                  <p>
                    Desde la Defensoría de Audiencia del Canal del Congreso ha trabajado por la igualdad de
                    género, en octubre 2023, organizó y moderó un foro virtual de mujeres especialistas en
                    violencia de género y violencia mediática. Durante este enriquecedor proyecto, trabajó
                    directamente con lideresas de espacios sociales de gran relevancia social y de actualidad de
                    igualdad de género se sean reflejados en la programación del Canal del Congreso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== RECIENTES SOLICITUDES ===================== */}
        <section className="py-12 md:py-16" style={{ backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')" }}>
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <h2 className="text-center font-black uppercase text-[22px] md:text-[28px] mb-6">
              RECIENTES SOLICITUDES ATENDIDAS
            </h2>

            {/* Carousel de solicitudes */}
            <SolicitudesCarousel />
          </div>
        </section>

        {/* ===================== INFORMES Y REPORTES ===================== */}
        <section className="py-12 md:py-16 bg-gray-50" style={{ backgroundImage: "url('/images/defensoria-micrositio-fondo-new.png')" }}>
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <h2 className="text-center font-black uppercase text-[22px] md:text-[28px] mb-8 text-gray-800">
              INFORMES Y REPORTES
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  titulo: "Informe Trimestral Q2 2024",
                  descripcion: "Análisis de quejas, sugerencias y solicitudes del segundo trimestre del año.",
                  fecha: "Julio 2024",
                  archivo: "/files/informe-q2-2024.pdf"
                },
                {
                  titulo: "Reporte de Transparencia 2024",
                  descripcion: "Detalle de las acciones implementadas para garantizar la transparencia informativa.",
                  fecha: "Agosto 2024", 
                  archivo: "/files/transparencia-2024.pdf"
                },
                {
                  titulo: "Estadísticas de Audiencia",
                  descripcion: "Métricas y análisis del alcance de nuestras transmisiones legislativas.",
                  fecha: "Septiembre 2024",
                  archivo: "/files/estadisticas-audiencia.pdf"
                }
              ].map((informe, i) => (
                <div key={i} className="bg-white rounded-xl p-6 hover:bg-gray-50 transition-colors shadow-md border border-gray-200">
                  <h3 className="font-extrabold text-lg mb-2 text-gray-800">
                    {informe.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-5">
                    {informe.descripcion}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {informe.fecha}
                    </span>
                    <a 
                      href={informe.archivo}
                      download
                      className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full hover:bg-purple-700 transition-colors"
                    >
                      Descargar PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}