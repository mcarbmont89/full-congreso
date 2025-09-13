# Manual de Usuario - Radio Congreso
## Plataforma Digital de Transmisión Legislativa

### Versión 1.0
### Fecha: Julio 2025

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Navegación General](#navegación-general)
4. [Sección de Noticias](#sección-de-noticias)
5. [Radio Congreso](#radio-congreso)
6. [Transmisiones en Vivo](#transmisiones-en-vivo)
7. [Portal de Transparencia](#portal-de-transparencia)
8. [Programación](#programación)
9. [Panel de Administración](#panel-de-administración)
10. [Solución de Problemas](#solución-de-problemas)
11. [Contacto y Soporte](#contacto-y-soporte)

---

## Introducción

### ¿Qué es Radio Congreso?

Radio Congreso es una plataforma digital diseñada para la transmisión de contenido legislativo del Congreso de la Unión de México. La plataforma ofrece:

- **Transmisión en vivo** de sesiones legislativas por canales 45.1, 45.2 y 45.3
- **Radio en línea** con programas especializados
- **Portal de noticias** legislativas actualizadas
- **Portal de transparencia** con información del Congreso
- **Programación televisiva** de los canales del Congreso

### Características Principales

- ✅ Interfaz responsive (móviles, tablets y escritorio)
- ✅ Transmisión de audio y video en tiempo real vía HLS
- ✅ Sistema de gestión de contenido
- ✅ Portal de transparencia legislativa
- ✅ Búsqueda de legisladores
- ✅ Panel de administración completo

---

## Acceso al Sistema

### Para Usuarios Generales

1. **Acceso Web**: Ingrese a la URL principal de la plataforma
2. **Navegación libre**: No requiere registro para consultar contenido público
3. **Funciones disponibles**:
   - Ver noticias
   - Escuchar radio en vivo
   - Ver transmisiones en vivo
   - Consultar transparencia
   - Buscar legisladores

### Para Administradores

1. **Página de acceso**: `/login`
2. **Credenciales**: Usuario y contraseña del sistema
3. **Panel administrativo**: Acceso a `/admin` después del login

---

## Navegación General

### Menú Principal

#### **Inicio** (`/`)
- Página principal con noticias destacadas
- Carrusel de transmisiones en vivo
- Acceso a secciones principales

#### **Noticias** (`/noticias`)
- `/noticias` - Página principal de noticias
- `/noticias/todas` - Todas las noticias
- `/noticias/categorias/[categoria]` - Noticias por categoría (política, economía, sociedad)
- `/noticias/en-vivo` - Video noticias en vivo
- `/noticias/[id]` - Artículo individual

#### **Radio** (`/radio`)
- Radio en vivo con streaming de audio
- Programas disponibles:
  - Entrevistas
  - Sitio Abierto
  - Noticias del Congreso
- `/radio/legisladores` - Directorio de legisladores
- `/radio/legisladores/busqueda` - Búsqueda avanzada

#### **Transmisiones** (`/transmisiones`)
- Canales en vivo: 45.1, 45.2, 45.3
- Streaming de video con HLS

#### **Transparencia** (`/transparencia`)
- `/transparencia/focalizada` - Transparencia focalizada
- `/transparencia/datos-abiertos` - Datos abiertos
- `/transparencia/compromisos` - Compromisos institucionales
- `/transparencia/plataforma-nacional` - Plataforma nacional

#### **Programación** (`/programacion`)
- Parrilla de programación televisiva
- `/programacion/programas` - Lista de programas

#### **Contacto** (`/contacto`)
- Información de contacto
- Formulario de contacto

---

## Sección de Noticias

### Visualización de Noticias

#### **Página Principal** (`/noticias`)
- Grid de noticias con imágenes
- Filtros por categoría
- Navegación paginada

#### **Categorías Disponibles**
- **Política**: Noticias políticas y legislativas
- **Economía**: Temas económicos y presupuestales
- **Sociedad**: Impacto social de decisiones legislativas

#### **Artículo Individual** (`/noticias/[id]`)
- Título y contenido completo
- Imagen destacada
- Fecha de publicación
- Categoría asignada

#### **Video Noticias** (`/noticias/en-vivo`)
- Videos de noticias
- Reproductor integrado
- Miniaturas y descripciones

### Navegación
- Carrusel de noticias destacadas
- Grid de noticias recientes
- Filtrado por categorías

---

## Radio Congreso

### Funciones Principales

#### **Reproductor de Radio** (`/radio`)
- Stream de audio en vivo
- URL de streaming: Radio Congreso
- Controles de play/pause/volumen
- Información del programa actual

#### **Canales Disponibles**
- **Radio Congreso**: Canal principal
- **Canal 45.1**: Cámara de Diputados  
- **Canal 45.2**: Cámara de Senadores
- **Canal 45.3**: Canal Institucional

#### **Programas de Radio**
Los programas se acceden vía `/radio/[programSlug]`:

##### **Entrevistas** (`/radio/entrevistas`)
- Entrevistas con legisladores y expertos

##### **Sitio Abierto** (`/radio/sitio-abierto`)
- Programa de participación ciudadana

##### **Noticias del Congreso** (`/radio/noticias`)
- Resumen informativo legislativo

### Navegación de Programas
- Cada programa tiene su página individual
- Carrusel de programas en página principal
- Logos y descripciones de programas

---

## Transmisiones en Vivo

### Acceso (`/transmisiones`)

#### **Canales de Transmisión**
- **Canal 45.1**: Cámara de Diputados
- **Canal 45.2**: Cámara de Senadores  
- **Canal 45.3**: Canal Institucional

#### **Reproductor de Video**
- Streaming HLS en tiempo real
- Controles de volumen y pantalla completa
- Miniaturas de canales
- Estado: EN VIVO o EN RECESO

#### **Carrusel de Transmisiones**
- Actualización automática cada 5 segundos
- Estado en tiempo real de transmisiones
- Navegación entre canales

---

## Portal de Transparencia

### Secciones Principales

#### **Transparencia Focalizada** (`/transparencia/focalizada`)
- **Tu Congreso** (`/transparencia/focalizada/tu-congreso`)
- **Representantes** (`/transparencia/focalizada/representantes`)  
- **Ciudadanía** (`/transparencia/focalizada/ciudadania`)

#### **Datos Abiertos** (`/transparencia/datos-abiertos`)
- Portal de acceso a datos públicos

#### **Compromisos** (`/transparencia/compromisos`)
- **Estructura** (`/transparencia/compromisos/estructura`)
- **Información** (`/transparencia/compromisos/informacion`)
- **Normatividad** (`/transparencia/compromisos/normatividad`)
- **Tu Canal** (`/transparencia/compromisos/tu-canal`)

#### **Plataforma Nacional** (`/transparencia/plataforma-nacional`)
- Información sobre la Plataforma Nacional de Transparencia

### Búsqueda de Legisladores

#### **Directorio** (`/radio/legisladores`)
- Lista completa de diputados y senadores
- Información básica: nombre, cargo, partido, estado

#### **Búsqueda Avanzada** (`/radio/legisladores/busqueda`)
- Filtros por:
  - Nombre
  - Estado
  - Partido político
  - Tipo (Diputado/Senador)

#### **Perfil Individual** (`/radio/legisladores/[id]`)
- Información detallada del legislador
- Fotografía
- Datos de contacto

---

## Panel de Administración

### Acceso (`/admin`)

#### **Inicio de Sesión** (`/login`)
- Formulario de usuario y contraseña
- Redirección automática al panel

#### **Dashboard Principal** (`/admin`)
- Resumen del sistema
- Accesos rápidos a funciones principales

### Gestión de Contenido

#### **Administración de Noticias** (`/admin/news`)
- Lista de todas las noticias
- Crear/editar/eliminar noticias
- Estados: borrador, publicado
- Categorías: política, economía, sociedad
- Editor de texto enriquecido
- Subida de imágenes

#### **Video Noticias** (`/admin/video-news`)
- Gestión de videos de noticias
- Subida de archivos de video
- Miniaturas y metadatos

#### **Transmisiones en Vivo** (`/admin/live-streams`)
- Configuración de streams
- Estados: en vivo, en receso, fuera de línea
- URLs de streaming HLS
- Miniaturas de canales

#### **Programas de TV** (`/admin/programs`)
- Gestión de programas televisivos
- Información y logos
- Reordenamiento de programas

#### **Programas Destacados** (`/admin/featured-programs`)
- Configuración de programas destacados en homepage

### Administración de Radio

#### **Panel de Radio** (`/admin/radio`)
- Configuraciones generales de radio

#### **Programas de Radio** (`/admin/radio-programs`)
- Crear/editar programas de radio
- Logos y descripciones
- URLs y slugs

#### **Episodios** (`/admin/radio-episodes`)
- Gestión de episodios de radio
- Subida de archivos de audio
- Metadatos y descripciones

#### **Navegación de Radio** (`/admin/radio-navigation`)
- Configuración del menú de radio
- Enlaces y estructura

#### **Radio en Vivo** (`/admin/radio-live`)
- Configuración de streaming en vivo
- URLs de transmisión

### Datos Legislativos

#### **Legisladores** (`/admin/legislators`)
- Base de datos de legisladores
- Información personal y política
- Fotografías y contactos

#### **Órganos** (`/admin/organs`)
- Órganos del congreso
- Logos e información

#### **Grupos Parlamentarios** (`/admin/parliamentary-groups`)
- Gestión de partidos políticos

### Configuración del Sistema

#### **Canales de TV** (`/admin/channels`)
- Configuración de canales televisivos
- Logos y metadatos

#### **Configuración de Homepage** (`/admin/homepage-config`)
- Personalización de página principal
- Imágenes hero y secciones

#### **Base de Datos** (`/admin/database-config`)
- Herramientas de base de datos
- Inicialización de tablas
- Pruebas de conexión

#### **Configuración SMTP** (`/admin/smtp-config`)
- Configuración de servidor de email
- Pruebas de envío

#### **Usuarios** (`/admin/users`)
- Gestión de usuarios administrativos
- Roles y permisos

#### **Sitemap** (`/admin/sitemap`)
- Gestión de sitemap para SEO
- Regeneración automática

### Subida de Archivos

#### **Subida Masiva**
- Importación CSV para noticias
- Carga masiva de episodios
- Subida de programación (Excel)

#### **Gestión de Archivos**
- Servidor de archivos en `/api/files`
- Subida de imágenes, audio y video
- Validación de formatos

---

## Programación

### Programación de TV (`/programacion`)

#### **Parrilla de Programación**
- Horarios de transmisión por canal
- Información de programas
- Navegación por días

#### **Programas Individuales** (`/programacion/programas/[id]`)
- Información detallada de cada programa
- Horarios específicos

#### **Subida de Programación** (Admin)
- Importación vía archivo Excel
- Actualización masiva de horarios

---

## Solución de Problemas

### Problemas Comunes

#### **No se reproduce audio/video**
1. Verificar conexión a internet
2. Actualizar navegador web
3. Verificar que JavaScript esté habilitado
4. Probar en modo incógnito

#### **Página no carga**
1. Refrescar la página (F5)
2. Limpiar caché del navegador
3. Verificar conexión de red

#### **Problemas de admin**
1. Verificar credenciales de login
2. Contactar administrador del sistema

### Compatibilidad

#### **Navegadores Soportados**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### **Dispositivos Móviles**
- iOS Safari 14+
- Android Chrome 90+
- Diseño responsive optimizado

---

## Características Técnicas

### Streaming
- **Audio**: Streaming HLS para radio
- **Video**: Streaming HLS para transmisiones en vivo
- **Actualización**: Cada 5 segundos para estados de transmisión

### Base de Datos
- **Sistema**: PostgreSQL
- **Tablas principales**: news, live_streams, radio_programs, legislators, organs

### APIs Disponibles
- `/api/news` - Gestión de noticias
- `/api/live-streams` - Transmisiones en vivo
- `/api/radio/programs` - Programas de radio
- `/api/legislators` - Información de legisladores
- `/api/organs` - Órganos del congreso

---

## Contacto y Soporte

### Información de Contacto

#### **Formulario de Contacto** (`/contacto`)
- Formulario web disponible en la plataforma
- Campos: nombre, email, mensaje

#### **Soporte Técnico**
- Contacto a través del formulario web
- Reportar problemas técnicos

### Reportar Problemas

#### **Información a Incluir**
1. Descripción del problema
2. Navegador utilizado
3. Pasos para reproducir el error
4. Capturas de pantalla si es posible

---

## Términos de Uso

### Uso Permitido
- Consulta de información pública
- Acceso a transmisiones legislativas
- Uso educativo e informativo

### Responsabilidades
- Uso responsable de la plataforma
- No interferir con el funcionamiento del sistema
- Respetar los derechos de autor del contenido

---

**© 2025 Radio Congreso - Congreso de la Unión de México**

*Este manual describe las funcionalidades reales disponibles en la plataforma Radio Congreso.*