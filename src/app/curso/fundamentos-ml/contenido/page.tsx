'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';

export default function ContenidoMLPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
  } = useCourseProgress('fundamentos-ml', isEnrolled);

  const courseData = {
    id: 'fundamentos-ml',
    title: 'Fundamentos de Machine Learning',
    description: 'Aprende los conceptos básicos de Machine Learning, desde algoritmos supervisados hasta no supervisados, y cómo implementarlos en Python.',
    lessons: [
      {
        id: 1,
        title: 'Introducción al Machine Learning',
        duration: '10 min',
        type: 'video',
        description: 'Conceptos fundamentales y tipos de aprendizaje',
        content: `
          <h2>Introducción al Machine Learning</h2>
          <p>El Machine Learning es una rama de la inteligencia artificial que permite a las computadoras aprender y mejorar automáticamente sin ser programadas explícitamente.</p>
          
          <h3>¿Qué es Machine Learning?</h3>
          <p>Es un conjunto de técnicas que permiten a los sistemas informáticos aprender patrones en los datos y hacer predicciones o decisiones basadas en esos patrones.</p>
          
          <h3>Tipos principales:</h3>
          <ul>
            <li><strong>Aprendizaje Supervisado:</strong> Entrenamiento con datos etiquetados</li>
            <li><strong>Aprendizaje No Supervisado:</strong> Descubrimiento de patrones sin etiquetas</li>
            <li><strong>Aprendizaje por Refuerzo:</strong> Aprendizaje mediante interacción con el entorno</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 2,
        title: 'Tipos de Machine Learning',
        duration: '15 min',
        type: 'video',
        description: 'Aprendizaje supervisado, no supervisado y por refuerzo',
        content: `
          <h2>Tipos de Machine Learning</h2>
          <p>Existen tres tipos principales de aprendizaje automático, cada uno con sus características y aplicaciones específicas.</p>
          
          <h3>1. Aprendizaje Supervisado</h3>
          <p>El algoritmo aprende de datos de entrenamiento que incluyen las respuestas correctas (etiquetas).</p>
          <ul>
            <li><strong>Clasificación:</strong> Predecir categorías (spam/no spam)</li>
            <li><strong>Regresión:</strong> Predecir valores numéricos (precio de una casa)</li>
          </ul>
          
          <h3>2. Aprendizaje No Supervisado</h3>
          <p>El algoritmo encuentra patrones en datos sin etiquetas predefinidas.</p>
          <ul>
            <li><strong>Clustering:</strong> Agrupar datos similares</li>
            <li><strong>Reducción de dimensionalidad:</strong> Simplificar datos complejos</li>
          </ul>
          
          <h3>3. Aprendizaje por Refuerzo</h3>
          <p>El algoritmo aprende mediante interacción con un entorno y recibe recompensas.</p>
          <ul>
            <li><strong>Juegos:</strong> AlphaGo, juegos de video</li>
            <li><strong>Robótica:</strong> Navegación autónoma</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 3,
        title: 'Preparación de Datos',
        duration: '20 min',
        type: 'video',
        description: 'Limpieza, transformación y normalización de datos',
        content: `
          <h2>Preparación de Datos</h2>
          <p>La preparación de datos es un paso crucial que determina el éxito de cualquier proyecto de Machine Learning.</p>
          
          <h3>Pasos principales:</h3>
          <ol>
            <li><strong>Recopilación de datos:</strong> Obtener datos relevantes y de calidad</li>
            <li><strong>Limpieza:</strong> Eliminar valores faltantes y outliers</li>
            <li><strong>Transformación:</strong> Convertir datos a formatos apropiados</li>
            <li><strong>Normalización:</strong> Escalar datos a rangos similares</li>
          </ol>
          
          <h3>Herramientas en Python:</h3>
          <pre><code>import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Cargar datos
df = pd.read_csv('datos.csv')

# Limpiar valores faltantes
df = df.dropna()

# Normalizar datos numéricos
scaler = StandardScaler()
df[['columna1', 'columna2']] = scaler.fit_transform(df[['columna1', 'columna2']])</code></pre>
        `,
        completed: false
      },
      {
        id: 4,
        title: 'Algoritmos Supervisados',
        duration: '25 min',
        type: 'video',
        description: 'Regresión lineal, clasificación y árboles de decisión',
        content: `
          <h2>Algoritmos Supervisados</h2>
          <p>Los algoritmos supervisados aprenden de datos etiquetados para hacer predicciones sobre nuevos datos.</p>
          
          <h3>Regresión Lineal</h3>
          <p>Predice valores continuos basándose en variables de entrada.</p>
          <pre><code>from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Dividir datos
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Entrenar modelo
model = LinearRegression()
model.fit(X_train, y_train)

# Predecir
predictions = model.predict(X_test)</code></pre>
          
          <h3>Clasificación</h3>
          <p>Predice categorías o clases para nuevos datos.</p>
          <ul>
            <li><strong>Regresión Logística:</strong> Para clasificación binaria</li>
            <li><strong>Random Forest:</strong> Para clasificación multiclase</li>
            <li><strong>SVM:</strong> Para problemas complejos de clasificación</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 5,
        title: 'Lab: Regresión Lineal',
        duration: '30 min',
        type: 'lab',
        description: 'Implementación práctica de regresión lineal',
        content: `
          <h2>Laboratorio: Regresión Lineal</h2>
          <p>En este laboratorio, implementaremos un modelo de regresión lineal desde cero.</p>
          
          <h3>Dataset: Precios de Casas</h3>
          <p>Usaremos un dataset de precios de casas para predecir el valor basándonos en características como área, habitaciones, etc.</p>
          
          <h3>Código completo:</h3>
          <pre><code>import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Cargar datos
df = pd.read_csv('house_prices.csv')

# Preparar datos
X = df[['area', 'bedrooms', 'bathrooms']]
y = df['price']

# Dividir datos
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar modelo
model = LinearRegression()
model.fit(X_train, y_train)

# Predecir
y_pred = model.predict(X_test)

# Evaluar
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'MSE: {mse:.2f}')
print(f'R²: {r2:.2f}')</code></pre>
          
          <h3>Ejercicios:</h3>
          <ol>
            <li>Experimenta con diferentes características</li>
            <li>Visualiza los resultados con matplotlib</li>
            <li>Compara con otros algoritmos de regresión</li>
          </ol>
        `,
        completed: false
      },
      {
        id: 6,
        title: 'Algoritmos No Supervisados',
        duration: '18 min',
        type: 'video',
        description: 'Clustering y reducción de dimensionalidad',
        content: `
          <h2>Algoritmos No Supervisados</h2>
          <p>Los algoritmos no supervisados encuentran patrones en datos sin etiquetas predefinidas.</p>
          
          <h3>Clustering</h3>
          <p>Agrupa datos similares en clusters o grupos.</p>
          <ul>
            <li><strong>K-Means:</strong> Agrupación basada en centroides</li>
            <li><strong>DBSCAN:</strong> Agrupación basada en densidad</li>
            <li><strong>Hierarchical Clustering:</strong> Agrupación jerárquica</li>
          </ul>
          
          <h3>Reducción de Dimensionalidad</h3>
          <p>Reduce el número de características manteniendo la información importante.</p>
          <ul>
            <li><strong>PCA:</strong> Análisis de componentes principales</li>
            <li><strong>t-SNE:</strong> Visualización de datos de alta dimensión</li>
            <li><strong>Autoencoders:</strong> Reducción usando redes neuronales</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 7,
        title: 'Lab: Clustering con K-Means',
        duration: '25 min',
        type: 'lab',
        description: 'Implementación de clustering con scikit-learn',
        content: `
          <h2>Laboratorio: Clustering con K-Means</h2>
          <p>Implementaremos K-Means para agrupar clientes basándonos en sus características de compra.</p>
          
          <h3>Código del laboratorio:</h3>
          <pre><code>import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Cargar datos de clientes
df = pd.read_csv('customer_data.csv')

# Preparar datos
features = ['age', 'income', 'spending_score']
X = df[features]

# Normalizar
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Encontrar número óptimo de clusters
inertias = []
K_range = range(1, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)

# Graficar método del codo
plt.plot(K_range, inertias, 'bx-')
plt.xlabel('k')
plt.ylabel('Inertia')
plt.title('Método del Codo')
plt.show()

# Aplicar K-Means con k óptimo
kmeans = KMeans(n_clusters=3, random_state=42)
df['cluster'] = kmeans.fit_predict(X_scaled)

# Visualizar resultados
plt.scatter(df['income'], df['spending_score'], c=df['cluster'])
plt.xlabel('Ingreso')
plt.ylabel('Puntuación de Gasto')
plt.title('Clustering de Clientes')
plt.show()</code></pre>
        `,
        completed: false
      },
      {
        id: 8,
        title: 'Evaluación de Modelos',
        duration: '20 min',
        type: 'video',
        description: 'Métricas de rendimiento y validación cruzada',
        content: `
          <h2>Evaluación de Modelos</h2>
          <p>La evaluación correcta de modelos es esencial para determinar su rendimiento y confiabilidad.</p>
          
          <h3>Métricas para Clasificación:</h3>
          <ul>
            <li><strong>Accuracy:</strong> Proporción de predicciones correctas</li>
            <li><strong>Precision:</strong> Proporción de predicciones positivas correctas</li>
            <li><strong>Recall:</strong> Proporción de casos positivos identificados</li>
            <li><strong>F1-Score:</strong> Media armónica de precision y recall</li>
          </ul>
          
          <h3>Métricas para Regresión:</h3>
          <ul>
            <li><strong>MSE:</strong> Error cuadrático medio</li>
            <li><strong>RMSE:</strong> Raíz del error cuadrático medio</li>
            <li><strong>MAE:</strong> Error absoluto medio</li>
            <li><strong>R²:</strong> Coeficiente de determinación</li>
          </ul>
          
          <h3>Validación Cruzada:</h3>
          <pre><code>from sklearn.model_selection import cross_val_score

# Validación cruzada con 5 folds
scores = cross_val_score(model, X, y, cv=5)
print(f'Accuracy: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})')</code></pre>
        `,
        completed: false
      },
      {
        id: 9,
        title: 'Overfitting y Underfitting',
        duration: '15 min',
        type: 'video',
        description: 'Problemas comunes y técnicas de regularización',
        content: `
          <h2>Overfitting y Underfitting</h2>
          <p>Estos son dos problemas fundamentales en Machine Learning que afectan el rendimiento del modelo.</p>
          
          <h3>Overfitting</h3>
          <p>El modelo memoriza los datos de entrenamiento pero no generaliza bien a nuevos datos.</p>
          <ul>
            <li><strong>Síntomas:</strong> Alta accuracy en entrenamiento, baja en test</li>
            <li><strong>Causas:</strong> Modelo muy complejo, pocos datos</li>
            <li><strong>Soluciones:</strong> Regularización, más datos, simplificar modelo</li>
          </ul>
          
          <h3>Underfitting</h3>
          <p>El modelo es demasiado simple y no captura los patrones en los datos.</p>
          <ul>
            <li><strong>Síntomas:</strong> Baja accuracy en entrenamiento y test</li>
            <li><strong>Causas:</strong> Modelo muy simple, características insuficientes</li>
            <li><strong>Soluciones:</strong> Modelo más complejo, más características</li>
          </ul>
          
          <h3>Técnicas de Regularización:</h3>
          <ul>
            <li><strong>L1 (Lasso):</strong> Penaliza valores absolutos de coeficientes</li>
            <li><strong>L2 (Ridge):</strong> Penaliza valores cuadrados de coeficientes</li>
            <li><strong>Dropout:</strong> Desactiva neuronas aleatoriamente</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 10,
        title: 'Proyecto Final',
        duration: '40 min',
        type: 'project',
        description: 'Sistema de recomendación completo',
        content: `
          <h2>Proyecto Final: Sistema de Recomendación</h2>
          <p>Construirás un sistema de recomendación completo que integre todo lo aprendido en el curso.</p>
          
          <h3>Objetivos del Proyecto:</h3>
          <ul>
            <li>Implementar un sistema de recomendación de películas</li>
            <li>Usar técnicas de filtrado colaborativo</li>
            <li>Evaluar el rendimiento del sistema</li>
            <li>Crear una interfaz de usuario simple</li>
          </ul>
          
          <h3>Arquitectura del Sistema:</h3>
          <pre><code># Estructura del proyecto
movie_recommender/
├── data/
│   ├── movies.csv
│   └── ratings.csv
├── src/
│   ├── data_preprocessing.py
│   ├── collaborative_filtering.py
│   ├── evaluation.py
│   └── interface.py
├── requirements.txt
└── README.md</code></pre>
          
          <h3>Implementación:</h3>
          <pre><code>import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF

class MovieRecommender:
    def __init__(self):
        self.movies_df = None
        self.ratings_df = None
        self.user_movie_matrix = None
        self.model = None
    
    def load_data(self):
        self.movies_df = pd.read_csv('data/movies.csv')
        self.ratings_df = pd.read_csv('data/ratings.csv')
        
    def create_user_movie_matrix(self):
        self.user_movie_matrix = self.ratings_df.pivot(
            index='userId', 
            columns='movieId', 
            values='rating'
        ).fillna(0)
    
    def train_collaborative_filtering(self, n_components=50):
        self.model = NMF(n_components=n_components, random_state=42)
        self.model.fit(self.user_movie_matrix)
    
    def recommend_movies(self, user_id, n_recommendations=5):
        user_ratings = self.user_movie_matrix.loc[user_id]
        user_factors = self.model.transform([user_ratings])
        predicted_ratings = np.dot(user_factors, self.model.components_)[0]
        
        # Obtener películas no vistas
        unwatched = user_ratings[user_ratings == 0].index
        predictions = predicted_ratings[unwatched]
        
        # Top recomendaciones
        top_indices = np.argsort(predictions)[-n_recommendations:][::-1]
        return unwatched[top_indices]</code></pre>
          
          <h3>Evaluación:</h3>
          <ul>
            <li>Precisión de las recomendaciones (40%)</li>
            <li>Implementación técnica (30%)</li>
            <li>Interfaz de usuario (20%)</li>
            <li>Documentación (10%)</li>
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
      router.push('/login?redirect=/curso/fundamentos-ml/contenido');
    }
  }, [user]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error('Error verificando inscripción:', error);
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
      router.push('/curso/fundamentos-ml');
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
          courseSlug: 'fundamentos-ml'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Redirigir a la página de inicio del curso
        router.push('/curso/fundamentos-ml');
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

  if (!user || isLoading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/fundamentos-ml')}>
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-fixed" />
      
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
                  <a href="/curso/fundamentos-ml" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎯</span>
                    <span className="breadcrumb-text">Fundamentos de ML</span>
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