import { createUploadthing, type FileRouter } from "uploadthing/next";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";
import { headers } from "next/headers";

const f = createUploadthing();

// Middleware laxo para desarrollo/subida de archivos desde admin
// - Intenta validar JWT del header Authorization
// - Si no existe/invalid, permite continuar como anónimo
const authOptional = async () => {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (token) {
      const { userId } = verifyToken(token);
      return { userId };
    }
  } catch {}
  return { userId: 'anonymous' } as any;
};

export const uploadRouter = {
  // Para videos de cursos (máximo 1GB)
  courseVideo: f({
    video: {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
  })
    .middleware(authOptional)
    .onUploadComplete(async ({ metadata, file }) => {
      // Video subido exitosamente
      return { uploadedBy: metadata.userId };
    }),

  // Para recursos de cursos (PDFs, imágenes, etc.)
  courseResource: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 5 },
    image: { maxFileSize: "10MB", maxFileCount: 10 },
    text: { maxFileSize: "1MB", maxFileCount: 10 },
  })
    .middleware(authOptional)
    .onUploadComplete(async ({ metadata, file }) => {
      // Recurso subido exitosamente
      return { uploadedBy: metadata.userId };
    }),

  // Para imágenes de perfil de usuario
  userAvatar: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(authOptional)
    .onUploadComplete(async ({ metadata, file }) => {
      // Avatar subido exitosamente
      return { uploadedBy: metadata.userId };
    }),

  // Para recursos generales (más permisivo)
  generalResource: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 10 },
    image: { maxFileSize: "10MB", maxFileCount: 20 },
    video: { maxFileSize: "1GB", maxFileCount: 5 },
    text: { maxFileSize: "2MB", maxFileCount: 20 },
  })
    .middleware(authOptional)
    .onUploadComplete(async ({ metadata, file }) => {
      // Recurso general subido exitosamente
      return { uploadedBy: metadata.userId };
    }),

  // Para recursos de webinar y materiales educativos
  resourceUpload: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 5 },
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    video: { maxFileSize: "1GB", maxFileCount: 3 },
    text: { maxFileSize: "2MB", maxFileCount: 10 },
  })
    .middleware(authOptional)
    .onUploadComplete(async ({ metadata, file }) => {
      // Recurso de webinar subido exitosamente
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter; 