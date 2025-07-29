'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';

export default function ContenidoCVPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    progress,
    isLoading,
    progressPercentage,
    saveProgress,
    markLessonComplete,
    setCurrentLesson
  } = useCourseProgress('computer-vision', isEnrolled);

  const courseData = {
    id: 'computer-vision',
    title: 'Computer Vision con Python',
    description: 'Aprende a procesar y analizar imágenes usando OpenCV, detectar objetos, reconocer rostros y crear aplicaciones de visión por computadora.',
    lessons: [
      {
        id: 1,
        title: 'Introducción a Computer Vision',
        duration: '12 min',
        type: 'video',
        description: 'Conceptos fundamentales y aplicaciones',
        content: `
          <h2>Introducción a Computer Vision</h2>
          <p>Computer Vision es una rama de la inteligencia artificial que permite a las computadoras interpretar y analizar imágenes y videos como lo haría el ojo humano.</p>
          
          <h3>¿Qué es Computer Vision?</h3>
          <p>Es la tecnología que permite a las máquinas extraer información útil de imágenes digitales, videos y otras fuentes visuales.</p>
          
          <h3>Aplicaciones principales:</h3>
          <ul>
            <li><strong>Reconocimiento facial:</strong> Identificación de personas en fotos</li>
            <li><strong>Vehículos autónomos:</strong> Navegación basada en visión</li>
            <li><strong>Medicina:</strong> Análisis de imágenes médicas</li>
            <li><strong>Realidad aumentada:</strong> Superposición de información digital</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 2,
        title: 'Procesamiento Básico de Imágenes',
        duration: '20 min',
        type: 'video',
        description: 'Carga, manipulación y transformaciones básicas',
        content: `
          <h2>Procesamiento Básico de Imágenes</h2>
          <p>Aprenderemos a cargar, manipular y transformar imágenes usando OpenCV.</p>
          
          <h3>Instalación de OpenCV</h3>
          <pre><code>pip install opencv-python
pip install matplotlib
pip install numpy</code></pre>
          
          <h3>Operaciones básicas:</h3>
          <pre><code>import cv2
import numpy as np
import matplotlib.pyplot as plt

# Cargar imagen
img = cv2.imread('imagen.jpg')

# Mostrar propiedades
print(f'Tamaño: {img.shape}')
print(f'Tipo de dato: {img.dtype}')

# Convertir BGR a RGB
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Redimensionar
img_resized = cv2.resize(img_rgb, (400, 300))

# Mostrar imagen
plt.imshow(img_resized)
plt.axis('off')
plt.show()</code></pre>
        `,
        completed: false
      },
      {
        id: 3,
        title: 'Filtros y Convoluciones',
        duration: '25 min',
        type: 'video',
        description: 'Aplicación de filtros y operaciones de convolución',
        content: `
          <h2>Filtros y Convoluciones</h2>
          <p>Los filtros permiten modificar y mejorar imágenes aplicando operaciones matemáticas.</p>
          
          <h3>Filtro Gaussiano (Desenfoque)</h3>
          <pre><code># Aplicar desenfoque gaussiano
blurred = cv2.GaussianBlur(img, (15, 15), 0)

# Mostrar comparación
fig, axes = plt.subplots(1, 2, figsize=(12, 6))
axes[0].imshow(img)
axes[0].set_title('Original')
axes[1].imshow(blurred)
axes[1].set_title('Desenfocada')</code></pre>
          
          <h3>Filtro de Nitidez</h3>
          <pre><code># Kernel de nitidez
kernel = np.array([[-1,-1,-1],
                   [-1, 9,-1],
                   [-1,-1,-1]])

# Aplicar filtro
sharp = cv2.filter2D(img, -1, kernel)</code></pre>
          
          <h3>Tipos de filtros:</h3>
          <ul>
            <li><strong>Paso bajo:</strong> Reducen ruido y detalles</li>
            <li><strong>Paso alto:</strong> Resaltan bordes y detalles</li>
            <li><strong>Personalizados:</strong> Kernels definidos por el usuario</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 4,
        title: 'Detección de Bordes',
        duration: '18 min',
        type: 'video',
        description: 'Algoritmos de detección de bordes y contornos',
        content: `
          <h2>Detección de Bordes</h2>
          <p>Los bordes son cambios abruptos en la intensidad de los píxeles y son fundamentales para el análisis de imágenes.</p>
          
          <h3>Detector de Canny</h3>
          <pre><code># Convertir a escala de grises
gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

# Aplicar detector de Canny
edges = cv2.Canny(gray, 50, 150)

# Visualizar
plt.imshow(edges, cmap='gray')
plt.title('Bordes detectados')
plt.axis('off')</code></pre>
          
          <h3>Otros detectores de bordes:</h3>
          <ul>
            <li><strong>Sobel:</strong> Gradientes direccionales</li>
            <li><strong>Laplacian:</strong> Detector de segunda derivada</li>
            <li><strong>Scharr:</strong> Mejora del operador Sobel</li>
          </ul>
          
          <h3>Detección de contornos</h3>
          <pre><code># Encontrar contornos
contours, hierarchy = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Dibujar contornos
img_contours = img.copy()
cv2.drawContours(img_contours, contours, -1, (0, 255, 0), 2)</code></pre>
        `,
        completed: false
      },
      {
        id: 5,
        title: 'Lab: Procesamiento de Imágenes',
        duration: '35 min',
        type: 'lab',
        description: 'Implementación práctica con OpenCV',
        content: `
          <h2>Laboratorio: Procesamiento de Imágenes</h2>
          <p>En este laboratorio crearemos un sistema completo de procesamiento de imágenes.</p>
          
          <h3>Proyecto: Analizador de Formas</h3>
          <pre><code>import cv2
import numpy as np
import matplotlib.pyplot as plt

def analyze_shapes(image_path):
    # Cargar imagen
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Convertir a escala de grises
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    
    # Aplicar threshold
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    
    # Encontrar contornos
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Analizar cada contorno
    for i, contour in enumerate(contours):
        # Calcular área
        area = cv2.contourArea(contour)
        
        # Calcular perímetro
        perimeter = cv2.arcLength(contour, True)
        
        # Aproximar forma
        approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
        
        # Clasificar forma
        shape = classify_shape(approx)
        
        # Dibujar contorno y etiqueta
        cv2.drawContours(img_rgb, [contour], -1, (0, 255, 0), 2)
        
        # Calcular centro del contorno
        M = cv2.moments(contour)
        if M['m00'] != 0:
            cx = int(M['m10'] / M['m00'])
            cy = int(M['m01'] / M['m00'])
            cv2.putText(img_rgb, f'{shape} (A:{area:.0f})', (cx-50, cy), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
    
    return img_rgb

def classify_shape(approx):
    vertices = len(approx)
    if vertices == 3:
        return "Triangulo"
    elif vertices == 4:
        return "Rectangulo"
    elif vertices > 4:
        return "Circulo"
    else:
        return "Desconocido"

# Usar el analizador
result = analyze_shapes('shapes.jpg')
plt.figure(figsize=(10, 8))
plt.imshow(result)
plt.title('Análisis de Formas')
plt.axis('off')
plt.show()</code></pre>
          
          <h3>Ejercicios:</h3>
          <ol>
            <li>Agregar detección de colores dominantes</li>
            <li>Calcular la orientación de las formas</li>
            <li>Implementar filtrado por tamaño mínimo</li>
          </ol>
        `,
        completed: false
      },
      {
        id: 6,
        title: 'Detección de Objetos',
        duration: '22 min',
        type: 'video',
        description: 'Técnicas de detección y seguimiento de objetos',
        content: `
          <h2>Detección de Objetos</h2>
          <p>La detección de objetos permite identificar y localizar elementos específicos en imágenes.</p>
          
          <h3>Template Matching</h3>
          <pre><code># Cargar imagen y template
img = cv2.imread('image.jpg')
template = cv2.imread('template.jpg')

# Aplicar template matching
result = cv2.matchTemplate(img, template, cv2.TM_CCOEFF_NORMED)

# Encontrar mejor coincidencia
min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

# Dibujar rectángulo
top_left = max_loc
h, w = template.shape[:2]
bottom_right = (top_left[0] + w, top_left[1] + h)
cv2.rectangle(img, top_left, bottom_right, (0, 255, 0), 2)</code></pre>
          
          <h3>Haar Cascades</h3>
          <pre><code># Cargar clasificador de rostros
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Detectar rostros
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

# Dibujar rectángulos
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)</code></pre>
          
          <h3>Características principales:</h3>
          <ul>
            <li><strong>Precisión:</strong> Correcta identificación de objetos</li>
            <li><strong>Velocidad:</strong> Procesamiento en tiempo real</li>
            <li><strong>Robustez:</strong> Funciona bajo diferentes condiciones</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 7,
        title: 'Reconocimiento Facial',
        duration: '28 min',
        type: 'lab',
        description: 'Implementación de detección y reconocimiento facial',
        content: `
          <h2>Laboratorio: Reconocimiento Facial</h2>
          <p>Implementaremos un sistema completo de reconocimiento facial usando OpenCV.</p>
          
          <h3>Sistema de Reconocimiento Facial</h3>
          <pre><code>import cv2
import numpy as np
import os

class FaceRecognizer:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.faces = []
        self.labels = []
        self.label_names = {}
        
    def collect_faces(self, image_path, person_name, person_id):
        """Recopilar rostros de una imagen"""
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        faces = self.face_cascade.detectMultiScale(gray, 1.2, 5)
        
        for (x, y, w, h) in faces:
            face_roi = gray[y:y+h, x:x+w]
            face_roi = cv2.resize(face_roi, (200, 200))
            
            self.faces.append(face_roi)
            self.labels.append(person_id)
            self.label_names[person_id] = person_name
    
    def train_model(self):
        """Entrenar el reconocedor facial"""
        if len(self.faces) > 0:
            self.recognizer.train(self.faces, np.array(self.labels))
            print(f"Modelo entrenado con {len(self.faces)} rostros")
        
    def recognize_face(self, image_path):
        """Reconocer rostros en una imagen"""
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        faces = self.face_cascade.detectMultiScale(gray, 1.2, 5)
        
        for (x, y, w, h) in faces:
            face_roi = gray[y:y+h, x:x+w]
            face_roi = cv2.resize(face_roi, (200, 200))
            
            # Predecir identidad
            label, confidence = self.recognizer.predict(face_roi)
            
            # Dibujar rectángulo y etiqueta
            if confidence < 100:  # Umbral de confianza
                person_name = self.label_names.get(label, "Desconocido")
                cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)
                cv2.putText(img, f"{person_name} ({confidence:.1f})", 
                           (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            else:
                cv2.rectangle(img, (x, y), (x+w, y+h), (0, 0, 255), 2)
                cv2.putText(img, "Desconocido", (x, y-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        
        return img

# Ejemplo de uso
recognizer = FaceRecognizer()

# Entrenar con imágenes
recognizer.collect_faces('person1_1.jpg', 'Juan', 1)
recognizer.collect_faces('person1_2.jpg', 'Juan', 1)
recognizer.collect_faces('person2_1.jpg', 'Maria', 2)
recognizer.train_model()

# Reconocer en nueva imagen
result = recognizer.recognize_face('test_image.jpg')
cv2.imshow('Reconocimiento Facial', result)
cv2.waitKey(0)
cv2.destroyAllWindows()</code></pre>
        `,
        completed: false
      },
      {
        id: 8,
        title: 'Segmentación de Imágenes',
        duration: '20 min',
        type: 'video',
        description: 'Técnicas de segmentación y análisis de regiones',
        content: `
          <h2>Segmentación de Imágenes</h2>
          <p>La segmentación divide una imagen en regiones significativas para su análisis posterior.</p>
          
          <h3>Segmentación por Color</h3>
          <pre><code># Convertir a HSV
hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)

# Definir rangos de color (ejemplo: azul)
lower_blue = np.array([100, 50, 50])
upper_blue = np.array([130, 255, 255])

# Crear máscara
mask = cv2.inRange(hsv, lower_blue, upper_blue)

# Aplicar máscara
result = cv2.bitwise_and(img, img, mask=mask)</code></pre>
          
          <h3>Watershed Algorithm</h3>
          <pre><code>from scipy import ndimage
from skimage.segmentation import watershed
from skimage.feature import peak_local_maxima

# Convertir a escala de grises
gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

# Aplicar threshold
_, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

# Calcular distancia
dist_transform = cv2.distanceTransform(binary, cv2.DIST_L2, 5)

# Encontrar marcadores
local_maxima = peak_local_maxima(dist_transform, min_distance=20)
markers = np.zeros_like(dist_transform, dtype=np.int32)
markers[tuple(local_maxima.T)] = np.arange(1, len(local_maxima) + 1)

# Aplicar watershed
labels = watershed(-dist_transform, markers, mask=binary)</code></pre>
          
          <h3>Aplicaciones de segmentación:</h3>
          <ul>
            <li><strong>Medicina:</strong> Segmentación de órganos en imágenes médicas</li>
            <li><strong>Agricultura:</strong> Conteo y análisis de cultivos</li>
            <li><strong>Manufactura:</strong> Control de calidad automatizado</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 9,
        title: 'Aplicaciones en Tiempo Real',
        duration: '18 min',
        type: 'video',
        description: 'Optimización y aplicaciones prácticas',
        content: `
          <h2>Aplicaciones en Tiempo Real</h2>
          <p>Desarrollaremos aplicaciones que procesan video en tiempo real usando la cámara web.</p>
          
          <h3>Captura de Video en Vivo</h3>
          <pre><code>import cv2

# Inicializar cámara
cap = cv2.VideoCapture(0)

while True:
    # Capturar frame
    ret, frame = cap.read()
    
    if not ret:
        break
    
    # Procesar frame (ejemplo: detección de rostros)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    # Dibujar rectángulos
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
    
    # Mostrar resultado
    cv2.imshow('Video en Tiempo Real', frame)
    
    # Salir con 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()</code></pre>
          
          <h3>Optimización de Rendimiento</h3>
          <ul>
            <li><strong>Reducir resolución:</strong> Procesar frames más pequeños</li>
            <li><strong>ROI (Región de Interés):</strong> Procesar solo áreas relevantes</li>
            <li><strong>Threading:</strong> Separar captura y procesamiento</li>
            <li><strong>GPU:</strong> Usar aceleración por hardware</li>
          </ul>
          
          <h3>Aplicaciones populares:</h3>
          <ul>
            <li><strong>Filtros de realidad aumentada</strong></li>
            <li><strong>Sistemas de seguridad</strong></li>
            <li><strong>Análisis de tráfico</strong></li>
            <li><strong>Interfaces gestuales</strong></li>
          </ul>
        `,
        completed: false
      },
      {
        id: 10,
        title: 'Proyecto Final',
        duration: '45 min',
        type: 'project',
        description: 'Sistema de vigilancia inteligente',
        content: `
          <h2>Proyecto Final: Sistema de Vigilancia Inteligente</h2>
          <p>Construirás un sistema completo de vigilancia que detecta movimiento, reconoce rostros y genera alertas.</p>
          
          <h3>Arquitectura del Sistema</h3>
          <pre><code># Estructura del proyecto
intelligent_surveillance/
├── src/
│   ├── motion_detector.py
│   ├── face_recognizer.py
│   ├── alert_system.py
│   └── main.py
├── data/
│   └── known_faces/
├── logs/
└── requirements.txt</code></pre>
          
          <h3>Sistema Principal</h3>
          <pre><code>import cv2
import numpy as np
import datetime
import os
from threading import Thread
import smtplib
from email.mime.text import MIMEText

class IntelligentSurveillance:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.background_subtractor = cv2.createBackgroundSubtractorMOG2()
        self.known_faces = self.load_known_faces()
        self.motion_threshold = 5000
        self.alert_cooldown = 30  # segundos
        self.last_alert = 0
        
    def load_known_faces(self):
        """Cargar rostros conocidos desde directorio"""
        known_faces = []
        data_dir = 'data/known_faces/'
        
        for filename in os.listdir(data_dir):
            if filename.endswith('.jpg'):
                img = cv2.imread(os.path.join(data_dir, filename))
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
                
                for (x, y, w, h) in faces:
                    face = gray[y:y+h, x:x+w]
                    known_faces.append((face, filename.split('.')[0]))
        
        return known_faces
    
    def detect_motion(self, frame):
        """Detectar movimiento en el frame"""
        fg_mask = self.background_subtractor.apply(frame)
        contours, _ = cv2.findContours(fg_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        motion_area = 0
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 500:  # Filtrar contornos pequeños
                motion_area += area
                
        return motion_area > self.motion_threshold
    
    def recognize_faces(self, frame):
        """Reconocer rostros en el frame"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        recognized = []
        for (x, y, w, h) in faces:
            face = gray[y:y+h, x:x+w]
            
            # Comparar con rostros conocidos
            best_match = None
            min_distance = float('inf')
            
            for known_face, name in self.known_faces:
                # Redimensionar para comparación
                face_resized = cv2.resize(face, known_face.shape[::-1])
                distance = cv2.norm(face_resized, known_face, cv2.NORM_L2)
                
                if distance < min_distance:
                    min_distance = distance
                    best_match = name
            
            # Si la distancia es suficientemente pequeña, es un rostro conocido
            if min_distance < 10000:  # Umbral ajustable
                recognized.append((x, y, w, h, best_match, True))
            else:
                recognized.append((x, y, w, h, "Desconocido", False))
        
        return recognized
    
    def send_alert(self, message):
        """Enviar alerta por email"""
        current_time = datetime.datetime.now().timestamp()
        
        if current_time - self.last_alert > self.alert_cooldown:
            # Configurar email (usar tus credenciales)
            try:
                msg = MIMEText(message)
                msg['Subject'] = 'Alerta de Seguridad'
                msg['From'] = 'sistema@vigilancia.com'
                msg['To'] = 'admin@empresa.com'
                
                # Enviar email (configurar SMTP)
                print(f"ALERTA: {message}")
                self.log_event(f"ALERTA: {message}")
                self.last_alert = current_time
                
            except Exception as e:
                print(f"Error enviando alerta: {e}")
    
    def log_event(self, message):
        """Registrar evento en log"""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open('logs/surveillance.log', 'a') as f:
            f.write(f"{timestamp} - {message}\n")
    
    def run(self):
        """Ejecutar sistema de vigilancia"""
        print("Iniciando sistema de vigilancia inteligente...")
        
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            
            # Detectar movimiento
            motion_detected = self.detect_motion(frame)
            
            # Reconocer rostros
            faces = self.recognize_faces(frame)
            
            # Procesar detecciones
            for (x, y, w, h, name, is_known) in faces:
                color = (0, 255, 0) if is_known else (0, 0, 255)
                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
                
                # Generar alerta para rostros desconocidos
                if not is_known and motion_detected:
                    self.send_alert(f"Persona desconocida detectada: {datetime.datetime.now()}")
            
            # Mostrar información del sistema
            status = "MOVIMIENTO DETECTADO" if motion_detected else "SISTEMA ACTIVO"
            cv2.putText(frame, status, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Rostros: {len(faces)}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Mostrar frame
            cv2.imshow('Sistema de Vigilancia Inteligente', frame)
            
            # Salir con 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        self.cap.release()
        cv2.destroyAllWindows()

# Ejecutar sistema
if __name__ == "__main__":
    surveillance = IntelligentSurveillance()
    surveillance.run()</code></pre>
          
          <h3>Características del Sistema:</h3>
          <ul>
            <li>Detección de movimiento en tiempo real</li>
            <li>Reconocimiento de rostros conocidos vs desconocidos</li>
            <li>Sistema de alertas por email</li>
            <li>Logging de eventos de seguridad</li>
            <li>Interfaz visual en tiempo real</li>
          </ul>
          
          <h3>Extensiones Posibles:</h3>
          <ul>
            <li>Integración con bases de datos</li>
            <li>Notificaciones móviles</li>
            <li>Grabación automática de eventos</li>
            <li>Dashboard web para monitoreo remoto</li>
          </ul>
        `,
        completed: false
      }
    ]
  };

  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/computer-vision/contenido');
    }
  }, [user]);

  const checkEnrollment = async () => {
    // Primero verificar si el usuario está autenticado
    if (!user) {
      console.log('🔍 [DEBUG] Usuario no autenticado, redirigiendo al login');
      router.push('/login?redirect=/curso/computer-vision/contenido');
      return;
    }

    console.log('🔍 [DEBUG] Usuario autenticado, verificando inscripción...');
    
    try {
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`);
      if (response.ok) {
        const data = await response.json();
        
        if (!data.isEnrolled) {
          console.log('🔍 [DEBUG] Usuario no inscrito, inscribiendo automáticamente...');
          // Intentar inscribir automáticamente
          const enrollResponse = await fetch('/api/courses/enroll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId: courseData.id }),
            credentials: 'include',
          });
          
          if (enrollResponse.ok) {
            console.log('✅ [DEBUG] Usuario inscrito automáticamente');
            setIsEnrolled(true);
          } else {
            console.error('❌ [DEBUG] Error en inscripción automática');
            // Si falla la inscripción automática, redirigir a página del curso
            router.push('/curso/computer-vision');
            return;
          }
        } else {
          setIsEnrolled(data.isEnrolled);
        }
      } else {
        const errorData = await response.json();
        console.error('🔍 [DEBUG] Error en respuesta:', errorData);
        
        // Si el error es de autenticación, verificar si realmente no está autenticado
        if (response.status === 401) {
          console.log('🔍 [DEBUG] Error 401 - Verificando si realmente no está autenticado...');
          
          // Intentar inscribir directamente sin verificar inscripción previa
          try {
            const enrollResponse = await fetch('/api/courses/enroll', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ courseId: courseData.id }),
              credentials: 'include',
            });
            
            if (enrollResponse.ok) {
              console.log('✅ [DEBUG] Usuario inscrito exitosamente tras error 401');
              setIsEnrolled(true);
            } else {
              console.log('🔍 [DEBUG] Error en inscripción tras 401 - Redirigiendo al login');
              router.push('/login?redirect=/curso/computer-vision/contenido');
            }
          } catch (enrollError) {
            console.error('❌ [DEBUG] Error crítico en inscripción:', enrollError);
            router.push('/login?redirect=/curso/computer-vision/contenido');
          }
          return;
        }
        
        // Para otros errores, redirigir a página del curso
        router.push('/curso/computer-vision');
      }
    } catch (error) {
      console.error('Error verificando inscripción:', error);
      // En caso de error de red o similar, intentar inscripción directa
      console.log('🔍 [DEBUG] Error de conexión, intentando inscripción directa...');
      
      try {
        const enrollResponse = await fetch('/api/courses/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId: courseData.id }),
          credentials: 'include',
        });
        
        if (enrollResponse.ok) {
          console.log('✅ [DEBUG] Usuario inscrito exitosamente tras error de conexión');
          setIsEnrolled(true);
        } else {
          console.error('❌ [DEBUG] Error en inscripción tras error de conexión');
          router.push('/curso/computer-vision');
        }
      } catch (enrollError) {
        console.error('❌ [DEBUG] Error crítico:', enrollError);
        router.push('/curso/computer-vision');
      }
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleManualLessonChange = async (newLessonIndex: number) => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    await saveProgress(
      progress.currentLesson,
      progress.completedLessons,
      currentLesson?.id,
      currentLesson?.title,
      'access',
      1
    );
    setCurrentLesson(newLessonIndex);
  };

  const handleReturnToCourse = async () => {
    setIsSaving(true);
    try {
      const currentLesson = courseData.lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      router.push('/curso/computer-vision');
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setIsSaving(false);
    }
  };

  const handlePreviousLesson = async () => {
    if (progress.currentLesson > 0) {
      const currentLesson = courseData.lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      setCurrentLesson(progress.currentLesson - 1);
    }
  };

  const handleMarkLessonComplete = async (lessonId: number) => {
    // Si el curso ya está completado, no permitir marcar lecciones como completadas
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Estás en modo de revisión.');
      return;
    }

    const currentLessonIndex = courseData.lessons.findIndex(lesson => lesson.id === lessonId);
    const currentLesson = courseData.lessons[currentLessonIndex];
    
    const newCompletedLessons = progress.completedLessons.includes(lessonId) 
      ? progress.completedLessons 
      : [...progress.completedLessons, lessonId];
    
    markLessonComplete(lessonId);
    
    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id,
      currentLesson.title,
      'complete',
      5
    );
    
    if (currentLessonIndex < courseData.lessons.length - 1) {
      setTimeout(() => {
        setCurrentLesson(currentLessonIndex + 1);
      }, 100);
    }
  };

  const handleCompleteCourse = async () => {
    if (!isEnrolled) return;
    
    // Si el curso ya está completado, mostrar mensaje
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Puedes revisar el contenido cuando quieras.');
      return;
    }
    
    // Verificar si todas las lecciones están completadas
    const allLessonsCompleted = courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
    
    if (!allLessonsCompleted) {
      alert('Debes completar todas las lecciones antes de poder terminar el curso.');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/courses/complete-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseSlug: 'computer-vision'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Redirigir a la página de inicio del curso
        router.push('/curso/computer-vision');
      } else {
        const error = await response.json();
        console.error('❌ Error al completar curso:', error);
        alert('Error al completar el curso. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('❌ Error al completar curso:', error);
      alert('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    // Si está inscrito, puede acceder a todas las lecciones
    if (isEnrolled) return true;
    
    // Si no está inscrito, solo puede acceder a la primera lección
    return lessonIndex === 0;
  };

  const isCourseCompleted = () => {
    return progress.status === 'COMPLETED' || progress.progressPercentage === 100;
  };

  const getLessonStatus = (lessonIndex: number, lessonId: number) => {
    if (isLessonCompleted(lessonId)) {
      // Si el curso está completado, mostrar estado de revisión
      if (isCourseCompleted()) {
        return '📖';
      }
      return '✅';
    } else if (lessonIndex === progress.currentLesson) {
      return '▶️';
    } else if (isLessonAccessible(lessonIndex)) {
      return '📖';
    } else {
      return '🔒';
    }
  };

  const areAllLessonsCompleted = () => {
    return courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };

  if (!user || isLoading || isCheckingEnrollment) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/computer-vision')}>
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <section className="course-header">
          <div className="container">
            <div className="course-header-content">
              <div className="course-breadcrumb">
                <div className="breadcrumb-container">
                  <a href="/" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🏠</span>
                    <span className="breadcrumb-text">Inicio</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/cursos-gratuitos" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Cursos Gratuitos</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/curso/computer-vision" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎯</span>
                    <span className="breadcrumb-text">Computer Vision</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item active">
                    <span className="breadcrumb-icon">📖</span>
                    <span className="breadcrumb-text">Contenido</span>
                  </span>
                </div>
              </div>
              
              <div className="header-main">
                <div className="header-content">
                  <h1 className="course-title">{courseData.title}</h1>
                  
                  <div className="header-actions">
                    <button 
                      className="btn btn-exit-course btn-save-exit"
                      onClick={handleReturnToCourse}
                      disabled={isSaving}
                    >
                      {isSaving ? '💾 Guardando...' : '🏠 Salir'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              <div className="main-content-area">
                <div className="current-lesson">
                  <div className="lesson-header">
                    <h2>Lección {progress.currentLesson + 1}: {courseData.lessons[progress.currentLesson].title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-type">{courseData.lessons[progress.currentLesson].type}</span>
                      <span className="lesson-duration">{courseData.lessons[progress.currentLesson].duration}</span>
                    </div>
                  </div>
                  
                  <div className="lesson-content">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: courseData.lessons[progress.currentLesson].content 
                      }} 
                    />
                  </div>
                  
                  <div className="lesson-actions">
                    <div className="lesson-buttons">
                      <button 
                        className="btn btn-primary"
                        onClick={handlePreviousLesson}
                        disabled={progress.currentLesson === 0}
                      >
                        ← Lección Anterior
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleMarkLessonComplete(courseData.lessons[progress.currentLesson].id)}
                      >
                        ✅ Marcar como completada
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-sidebar">
                <div className="lessons-navigation">
                  <div className="navigation-header">
                    <h3>Lecciones del Curso</h3>
                    <div className="progress-indicator">
                      <span className="progress-text">
                        {progress.completedLessons.length} de {courseData.lessons.length} completadas
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(progress.completedLessons.length / courseData.lessons.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {isEnrolled && (
                    <div className="course-guidance">
                      <p className="guidance-text">
                        💡 <strong>Recomendación:</strong> Sigue el orden de las lecciones para una mejor experiencia de aprendizaje.
                      </p>
                    </div>
                  )}
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`lesson-item ${index === progress.currentLesson ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${!isLessonAccessible(index) ? 'locked' : ''}`}
                        onClick={() => {
                          if (isLessonAccessible(index)) {
                            handleManualLessonChange(index);
                          }
                        }}
                      >
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-content">
                          <h4>{lesson.title}</h4>
                          <div className="lesson-meta">
                            <span className="lesson-type">{lesson.type}</span>
                            <span className="lesson-duration">{lesson.duration}</span>
                          </div>
                        </div>
                        <div className="lesson-status">
                          {getLessonStatus(index, lesson.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Botón Terminar Curso */}
                  <div className="complete-course-section">
                    {isCourseCompleted() ? (
                      <div className="course-completed-message">
                        <div className="completion-badge">
                          <span className="completion-icon">🏆</span>
                          <span className="completion-text">¡Curso Completado!</span>
                        </div>
                        <p className="completion-info">
                          Has completado exitosamente este curso. Puedes revisar el contenido cuando quieras.
                        </p>
                        <div className="completion-stats">
                          <span>📊 Progreso: 100%</span>
                          <span>✅ Lecciones: {courseData.lessons.length}/{courseData.lessons.length}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button 
                          className={`btn btn-complete-course ${!areAllLessonsCompleted() ? 'disabled' : ''}`}
                          onClick={handleCompleteCourse}
                          disabled={isSaving || !areAllLessonsCompleted()}
                        >
                          {isSaving ? '🔄 Procesando...' : '🏆 Terminar Curso'}
                        </button>
                        <p className="complete-course-info">
                          {areAllLessonsCompleted() 
                            ? '¡Felicidades! Has completado todas las lecciones. Puedes terminar el curso.'
                            : `Completa todas las lecciones (${progress.completedLessons.length}/${courseData.lessons.length}) para poder terminar el curso`
                          }
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .enrollment-required {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
        }

        .course-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-breadcrumb {
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .breadcrumb-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .breadcrumb-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .breadcrumb-item.active {
          color: white;
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
        }

        .breadcrumb-icon {
          font-size: 1rem;
        }

        .breadcrumb-text {
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          margin: 0 0.25rem;
        }

        .header-main {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
          text-align: left;
          width: 100%;
        }

        .course-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-align: left;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
        }

        .btn-exit-course {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: 2px solid #dc2626;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-exit-course:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-color: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-exit-course:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .course-content {
          padding: 3rem 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .current-lesson {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .lesson-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .lesson-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .lesson-type {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .lesson-content {
          line-height: 1.7;
          color: #374151;
        }

        .lesson-content h2 {
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
        }

        .lesson-content h3 {
          color: #1f2937;
          margin: 1.25rem 0 0.75rem 0;
        }

        .lesson-content ul, .lesson-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .lesson-content li {
          margin: 0.5rem 0;
        }

        .lesson-content pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .lesson-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .lesson-actions {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f3f4f6;
        }

        .lesson-buttons {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .lessons-navigation {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
        }

        .navigation-header {
          margin-bottom: 1.5rem;
        }

        .lessons-navigation h3 {
          margin: 0 0 0.75rem 0;
          color: #1f2937;
        }

        .progress-indicator {
          margin-bottom: 1rem;
        }

        .progress-text {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .course-guidance {
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }

        .guidance-text {
          margin: 0;
          font-size: 0.8rem;
          color: #1e40af;
          line-height: 1.4;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .lesson-item:hover {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .lesson-item.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .lesson-item.locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lesson-item.locked:hover {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .lesson-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
        }

        .lesson-item.active .lesson-number {
          background: #3b82f6;
          color: white;
        }

        .lesson-item.completed .lesson-number {
          background: #22c55e;
          color: white;
        }

        .lesson-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #1f2937;
        }

        .lesson-content .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .lesson-status {
          margin-left: auto;
          font-size: 1.2rem;
        }

        .complete-course-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }

        .btn-complete-course {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-complete-course:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .btn-complete-course:disabled,
        .btn-complete-course.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          background: linear-gradient(135deg, #9ca3af, #6b7280);
        }

        .btn-complete-course:disabled:hover,
        .btn-complete-course.disabled:hover {
          background: linear-gradient(135deg, #9ca3af, #6b7280);
          transform: none;
          box-shadow: none;
        }

        .complete-course-info {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .course-completed-message {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border-radius: 12px;
          border: 2px solid #22c55e;
        }

        .completion-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .completion-icon {
          font-size: 2rem;
        }

        .completion-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #16a34a;
        }

        .completion-info {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .completion-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
          
          .course-title {
            font-size: 2rem;
          }

          .lesson-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .lesson-buttons .btn {
            width: 100%;
            justify-content: center;
          }

          .header-main {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-content {
            align-items: center;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-exit-course {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}