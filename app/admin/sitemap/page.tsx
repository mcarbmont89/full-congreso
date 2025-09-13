
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function SitemapManagementPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)
  const [sitemapStats, setSitemapStats] = useState({
    totalUrls: 0,
    staticPages: 0,
    newsArticles: 0,
    radioPrograms: 0,
    legislators: 0
  })
  const { toast } = useToast()

  const generateSitemap = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/sitemap.xml')
      if (response.ok) {
        setLastGenerated(new Date().toISOString())
        await fetchSitemapStats()
        toast({
          title: 'Sitemap generado exitosamente',
          description: 'El sitemap se ha actualizado con el contenido más reciente.',
        })
      } else {
        throw new Error('Error al generar sitemap')
      }
    } catch (error) {
      console.error('Error generating sitemap:', error)
      toast({
        title: 'Error al generar sitemap',
        description: 'No se pudo generar el sitemap. Intente nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const fetchSitemapStats = async () => {
    try {
      // Get counts from different APIs
      const [newsRes, programsRes, legislatorsRes] = await Promise.all([
        fetch('/api/news/all'),
        fetch('/api/radio/programs'),
        fetch('/api/legislators')
      ])

      const news = newsRes.ok ? await newsRes.json() : []
      const programs = programsRes.ok ? await programsRes.json() : []
      const legislators = legislatorsRes.ok ? await legislatorsRes.json() : []

      const staticPages = 15 // Approximate count of static pages
      const totalUrls = staticPages + news.length + programs.length + legislators.length

      setSitemapStats({
        totalUrls,
        staticPages,
        newsArticles: news.length,
        radioPrograms: programs.length,
        legislators: legislators.length
      })
    } catch (error) {
      console.error('Error fetching sitemap stats:', error)
    }
  }

  useEffect(() => {
    fetchSitemapStats()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Sitemap</h1>
          <p className="text-gray-600 mt-2">
            Administra el sitemap XML para mejorar el SEO de la plataforma
          </p>
        </div>
        <Button 
          onClick={generateSitemap}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generando...' : 'Regenerar Sitemap'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sitemap Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Estado del Sitemap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Estado:</span>
                <Badge variant="outline" className="text-green-600">
                  Activo
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Total URLs:</span>
                <span className="font-semibold">{sitemapStats.totalUrls}</span>
              </div>
              {lastGenerated && (
                <div className="flex justify-between">
                  <span>Última actualización:</span>
                  <span className="text-sm text-gray-500">
                    {new Date(lastGenerated).toLocaleString('es-MX')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Contenido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Páginas estáticas:</span>
                <span className="font-semibold">{sitemapStats.staticPages}</span>
              </div>
              <div className="flex justify-between">
                <span>Artículos de noticias:</span>
                <span className="font-semibold">{sitemapStats.newsArticles}</span>
              </div>
              <div className="flex justify-between">
                <span>Programas de radio:</span>
                <span className="font-semibold">{sitemapStats.radioPrograms}</span>
              </div>
              <div className="flex justify-between">
                <span>Legisladores:</span>
                <span className="font-semibold">{sitemapStats.legislators}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Herramientas SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/sitemap.xml', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Sitemap XML
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/robots.txt', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Robots.txt
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('https://search.google.com/search-console', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Google Search Console
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Google Search Console</h4>
            <p className="text-sm text-gray-600">
              Registra tu sitio en Google Search Console y envía el sitemap usando la URL: 
              <code className="bg-gray-100 px-2 py-1 rounded mx-1">
                {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sitemap.xml
              </code>
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">2. Bing Webmaster Tools</h4>
            <p className="text-sm text-gray-600">
              También puedes registrar tu sitio en Bing Webmaster Tools para mejorar la indexación en Bing.
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">3. Actualización Automática</h4>
            <p className="text-sm text-gray-600">
              El sitemap se actualiza automáticamente cada vez que se accede. Para forzar una actualización, 
              usa el botón "Regenerar Sitemap" arriba.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
