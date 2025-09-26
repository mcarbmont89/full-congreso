"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ContactForm from "./contact-form";

export default function Footer() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    empresa: "",
    puesto: "",
    ciudad: "",
    estado: "",
    mensaje: "",
  });

  const [formStatus, setFormStatus] = useState<{
    status: "idle" | "submitting" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set form status to submitting
    setFormStatus({ status: "submitting", message: "Enviando mensaje..." });

    try {
      // Send the form data to the API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Reset form on success
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          empresa: "",
          puesto: "",
          ciudad: "",
          estado: "",
          mensaje: "",
        });
        setFormStatus({
          status: "success",
          message: "Mensaje enviado correctamente. Gracias por contactarnos.",
        });
      } else {
        setFormStatus({
          status: "error",
          message:
            result.message ||
            "Error al enviar el mensaje. Por favor, inténtelo de nuevo.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        status: "error",
        message: "Error al enviar el mensaje. Por favor, inténtelo de nuevo.",
      });
    }
  };

  return (
    <footer className="bg-gray-700 text-white">
      {/* App Download Banner */}
      <div className="bg-gray-800 py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-bold uppercase mb-2">
              DESCARGA GRATIS NUESTRA APP
            </h3>
            <p className="text-sm text-gray-300 mb-4 md:mb-0">
              El Canal del Congreso en tus manos
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://play.google.com/store/apps/details?id=com.cic.canalcongreso&hl=es"
              className="inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/google-play-badge.png"
                alt="Get it on Google Play"
                width={140}
                height={42}
              />
            </Link>
            <Link
              href="https://apps.apple.com/mx/app/canal-del-congreso/id1291590905"
              className="inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/app-store-badge.png"
                alt="Download on the App Store"
                width={140}
                height={42}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h3 className="text-center uppercase font-bold mb-4">
              CONTÁCTENOS
            </h3>

            <ContactForm />
          </div>

          {/* Directory and Information */}
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: "#374151" }}
          >
            {/* DIRECTORIO Section */}
            <div className="mb-8">
              <h3 className="uppercase font-bold mb-3 text-white">
                DIRECTORIO
              </h3>
              <h4 className="text-sm font-bold mb-2 text-white">
                CANAL DEL CONGRESO
              </h4>
              <p className="text-sm text-blue-200 opacity-70 mb-1">
                Madrid 62,
              </p>
              <p className="text-sm text-blue-200 opacity-70 mb-1">
                {" "}
                PB Col. Tabacalera,
              </p>
              <p className="text-sm text-blue-200 opacity-70 mb-4">
                {" "}
                C.P. 06030, Ciudad de México.
              </p>
              <Link
                href="https://www.canaldelcongreso.gob.mx/direccion-general"
                className="text-sm text-yellow-300 hover:text-yellow-200 block mb-2"
              >
                Mando Superior
              </Link>
              <Link
                href="https://canaldelcongreso.gob.mx/pdfs/directorio"
                className="text-sm text-yellow-300 hover:text-yellow-200 block mb-6"
              >
                Mandos Medios
              </Link>
            </div>

            {/* SOLICITUD DE SERVICIOS Section */}
            <div className="mb-8">
              <h3 className="uppercase font-bold mb-3 text-white">
                SOLICITUD DE SERVICIOS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://www.canaldelcongreso.gob.mx/files/tucanal/imagen/transparencia/documentos/pdfnormativacanal/guiadelusuario_210715.pdf"
                    className="text-sm text-yellow-300 hover:text-yellow-200 flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-200 opacity-70"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Guía de usuario
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.canaldelcongreso.gob.mx/files/imagenes/PortalTransparencia/Solicitud_Servicios_2025.docx"
                    className="text-sm text-yellow-300 hover:text-yellow-200 flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-200 opacity-70"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Descarga formato
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Logo and Social Links */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/logo-canal-congreso.png"
              alt="Canal del Congreso"
              width={180}
              height={60}
              className="h-16 w-auto mb-4"
            />
            <div className="flex space-x-4 mt-4 py-4 min-h-[80px] items-center">
              <Link 
                href="https://whatsapp.com/channel/0029Vb55Zgo5EjxvIySofH1J" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <span className="sr-only">WhatsApp</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                </svg>
              </Link>
              <Link 
                href="https://www.facebook.com/share/1AEEAeTbkQ/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link 
                href="https://x.com/canalcongreso" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <span className="sr-only">X</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link 
                href="https://www.instagram.com/canalcongresomx?igsh=MW5qNjJjNHU5aWZsdA==" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 715.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UC0qf7R7Vq3H8JSNYfIs3uKg" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link 
                href="https://open.spotify.com/show/17bt21pyYPzCKdHOrgdY3B?si=28wx_d3QTZyEk9M8ABKhWA" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <span className="sr-only">Spotify</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 17.328c-.24 0-.48-.096-.72-.24-2.16-1.2-4.896-1.44-7.68-.72-.24.072-.48-.024-.576-.24-.072-.24.024-.48.24-.576 3.024-.768 6.024-.528 8.4.816.216.144.288.432.144.648-.096.144-.288.312-.552.312zm.96-2.52c-.24 0-.48-.096-.72-.24-2.52-1.44-6.24-1.8-9.36-.96-.288.072-.576-.072-.648-.36-.072-.288.072-.576.36-.648 3.6-.96 7.68-.552 10.56 1.152.24.144.36.48.216.72-.144.24-.288.336-.408.336zm.096-2.64c-.24 0-.48-.096-.72-.24-3.12-1.68-8.16-1.8-11.04-.96-.36.096-.72-.12-.816-.48-.096-.36.12-.72.48-.816 3.36-.96 8.88-.816 12.48 1.152.288.144.432.48.288.768-.144.216-.36.336-.648.336z"/>
                </svg>
              </Link>
              <Link 
                href="https://www.tiktok.com/@canaldelcongresomx?_t=ZS-8yDjQ5NJpX5&_r=1" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transform transition-transform duration-300 hover:scale-95"
              >
                <span className="sr-only">TikTok</span>
                <svg
                  className="h-6 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.377-1.958-1.377-3.338h-3.357v13.83c0 2.417-1.884 4.368-4.301 4.368-2.417 0-4.301-1.951-4.301-4.368s1.884-4.368 4.301-4.368c.338 0 .664.049.976.135v-3.486a7.644 7.644 0 00-.976-.063C4.617 7.038 0 11.655 0 17.17s4.617 10.132 10.132 10.132 10.132-4.617 10.132-10.132V9.295a9.46 9.46 0 005.736 1.939V7.877a6.228 6.228 0 01-6.679-2.315z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 py-2 text-xs text-gray-400">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>Aviso de privacidad</p>
          <p className="md:text-center">
            © Canal del Congreso, todos los derechos reservados 2025
          </p>
          <p>Mapa del sitio</p>
        </div>
      </div>
      {/* If the footer needs any radio-specific content or styling, we can add it here.
      For example, we might want to add radio-specific links or a radio player control in the footer. */}
    </footer>
  );
}
