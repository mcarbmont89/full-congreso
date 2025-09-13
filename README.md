
# Radio Congreso - Plataforma Digital de Transmisión Legislativa

Una aplicación integral de Next.js para gestionar y transmitir contenido radial del congreso, noticias, transmisiones en vivo e información de transparencia.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Características](#características)
- [Configuración e Instalación](#configuración-e-instalación)
- [Configuración del Entorno](#configuración-del-entorno)
- [Esquema de Base de Datos](#esquema-de-base-de-datos)
- [Endpoints de API](#endpoints-de-api)
- [Componentes](#componentes)
- [Páginas y Rutas](#páginas-y-rutas)
- [Panel de Administración](#panel-de-administración)
- [SEO y Sitemap](#seo-y-sitemap)
- [Despliegue](#despliegue)
- [Estructura de Archivos](#estructura-de-archivos)
- [Guías de Desarrollo](#guías-de-desarrollo)

## Descripción General

Radio Congreso es una aplicación web full-stack construida con Next.js 15, React 19 y PostgreSQL. Sirve como plataforma digital de transmisión para contenido legislativo del Congreso, ofreciendo:

- Transmisión de radio en vivo y gestión de podcasts
- Publicación y categorización de artículos de noticias
- Capacidades de transmisión de video en vivo
- Sistema administrativo de gestión de contenido
- Portal de transparencia e información legislativa
- Diseño responsive con características de accesibilidad

## Arquitectura

### Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS, componentes Radix UI
- **Backend**: Rutas API de Next.js, PostgreSQL
- **Autenticación**: Auth basado en JWT con cookies HTTP-only
- **Almacenamiento de Archivos**: Sistema de archivos local con servicio API
- **Tiempo Real**: Renderizado del lado del servidor con contenido dinámico
- **Despliegue**: Replit Cloud Run (Autoescalado)

### Librerías Principales

```json
{
  "core": ["next", "react", "typescript"],
  "ui": ["@radix-ui/*", "tailwindcss", "lucide-react"],
  "database": ["pg", "@types/pg"],
  "auth": ["jsonwebtoken", "bcryptjs", "jose"],
  "content": ["quill", "@uiw/react-md-editor"],
  "media": ["hls.js"],
  "utils": ["date-fns", "zod", "xlsx"]
}
```

## Características

### Gestión de Contenido
- **Sistema de Noticias**: Editor de texto enriquecido, programación, categorías, subida de imágenes
- **Programas de Radio**: Gestión de episodios, manejo de archivos de audio, metadatos
- **Transmisiones en Vivo**: Transmisión de video en tiempo real con soporte HLS
- **Programación**: Gestión de horarios de programación basada en grilla

### Características de Usuario
- **Diseño Responsive**: Enfoque mobile-first con accesibilidad
- **Soporte Multicanal**: Diferentes canales de radio (45.1, 45.2, 45.3)
- **Búsqueda y Filtros**: Descubrimiento de contenido a través de todos los tipos de medios
- **Integración Social**: Feeds de Twitter y compartir en redes sociales
- **Soporte de Temas**: Modo claro/oscuro con detección de preferencias del sistema

### Características Administrativas
- **Acceso Basado en Roles**: Permisos de Administrador, Editor, Visualizador
- **Operaciones Masivas**: Subida masiva para contenido y programación
- **Gestión de Base de Datos**: Herramientas de migración de esquemas y gestión de datos
- **Configuración de Email**: Configuración SMTP para notificaciones
- **Gestión de Archivos**: Manejo de subidas con validación y optimización

## Configuración e Instalación

### Prerrequisitos
- Node.js 18+ 
- Base de datos PostgreSQL
- Servidor SMTP (opcional)

### Pasos de Instalación

1. **Clonar e Instalar**
```bash
git clone <repository-url>
cd radio-congreso
npm install
```

2. **Configuración del Entorno**
```bash
cp .env.example .env.local
# Configurar las variables de entorno
```

3. **Configuración de Base de Datos**
```bash
# Ejecutar configuración inicial de base de datos
npm run dev
# Navegar a /admin y usar herramientas de inicialización de base de datos
```

4. **Iniciar Servidor de Desarrollo**
```bash
npm run dev
# La aplicación corre en http://localhost:3000
```

## Configuración del Entorno

### Variables Requeridas

```env
# Configuración de Base de Datos
DATABASE_URL=postgresql://user:password@host:port/database
PGDATABASE=database_name
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password

# URLs de la Aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Autenticación
JWT_SECRET=your-super-secret-key-change-in-production

# Seguridad de API
X_BEARER_TOKEN=your-api-bearer-token

# Email (Opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Configuraciones de Producción

```env
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
# Usar secretos JWT más fuertes y certificados SSL apropiados
```

## Esquema de Base de Datos

### Tablas Principales

#### Sistema de Noticias
```sql
-- news: Artículos principales de noticias
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT,
  imageUrl VARCHAR(500),
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft',
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- video_news: Contenido de video
CREATE TABLE video_news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnailUrl VARCHAR(500),
  videoUrl VARCHAR(500),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Sistema de Radio
```sql
-- radio_programs: Definiciones de programas
CREATE TABLE radio_programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logoUrl VARCHAR(500),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- radio_episodes: Episodios individuales
CREATE TABLE radio_episodes (
  id SERIAL PRIMARY KEY,
  programId INTEGER REFERENCES radio_programs(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  audioUrl VARCHAR(500),
  duration INTEGER,
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Transmisiones en Vivo
```sql
-- live_streams: Transmisiones de video en vivo
CREATE TABLE live_streams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  thumbnailUrl VARCHAR(500),
  streamUrl VARCHAR(500),
  channel VARCHAR(50),
  isLive BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'offline',
  createdAt TIMESTAMP DEFAULT NOW()
);
```

#### Datos Legislativos
```sql
-- legislators: Representantes del congreso
CREATE TABLE legislators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  party VARCHAR(100),
  state VARCHAR(100),
  photoUrl VARCHAR(500),
  bio TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- organs: Órganos/comités del congreso
CREATE TABLE organs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logoUrl VARCHAR(500),
  type VARCHAR(100),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## Endpoints de API

### APIs Públicas

#### Endpoints de Noticias
```typescript
GET /api/news/all          // Obtener todas las noticias publicadas
GET /api/news/[id]         // Obtener artículo específico
POST /api/news             // Crear noticia (solo admin)
PUT /api/news/[id]         // Actualizar noticia (solo admin)
DELETE /api/news/[id]      // Eliminar noticia (solo admin)
POST /api/news/publish-scheduled // Auto-publicar contenido programado
```

#### Endpoints de Radio
```typescript
GET /api/radio/programs    // Obtener todos los programas de radio
GET /api/radio/episodes    // Obtener episodios con filtros
GET /api/radio/live-status // Obtener estado actual de radio en vivo
GET /api/radio/config      // Obtener configuración de radio
```

#### Transmisiones en Vivo
```typescript
GET /api/live-streams      // Obtener transmisiones en vivo activas
GET /api/live-streams/all  // Obtener todas las transmisiones (admin)
POST /api/live-streams     // Crear transmisión (admin)
PUT /api/live-streams/[id] // Actualizar transmisión (admin)
```

#### Datos Legislativos
```typescript
GET /api/legislators       // Obtener legisladores con filtros
GET /api/legislators/estados // Obtener lista de estados
GET /api/organs           // Obtener órganos del congreso
GET /api/parliamentary-groups // Obtener grupos parlamentarios
```

### APIs de Administración

#### Gestión de Contenido
```typescript
POST /api/upload          // Endpoint de subida de archivos
GET /api/files/[...path]  // Endpoint de servicio de archivos
POST /api/programacion/upload // Subida de programación (Excel)
```

#### Gestión del Sistema
```typescript
GET /api/admin/test-connection   // Prueba de conexión de base de datos
POST /api/admin/init-db          // Inicializar base de datos
POST /api/admin/create-missing-tables // Actualizaciones de esquema
```

### Autenticación
```typescript
POST /api/auth/login      // Login de usuario
POST /api/auth/logout     // Logout de usuario
GET /api/auth/verify      // Verificación de token
```

## SEO y Sitemap

### Generación Automática de Sitemap

La plataforma incluye un sistema completo de generación de sitemap XML que mejora el SEO y la indexación en motores de búsqueda.

#### Características del Sitemap
- **Generación Dinámica**: El sitemap se actualiza automáticamente con contenido nuevo
- **Múltiples Tipos de Contenido**: Incluye páginas estáticas, noticias, programas de radio y legisladores
- **Configuración SEO**: Prioridades y frecuencias de cambio optimizadas
- **Panel de Administración**: Gestión desde `/admin/sitemap`

#### URLs del Sitemap
```
/sitemap.xml              // Sitemap principal (dinámico)
/robots.txt               // Archivo robots.txt
```

#### Contenido Incluido en el Sitemap
- **Páginas Estáticas**: Todas las páginas principales del sitio
- **Noticias**: Artículos individuales y páginas de categorías
- **Programas de Radio**: Páginas de programas y episodios
- **Legisladores**: Perfiles individuales de legisladores
- **Transparencia**: Todas las secciones del portal de transparencia

#### Configuración SEO por Tipo de Contenido
```xml
<!-- Páginas principales -->
<priority>0.8</priority>
<changefreq>weekly</changefreq>

<!-- Noticias -->
<priority>0.6</priority>
<changefreq>monthly</changefreq>

<!-- Programas de radio -->
<priority>0.7</priority>
<changefreq>weekly</changefreq>

<!-- Legisladores -->
<priority>0.5</priority>
<changefreq>monthly</changefreq>
```

#### Gestión Administrativa del Sitemap (`/admin/sitemap`)

El panel administrativo permite:
- **Regeneración Manual**: Forzar actualización del sitemap
- **Estadísticas**: Ver número total de URLs incluidas
- **Monitoreo**: Verificar última actualización
- **Configuración**: Instrucciones para Google Search Console y Bing

#### Robots.txt
```
User-agent: *
Allow: /

# Bloquear área administrativa
Disallow: /admin/
Disallow: /api/

# Bloquear navegación de directorio de uploads
Disallow: /uploads/

Sitemap: https://your-domain.com/sitemap.xml
```

## Componentes

### Componentes UI (`components/ui/`)

Construidos con primitivos Radix UI:
- **Formularios**: Input, Textarea, Select, Checkbox, Switch
- **Layout**: Card, Sheet, Dialog, Tabs, Accordion
- **Navegación**: Button, DropdownMenu, NavigationMenu
- **Visualización de Datos**: Table, Badge, Avatar, Progress
- **Retroalimentación**: Toast, Alert, Skeleton

### Componentes Personalizados

#### Componentes de Layout
```typescript
// Navegación y estructura
Navbar                    // Navegación principal con menú responsive
Footer                    // Pie de página con enlaces
SocialBar                // Enlaces de redes sociales
ConditionalComponents     // Renderizado de componentes según contexto
```

#### Visualización de Contenido
```typescript
// Noticias y artículos
NewsCarousel             // Carrusel de noticias destacadas
NewsGrid                 // Grilla de artículos de noticias
NewsSubmenu              // Navegación de categorías de noticias

// Radio y audio
AudioPlayer              // Reproductor de audio HTML5
RadioLogo                // Logos dinámicos de canales de radio
ProgramCarousel          // Carrusel de showcase de programas

// Video y streaming
VideoGrid                // Grilla de contenido de video
VideoCarousel            // Carrusel de contenido de video
```

#### Componentes Interactivos
```typescript
// Búsqueda y descubrimiento
RadioSearch              // Búsqueda de contenido de radio
LegislatorSearch         // Búsqueda de miembros legislativos

// Gestión de contenido
RichTextEditor           // Editor basado en Quill.js
BulkNewsUpload           // Subida CSV/Excel para noticias
BulkEpisodeUpload        // Creación masiva de episodios

// Utilidades
SafeImage                // Componente de imagen con manejo de errores
ErrorBoundary            // Boundary de errores de React
ThemeProvider            // Contexto de tema claro/oscuro
```

### Proveedores de Contexto

```typescript
// Gestión de estado global
MobileMenuProvider       // Estado de navegación móvil
FloatingPlayerProvider   // Estado del reproductor de audio
ThemeProvider           // Gestión de preferencias de tema
```

## Páginas y Rutas

### Rutas Públicas

#### Secciones Principales
```
/                       // Página de inicio con contenido destacado
/noticias              // Hub de sección de noticias
/noticias/[id]         // Artículo individual de noticias
/noticias/todas        // Archivo de todas las noticias
/noticias/categorias/[category] // Noticias filtradas por categoría
/noticias/en-vivo      // Sección de noticias/video en vivo
```

#### Sección de Radio
```
/radio                 // Hub de radio con reproductor en vivo
/radio/[programSlug]   // Páginas de programas individuales
/radio/[programSlug]/episodios // Archivo de episodios del programa
/radio/legisladores    // Perfiles de miembros legislativos
/radio/legisladores/[id] // Página individual de legislador
/radio/legisladores/busqueda // Búsqueda de legisladores
```

#### Portal de Transparencia
```
/transparencia         // Hub de transparencia
/transparencia/focalizada // Transparencia focalizada
/transparencia/compromisos // Sección de compromisos
/transparencia/datos-abiertos // Portal de datos abiertos
/transparencia/plataforma-nacional // Plataforma nacional
```

#### Páginas de Utilidad
```
/programacion          // Programación de TV
/transmisiones         // Transmisiones en vivo
/contacto             // Información de contacto
/login                // Login de administrador
```

### Rutas de Administración (`/admin/*`)

#### Gestión de Contenido
```
/admin                 // Panel de control
/admin/news            // Gestión de noticias
/admin/video-news      // Gestión de video noticias
/admin/live-streams    // Gestión de transmisiones en vivo
/admin/programs        // Gestión de programas de TV
/admin/featured-programs // Contenido destacado
```

#### Administración de Radio
```
/admin/radio           // Panel de radio
/admin/radio-programs  // Gestión de programas de radio
/admin/radio-episodes  // Gestión de episodios
/admin/radio-navigation // Configuración de menú de navegación
/admin/radio-live      // Configuraciones de radio en vivo
```

#### Configuración del Sistema
```
/admin/users           // Gestión de usuarios
/admin/channels        // Configuración de canales de TV
/admin/homepage-config // Personalización de página de inicio
/admin/database-config // Gestión de base de datos
/admin/smtp-config     // Configuración de email
/admin/sitemap         // Gestión de sitemap y SEO
```

#### Datos Legislativos
```
/admin/legislators     // Gestión de legisladores
/admin/organs          // Órganos del congreso
/admin/parliamentary-groups // Grupos políticos
/admin/pages           // Gestión de páginas estáticas
```

## Panel de Administración

### Sistema de Autenticación

El panel de administración usa autenticación basada en JWT con cookies HTTP-only:

```typescript
// Flujo de login
POST /api/auth/login {
  username: string,
  password: string
}
// Retorna: Token JWT en cookie HTTP-only

// Middleware de rutas protegidas
middleware.ts // Verifica JWT para rutas /admin
```

### Roles de Usuario
- **Admin**: Acceso completo al sistema
- **Editor**: Creación y edición de contenido
- **Visualizador**: Acceso solo de lectura

### Características Principales del Admin

#### Gestión de Contenido
- **Editor de Texto Enriquecido**: Integración Quill.js con subida de imágenes
- **Programación**: Publicar contenido en horarios específicos
- **Operaciones Masivas**: Importación CSV/Excel para creación masiva de contenido
- **Biblioteca de Medios**: Sistema de subida y gestión de archivos

#### Gestión de Base de Datos
- **Migración de Esquema**: Creación y actualizaciones automatizadas de tablas
- **Importación/Exportación de Datos**: Creación y restauración de dumps SQL
- **Pruebas de Conexión**: Verificación de conectividad de base de datos

#### Configuración del Sistema
- **Configuración SMTP**: Configuración de servidor de email con pruebas
- **Gestión de Canales**: Logos y metadatos de canales de TV
- **Personalización de Página de Inicio**: Imágenes hero y contenido destacado
- **Configuración de Navegación**: Estructura de menús

## Despliegue

### Despliegue en Replit (Recomendado)

La aplicación está configurada para despliegue en Replit Cloud Run:

```bash
# Configuración de build
npm run build

# Inicio de producción
npm start

# Configuraciones de despliegue
PORT: 3000
HOST: 0.0.0.0
```

### Variables de Entorno en Producción

```env
# Base de datos de producción
DATABASE_URL=postgresql://prod-user:pass@prod-host:5432/prod-db

# URLs de producción
NEXT_PUBLIC_BASE_URL=https://your-repl-domain.replit.dev
NEXT_PUBLIC_APP_URL=https://your-repl-domain.replit.dev

# Secretos fuertes de producción
JWT_SECRET=production-secret-key-minimum-32-characters
X_BEARER_TOKEN=production-bearer-token
```

### Configuración de Base de Datos en Producción

1. **Crear base de datos PostgreSQL** en tu proveedor preferido
2. **Configurar variables de entorno** en Replit Secrets
3. **Ejecutar inicialización de base de datos** vía `/admin/database-config`
4. **Importar datos iniciales** usando scripts SQL proporcionados

### Optimizaciones de Rendimiento

```javascript
// Optimizaciones en next.config.mjs
export default {
  output: 'standalone',           // Builds optimizados para Docker
  images: { unoptimized: true },  // Imágenes listas para CDN
  trailingSlash: false,          // URLs limpias
  generateBuildId: () => Date.now().toString(), // Cache busting
}
```

## Estructura de Archivos

### Directorios Principales

```
app/                    # Directorio app de Next.js 13+
├── admin/             # Páginas del panel de administración
├── api/               # Manejadores de rutas API
├── noticias/          # Páginas de sección de noticias
├── radio/             # Páginas de sección de radio
├── transparencia/     # Portal de transparencia
├── globals.css        # Estilos globales
├── layout.tsx         # Layout raíz
└── page.tsx           // Página de inicio

components/            # Componentes React reutilizables
├── ui/               # Componentes UI base (Radix)
├── transparency/     # Componentes específicos de transparencia
└── *.tsx             # Componentes específicos de características

lib/                  # Librerías de utilidad
├── api.ts            # Funciones cliente API
├── database.ts       # Conexión de base de datos
├── auth.ts           # Utilidades de autenticación
├── upload.ts         # Manejo de subida de archivos
└── utils.ts          # Utilidades generales

public/               # Assets estáticos
├── images/           # Imágenes de aplicación
├── uploads/          # Contenido subido por usuarios
└── *.png             # Favicon y logos

styles/               # Hojas de estilo adicionales
├── globals.css       # Importaciones CSS globales
└── rich-text.css     # Estilos del editor de texto enriquecido
```

### Archivos de Configuración

```
next.config.mjs       # Configuración de Next.js
tailwind.config.js    # Configuración de Tailwind CSS
tsconfig.json         # Configuración de TypeScript
package.json          # Dependencias y scripts
.env.example          # Plantilla de entorno
.replit               # Configuración de despliegue en Replit
```

### Scripts de Base de Datos

```
database-schema.sql   # Esquema principal de base de datos
radio-database-schema.sql # Tablas específicas de radio
*.sql                 # Scripts de migración y configuración
scripts/              # Utilidades de base de datos en Node.js
```

## Guías de Desarrollo

### Organización de Código

#### Estructura de Componentes
```typescript
// Plantilla estándar de componente
import React from 'react'
import { ComponentProps } from './types'

interface Props extends ComponentProps {
  // Props específicos del componente
}

export default function ComponentName({ ...props }: Props) {
  // Lógica del componente
  return (
    <div className="component-class">
      {/* JSX del componente */}
    </div>
  )
}
```

#### Estructura de Rutas API
```typescript
// Plantilla estándar de ruta API
import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verificación de autenticación
    const user = await authenticate(request)
    
    // Lógica de negocio
    const data = await fetchData()
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Mensaje de error' }, 
      { status: 500 }
    )
  }
}
```

### Patrones de Base de Datos

#### Organización de Consultas
```typescript
// lib/api.ts - Consultas de base de datos centralizadas
export async function getNewsFromDB(): Promise<NewsItem[]> {
  const query = `
    SELECT id, title, summary, content, imageUrl, category, publishedAt, createdAt
    FROM news 
    WHERE status = 'published' 
    ORDER BY publishedAt DESC
  `
  const result = await db.query(query)
  return result.rows
}
```

#### Manejo de Errores
```typescript
// Patrón consistente de manejo de errores
try {
  const result = await databaseOperation()
  return result
} catch (error) {
  console.error('Operación falló:', error)
  throw new Error('Mensaje de error amigable para usuario')
}
```

### Patrones de Frontend

#### Gestión de Estado
```typescript
// Contexto para estado global
const AppContext = createContext<AppState>()

// Estado local para estado de componente
const [state, setState] = useState<StateType>(initialState)

// Estado del servidor con estados de carga apropiados
const [data, setData] = useState<DataType[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

#### Convenciones de Estilos
```typescript
// Organización de clases Tailwind
<div className={cn(
  "base-classes",
  "responsive-classes md:different-classes",
  "state-classes hover:state-change",
  conditionalClasses && "conditional-classes",
  className // Permitir override de prop
)}>
```

### Mejores Prácticas de Rendimiento

#### Optimización de Imágenes
```typescript
// Usar componente Image de Next.js con sizing apropiado
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Texto alt descriptivo"
  width={400}
  height={300}
  className="object-cover"
  loading="lazy"
/>
```

#### Optimización de API
```typescript
// Cache para datos estáticos
export const revalidate = 3600 // 1 hora

// Forzar dinámico para datos en tiempo real
export const dynamic = 'force-dynamic'

// Boundaries de error apropiados
export const fetchCache = 'force-no-store'
```

### Consideraciones de Seguridad

#### Validación de Input
```typescript
// Usar Zod para validación en tiempo de ejecución
import { z } from 'zod'

const NewsSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  category: z.enum(['política', 'economía', 'sociedad'])
})
```

#### Verificaciones de Autenticación
```typescript
// Protección de middleware para rutas de admin
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return authenticateRequest(request)
  }
}
```

#### Prevención de Inyección SQL
```typescript
// Siempre usar consultas parametrizadas
const query = 'SELECT * FROM news WHERE id = $1'
const result = await db.query(query, [newsId])
```

Esta documentación proporciona una descripción integral de la plataforma Radio Congreso. Para detalles específicos de implementación, consultar los archivos individuales de componentes y API en el código base.

## Contribuir

1. Seguir los patrones de código establecidos
2. Escribir TypeScript con definiciones de tipo apropiadas
3. Usar Tailwind CSS para estilos
4. Probar funcionalidad del panel de administración antes del despliegue
5. Asegurar responsividad móvil
6. Seguir guías de accesibilidad

## Licencia

Este proyecto es software propietario para Radio Congreso.
