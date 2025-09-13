"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Tv } from 'lucide-react'

interface FeaturedProgram {
  id: string
  title: string
  description: string
  schedule: string
  imageUrl: string
  isActive: boolean
  displayOrder: number
}

function FeaturedProgramsSection() {
  const [featuredPrograms, setFeaturedPrograms] = useState<FeaturedProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedPrograms = async () => {
      try {
        const response = await fetch('/api/featured-programs')
        if (response.ok) {
          const data = await response.json()
          const activePrograms = data
            .filter((program: FeaturedProgram) => program.isActive)
            .sort((a: FeaturedProgram, b: FeaturedProgram) => a.displayOrder - b.displayOrder)
          setFeaturedPrograms(activePrograms)
        }
      } catch (error) {
        console.error('Error fetching featured programs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedPrograms()
  }, [])

  if (isLoading) {
    return (
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-12 text-center">
            Programas Destacados
          </h2>
          <div className="text-center">Cargando programas...</div>
        </div>
      </section>
    )
  }

  if (featuredPrograms.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-12 text-center">
          Programas Destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-32 md:h-48 bg-gray-200">
                {program.imageUrl ? (
                  <Image
                    src={program.imageUrl}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Imagen del programa</span>
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-bold text-sm md:text-base mb-1 md:mb-2">{program.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
                  {program.description}
                </p>
                <p className="text-purple-600 font-medium text-xs md:text-sm">
                  {program.schedule}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ProgramacionPage() {
  const [currentChannel, setCurrentChannel] = useState("45.1");
  const [programmingData, setProgrammingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const channels = [
    { id: "45.1", name: "Canal 45.1", color: "bg-gray-600" },
    { id: "45.2", name: "Canal 45.2", color: "bg-red-500" },
    { id: "45.3", name: "Canal 45.3", color: "bg-green-500" },
  ];

  useEffect(() => {
    fetchProgramming();
  }, []);

  const fetchProgramming = async () => {
    try {
      const response = await fetch("/api/programacion");
      const data = await response.json();
      setProgrammingData(data.data);
    } catch (error) {
      console.error("Error fetching programming:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-lg">Cargando programación...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100">
        {/* Hero Section */}
        <section className="bg-purple-900 text-white py-6 md:py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-center">
              PROGRAMACIÓN
            </h1>
            <p className="text-base md:text-xl max-w-3xl mx-auto text-center mb-4 md:mb-8">
              Consulta la programación semanal del Canal del Congreso
            </p>
          </div>
        </section>

        {/* Channel Selector */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
                    currentChannel === channel.id
                      ? `${channel.color} text-white shadow-lg`
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {channel.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Programming Schedule */}
        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
              Programación:{" "}
              {channels.find((c) => c.id === currentChannel)?.name}
            </h2>

            {programmingData && programmingData[currentChannel] ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Programa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {programmingData[currentChannel].map(
                        (programa: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {programa.hora || programa.time || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {programa.programa || programa.program || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {programa.descripcion ||
                                programa.description ||
                                "Sin descripción"}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {programmingData[currentChannel].map(
                    (programa: any, index: number) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                            {programa.hora || programa.time || "N/A"}
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {programa.programa || programa.program || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {programa.descripcion ||
                            programa.description ||
                            "Sin descripción"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">
                  No hay programación disponible para{" "}
                  {channels.find((c) => c.id === currentChannel)?.name}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  La programación se actualiza desde el panel de administración
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Programs Section - Hidden */}
        {/* <FeaturedProgramsSection /> */}
      </main>

      <Footer />
    </div>
  );
}