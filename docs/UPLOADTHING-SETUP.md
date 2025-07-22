# UploadThing Setup - eGrow Academy

## 📋 Resumen

UploadThing ha sido configurado para permitir la subida de archivos (videos, PDFs, imágenes) directamente desde el navegador a servicios de almacenamiento en la nube como AWS S3 o Cloudflare R2.

## 🚀 Instalación Completada

### Dependencias Instaladas
```bash
npm install uploadthing @uploadthing/react react-dropzone
npm install class-variance-authority clsx tailwind-merge
```

### Archivos Creados
- `src/lib/uploadthing.ts` - Configuración principal
- `src/lib/uploadthing-config.ts` - Configuración del cliente
- `src/app/api/uploadthing/route.ts` - Ruta API
- `src/components/ui/FileUpload.tsx` - Componente reutilizable
- `src/components/courses/CourseResourceUpload.tsx` - Gestión de recursos
- `src/app/admin/upload-demo/page.tsx` - Página de demostración

## ⚙️ Configuración

### Endpoints Configurados

1. **courseVideo** - Videos de cursos
   - Máximo: 1GB por archivo
   - Tipos: MP4, MOV, AVI
   - Autenticación requerida

2. **courseResource** - Recursos de cursos
   - PDFs: hasta 50MB
   - Imágenes: hasta 10MB
   - Documentos: hasta 5MB
   - Autenticación requerida

3. **userAvatar** - Imágenes de perfil
   - Máximo: 5MB
   - Tipos: JPG, PNG, GIF, WebP
   - Autenticación requerida

4. **generalResource** - Recursos generales
   - Más permisivo para uso general
   - Autenticación requerida

## 🎯 Uso en el Proyecto

### Componente Básico
```tsx
import FileUpload from "@/components/ui/FileUpload";

<FileUpload
  endpoint="courseVideo"
  onUploadComplete={(url) => console.log("Archivo subido:", url)}
  onUploadError={(error) => console.error("Error:", error)}
/>
```

### Gestión de Recursos de Curso
```tsx
import CourseResourceUpload from "@/components/courses/CourseResourceUpload";

<CourseResourceUpload
  courseId="curso-123"
  onResourceAdded={(resource) => {
    // Guardar en base de datos
  }}
  onResourceRemoved={(resourceId) => {
    // Eliminar de base de datos
  }}
/>
```

## 🔧 Próximos Pasos

### 1. Configurar Variables de Entorno
Necesitas configurar las credenciales de tu servicio de almacenamiento:

```env
# Para AWS S3
UPLOADTHING_SECRET=tu_secret_key
UPLOADTHING_APP_ID=tu_app_id

# Para Cloudflare R2
UPLOADTHING_SECRET=tu_secret_key
UPLOADTHING_APP_ID=tu_app_id
```

### 2. Crear Cuenta en UploadThing
1. Ve a [uploadthing.com](https://uploadthing.com)
2. Crea una cuenta
3. Configura tu proyecto
4. Obtén las credenciales

### 3. Integrar con Base de Datos
Extender el schema de Prisma para incluir recursos:

```prisma
model CourseResource {
  id        String   @id @default(cuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])
  name      String
  type      String   // video, pdf, image, document
  url       String   // URL de UploadThing
  size      Int
  createdAt DateTime @default(now())
}
```

## 🎨 Características del UI

### Diseño Responsive
- Mobile-first design
- Drag & drop intuitivo
- Progreso de subida en tiempo real
- Validación visual de archivos

### Estados de UI
- ✅ Archivo subido exitosamente
- ⏳ Subida en progreso
- ❌ Error en la subida
- 📁 Archivos listos para subir

## 🔒 Seguridad

### Autenticación
- Todos los endpoints requieren autenticación
- Verificación de sesión de usuario
- Middleware de autorización

### Validación
- Tipos de archivo permitidos
- Límites de tamaño
- Sanitización de nombres

## 📱 Demo Disponible

Visita `/admin/upload-demo` para probar la funcionalidad:
- Subida de videos
- Subida de recursos
- Gestión de archivos
- Visualización de URLs

## 🚀 Beneficios para eGrow Academy

1. **Mejor Experiencia de Usuario**
   - Subida directa sin recargas
   - Progreso visual
   - Validación inmediata

2. **Escalabilidad**
   - CDN global
   - Optimización automática
   - Sin límites de almacenamiento

3. **Gestión de Contenido**
   - Organización por curso
   - Metadatos automáticos
   - URLs seguras

4. **Rendimiento**
   - Subida paralela
   - Compresión automática
   - Cache inteligente

## 🔄 Integración con Cursos Existentes

Los componentes están diseñados para integrarse fácilmente con:
- Páginas de contenido de cursos
- Panel de administración
- Gestión de recursos
- Sistema de progreso

## 📞 Soporte

Para problemas o preguntas sobre UploadThing:
- [Documentación oficial](https://docs.uploadthing.com)
- [GitHub Issues](https://github.com/pingdotgg/uploadthing)
- [Discord Community](https://discord.gg/uploadthing) 