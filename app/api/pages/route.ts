
import { NextRequest, NextResponse } from 'next/server'

// Mock data for page content
const pageContent = [
  {
    id: '1',
    page: 'transparencia',
    section: 'main',
    title: 'Transparencia - Página Principal',
    content: `<section className="relative w-full h-[500px] flex items-center">
  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-700 z-0">
    <img src="/images/transparency/hero-bg.png" alt="Transparencia" className="w-full h-full object-cover mix-blend-overlay" />
  </div>
  <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center">
    <div className="w-full md:w-1/2 text-white">
      <h1 className="text-6xl font-bold mb-4">INFORME<br />ANUAL</h1>
      <h2 className="text-4xl mb-8">Canal del <span className="text-orange-500">Congreso</span></h2>
      <div className="h-1 w-full bg-orange-500 mb-8"></div>
      <a href="/transparencia/informes" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
        Consulta aquí
      </a>
    </div>
  </div>
</section>`,
    metadata: { hero: true },
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    page: 'transparencia',
    section: 'sections',
    title: 'Explora nuestras Secciones',
    content: `<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Explora nuestras Secciones</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 relative">
          <img src="/images/transparency/compromiso.png" alt="Compromisos con la Transparencia" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 bg-blue-100">
          <h3 className="text-lg font-semibold text-center">Compromisos con la Transparencia</h3>
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 relative">
          <img src="/images/transparency/contacto.png" alt="Contacto" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 bg-blue-100">
          <h3 className="text-lg font-semibold text-center">Contacto</h3>
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 relative">
          <img src="/images/transparency/transparencia-focalizada.png" alt="Transparencia Focalizada" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 bg-blue-100">
          <h3 className="text-lg font-semibold text-center">Transparencia Focalizada</h3>
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="h-48 relative">
          <img src="/images/transparency/datos-abiertos.png" alt="Datos Abiertos" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 bg-blue-100">
          <h3 className="text-lg font-semibold text-center">Datos Abiertos</h3>
        </div>
      </div>
    </div>
  </div>
</section>`,
    metadata: { sections: true },
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    page: 'transparencia',
    section: 'defensoria',
    title: 'Defensoría de Audiencia',
    content: `<section className="py-16 bg-purple-900 text-white">
  <div className="container mx-auto px-4 text-center">
    <div className="flex justify-center mb-6">
      <div className="relative w-32 h-32">
        <img src="/images/defensoria-audiencia.png" alt="Defensoría de Audiencia" className="w-full h-full object-contain" />
      </div>
    </div>
    <h2 className="text-4xl font-bold mb-2">DEFENSORÍA</h2>
    <h3 className="text-4xl font-bold mb-2">DE AUDIENCIA</h3>
    <p className="text-xl mb-8">CANAL DEL CONGRESO</p>
    <h4 className="text-3xl font-bold mb-4">CONTÁCTANOS:</h4>
    <p className="text-2xl mb-6">defensoria.audiencia@canaldelcongreso.gob.mx</p>
    <div className="flex justify-center">
      <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  </div>
</section>`,
    metadata: { contact: true },
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    page: 'contacto',
    section: 'hero',
    title: 'Contacto - Sección Hero',
    content: `<section className="bg-purple-900 text-white py-8">
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold mb-4 text-center">CONTACTO</h1>
    <p className="text-xl max-w-3xl mx-auto text-center mb-8">
      Estamos para servirte, contáctanos para cualquier consulta o sugerencia
    </p>
  </div>
</section>`,
    metadata: { hero: true },
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    page: 'contacto',
    section: 'info',
    title: 'Información de Contacto',
    content: `<div className="space-y-6">
  <div className="flex items-start space-x-3">
    <div className="bg-purple-900 rounded-full p-2 text-white mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    </div>
    <div>
      <h3 className="font-bold text-lg">Dirección</h3>
      <p className="text-gray-600">
        Av. Congreso de la Unión 66, El Parque,<br />
        Venustiano Carranza, 15960<br />
        Ciudad de México, CDMX
      </p>
    </div>
  </div>
  
  <div className="flex items-start space-x-3">
    <div className="bg-purple-900 rounded-full p-2 text-white mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    </div>
    <div>
      <h3 className="font-bold text-lg">Teléfono</h3>
      <p className="text-gray-600">
        +52 (55) 5036-0000<br />
        Lunes a Viernes: 9:00 - 18:00
      </p>
    </div>
  </div>
  
  <div className="flex items-start space-x-3">
    <div className="bg-purple-900 rounded-full p-2 text-white mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    </div>
    <div>
      <h3 className="font-bold text-lg">Correo Electrónico</h3>
      <p className="text-gray-600">
        contacto@canaldelcongreso.gob.mx<br />
        comentarios@canaldelcongreso.gob.mx
      </p>
    </div>
  </div>
</div>`,
    metadata: { contactInfo: true },
    updated_at: new Date().toISOString(),
  }
]

export async function GET() {
  try {
    return NextResponse.json(pageContent)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newPage = {
      id: String(pageContent.length + 1),
      ...data,
      updated_at: new Date().toISOString(),
    }
    
    pageContent.push(newPage)
    
    return NextResponse.json(newPage, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
