import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

// Middleware para verificar autenticación
const auth = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("No autorizado");
  return session.user;
};

export const uploadRouter = {
  // Para videos de cursos (máximo 1GB)
  courseVideo: f({
    video: {
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
  })
    .middleware(auth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video subido:", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // Para recursos de cursos (PDFs, imágenes, etc.)
  courseResource: f({
    pdf: { maxFileSize: "50MB", maxFileCount: 5 },
    image: { maxFileSize: "10MB", maxFileCount: 10 },
    text: { maxFileSize: "5MB", maxFileCount: 10 },
  })
    .middleware(auth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Recurso subido:", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // Para imágenes de perfil de usuario
  userAvatar: f({
    image: { maxFileSize: "5MB", maxFileCount: 1 },
  })
    .middleware(auth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar subido:", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // Para recursos generales (más permisivo)
  generalResource: f({
    pdf: { maxFileSize: "100MB", maxFileCount: 10 },
    image: { maxFileSize: "20MB", maxFileCount: 20 },
    video: { maxFileSize: "2GB", maxFileCount: 5 },
    text: { maxFileSize: "10MB", maxFileCount: 20 },
  })
    .middleware(auth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Recurso general subido:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter; 