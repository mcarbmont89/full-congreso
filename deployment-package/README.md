
# Canal del Congreso CMS - Deployment Package

Este paquete contiene todos los archivos necesarios para ejecutar la aplicación Canal del Congreso CMS en un servidor externo.

## Requisitos del Sistema

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn package manager

## Instalación

### 1. Preparar el entorno

```bash
# Copiar archivos a tu servidor
# Navegar al directorio del proyecto
cd canal-congreso-cms

# Instalar dependencias
npm install
```

### 2. Configurar la base de datos

```bash
# Crear una base de datos PostgreSQL
createdb canal_congreso_cms

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Configurar variables de entorno

Edita el archivo `.env` con tus configuraciones:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/canal_congreso_cms"

# Seguridad
JWT_SECRET="tu_clave_secreta_jwt_minimo_32_caracteres"

# Aplicación
NEXT_PUBLIC_BASE_URL="https://tu-dominio.com"
NODE_ENV=production

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_smtp
```

### 4. Inicializar la base de datos

```bash
# Ejecutar el script de configuración de base de datos
npm run setup-db
```

### 5. Construir y ejecutar

```bash
# Construir la aplicación
npm run build

# Iniciar en producción
npm start
```

## Estructura del Proyecto

```
deployment-package/
├── app/                     # Aplicación Next.js
├── components/              # Componentes React
├── lib/                     # Librerías y utilidades
├── public/                  # Archivos estáticos
├── scripts/                 # Scripts de configuración
├── database-schema.sql      # Esquema principal de base de datos
├── radio-database-schema.sql # Esquema específico de radio
├── latest-database-changes.sql # Últimos cambios de base de datos
├── .env.example            # Plantilla de variables de entorno
├── package.json            # Dependencias del proyecto
├── next.config.mjs         # Configuración de Next.js
└── README.md               # Esta documentación
```

## Configuración del Servidor Web

### Nginx (Recomendado)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    ProxyPreserveHost On
</VirtualHost>
```

## Servicios del Sistema

### systemd (Linux)

Crear archivo `/etc/systemd/system/canal-congreso.service`:

```ini
[Unit]
Description=Canal del Congreso CMS
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/canal-congreso-cms
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Habilitar y iniciar:

```bash
sudo systemctl enable canal-congreso
sudo systemctl start canal-congreso
```

## Gestión de Archivos

La aplicación maneja subida de archivos en el directorio `public/uploads/`. Asegúrate de que:

1. El directorio tenga permisos de escritura
2. Configures un límite apropiado de tamaño de archivo
3. Consideres usar un CDN para archivos estáticos en producción

## Backup de Base de Datos

```bash
# Crear backup
pg_dump canal_congreso_cms > backup-$(date +%Y%m%d).sql

# Restaurar backup
psql canal_congreso_cms < backup-20250806.sql
```

## Monitoreo y Logs

Los logs de la aplicación se pueden encontrar en:

```bash
# Logs de la aplicación
tail -f /path/to/canal-congreso-cms/logs/app.log

# Logs del sistema (si usas systemd)
journalctl -u canal-congreso -f
```

## Actualización

Para actualizar la aplicación:

1. Hacer backup de la base de datos
2. Detener la aplicación
3. Reemplazar archivos
4. Ejecutar migraciones si es necesario: `npm run setup-db`
5. Reconstruir: `npm run build`
6. Reiniciar la aplicación

## Soporte

Para soporte técnico o reportar problemas, consulta la documentación completa del proyecto.

## Últimos Cambios Aplicados

Este paquete incluye las siguientes mejoras de base de datos:

- Tabla `radio_config` para configuración de radio
- Tabla `radio_categories` para categorías de radio  
- Tabla `radio_navigation` para navegación de radio
- Columnas `status` y `channel` en `live_streams`
- Índices mejorados para mejor rendimiento
- Triggers de actualización automática
- Datos por defecto para radio

Los cambios se aplican automáticamente al ejecutar `npm run setup-db`.
