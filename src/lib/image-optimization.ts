// Utilidades para optimización de imágenes
export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  progressive?: boolean;
}

export interface OptimizedImage {
  blob: Blob;
  url: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

export class ImageOptimizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.85,
      format = 'webp',
      progressive = true
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calcular nuevas dimensiones manteniendo aspect ratio
          const { width: newWidth, height: newHeight } = this.calculateDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight
          );

          // Redimensionar canvas
          this.canvas.width = newWidth;
          this.canvas.height = newHeight;

          // Aplicar filtros de calidad
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.imageSmoothingQuality = 'high';

          // Dibujar imagen redimensionada
          this.ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convertir a blob optimizado
          this.canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Error al procesar la imagen'));
                return;
              }

              const optimizedUrl = URL.createObjectURL(blob);
              const compressionRatio = ((file.size - blob.size) / file.size) * 100;

              resolve({
                blob,
                url: optimizedUrl,
                originalSize: file.size,
                optimizedSize: blob.size,
                compressionRatio: Math.max(0, compressionRatio),
                width: newWidth,
                height: newHeight
              });
            },
            this.getMimeType(format),
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Si la imagen es más pequeña que los límites, mantener tamaño original
    if (width <= maxWidth && height <= maxHeight) {
      return { width, height };
    }

    // Calcular ratio de redimensionamiento
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio)
    };
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'webp':
        return 'image/webp';
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'image/webp';
    }
  }

  // Generar múltiples tamaños para responsive
  async generateResponsiveSizes(
    file: File,
    sizes: number[] = [480, 768, 1024, 1920]
  ): Promise<{ [key: number]: OptimizedImage }> {
    const results: { [key: number]: OptimizedImage } = {};

    for (const size of sizes) {
      try {
        const optimized = await this.optimizeImage(file, {
          maxWidth: size,
          maxHeight: size,
          quality: size <= 768 ? 0.8 : 0.85
        });
        results[size] = optimized;
      } catch (error) {
        console.warn(`Error optimizando imagen para tamaño ${size}:`, error);
      }
    }

    return results;
  }

  // Limpiar URLs creadas
  cleanup(optimizedImage: OptimizedImage) {
    URL.revokeObjectURL(optimizedImage.url);
  }
}

// Hook para usar el optimizador
export function useImageOptimizer() {
  const optimizer = new ImageOptimizer();

  const optimizeImage = async (
    file: File,
    options?: ImageOptimizationOptions
  ): Promise<OptimizedImage> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    return optimizer.optimizeImage(file, options);
  };

  const generateResponsive = async (
    file: File,
    sizes?: number[]
  ): Promise<{ [key: number]: OptimizedImage }> => {
    return optimizer.generateResponsiveSizes(file, sizes);
  };

  const cleanup = (optimizedImage: OptimizedImage) => {
    optimizer.cleanup(optimizedImage);
  };

  return {
    optimizeImage,
    generateResponsive,
    cleanup
  };
}

// Función para detectar soporte de WebP
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}