# ⚽ Ligas Menores de Fútbol • Santa Rosa de Copán

Aplicación web moderna, ultra ligera y estilo PWA (mobile-first) para consultar en tiempo real resultados de partidos, calendarios, tablas de posiciones, lista de goleadores y directorio de clubes de las Ligas Menores de Fútbol de Santa Rosa de Copán, Honduras.

---

## 🚀 Características Principales

- **📱 Experiencia Mobile-First (PWA):**
  - Barra de navegación inferior fija (Bottom Navigation Bar) con 4 pestañas: **Partidos**, **Posiciones**, **Goleadores** y **Equipos**.
  - Selector global superior de categorías con chips táctiles generados 100% dinámicamente desde Google Sheets (`Sub-7`, `Sub-9`, `Sub-11`, `Sub-13`).
  - Diseño deportivo limpio y optimizado con la paleta oficial **Saddle-Brown** (`#dd7322`, `#844515`) sobre fondo exterior cálido `#faf7f4`.
  - Tabla de posiciones mobile-first con columna fija de **PTS** y distinción exclusiva para el **Líder (1° Lugar)**.
- **📊 Conexión Gratuita a Google Sheets:**
  - Consume datos en vivo mediante URLs públicas en formato CSV utilizando `PapaParse`.
  - Normalizador automático de enlaces (admite formatos `/pubhtml` y `/pub?output=csv`).
  - Resolución relacional automática de identificadores: traduce códigos como `EQ-01` o `CAT-02` a los nombres oficiales de los clubes y categorías.
  - Sin necesidad de backend ni llaves de API pagas.
- **⚡ Rendimiento y Caché Inteligente:**
  - Creado con **Vite + Tailwind CSS + Vanilla JS (ES Modules)**.
  - Bundle ultra ligero (**~21 KB gzip**), ideal para conexiones móviles 3G/4G en las canchas de fútbol.
  - Estrategia **Stale-While-Revalidate** en cliente (`localStorage`) con TTL de 2 minutos para evitar sobrecargar Google Sheets y permitir lectura offline.
  - Botón interactivo para refrescar datos bajo demanda.
- **🔒 Integridad de Datos:**
  - Si una categoría o jornada no tiene datos registrados aún, muestra estados informativos limpios sin inventar resultados falsos que puedan confundir a padres y entrenadores.

---

## 🛠️ Cómo Configurar Google Sheets

### Paso 1: Crear las hojas de cálculo
Crea un libro en Google Sheets con las siguientes pestañas y nombres exactos de columnas en la primera fila:

#### 1. `Categorias`
| ID_Categoria | Nombre | Descripcion |
| :--- | :--- | :--- |
| `SUB-7` | `Sub-7` | Niños nacidos en 2019 y 2020 |
| `SUB-9` | `Sub-9` | Niños nacidos en 2017 y 2018 |
| `SUB-11` | `Sub-11` | Niños nacidos en 2015 y 2016 |
| `SUB-14` | `Sub-14` | Jóvenes nacidos entre 2012 y 2014 |

#### 2. `Equipos`
| ID_Equipo | Nombre_Equipo | Categoria | Entrenador | Contacto |
| :--- | :--- | :--- | :--- | :--- |
| `EQ-01` | `Deportes Savio Jr` | `Sub-9` | Prof. Mario López | `9988-7766` |
| `EQ-02` | `Olimpia Copán` | `Sub-9` | Prof. Carlos Valle | `9876-5432` |

#### 3. `Partidos`
| ID_Partido | Categoria | Jornada | Fecha | Cancha | Equipo_Local | Goles_Local | Goles_Visitante | Equipo_Visitante | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `P-01` | `Sub-9` | `Jornada 1` | `2026-09-20 08:30` | `Cancha El Mirador` | `Deportes Savio Jr` | `3` | `1` | `Olimpia Copán` | `Finalizado` |
| `P-02` | `Sub-9` | `Jornada 2` | `2026-09-27 10:00` | `Estadio Sergio Reyes` | `Pumas SRC` | | | `Deportes Savio Jr` | `Programado` |

> **Nota:** El campo `Estado` puede ser: `Finalizado`, `Programado` o `En Vivo`.

#### 4. `Tabla_Posiciones`
| Categoria | Equipo | PJ | PG | PE | PP | GF | GC | DG | Puntos |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Sub-9` | `Deportes Savio Jr` | `2` | `2` | `0` | `0` | `6` | `2` | `4` | `6` |

#### 5. `Goles`
| ID_Gol | ID_Partido | ID_Jugador | Jugador_Nombre | Equipo | Minuto | Categoria |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `G-01` | `P-01` | `J-01` | `Mateo Hernández` | `Deportes Savio Jr` | `8` | `Sub-9` |

---

### Paso 2: Publicar como CSV en la Web
1. En Google Sheets, ve a: **Archivo > Compartir > Publicar en la web**.
2. En lugar de "Todo el documento", selecciona la pestaña correspondiente (ej. `Partidos`).
3. En el desplegable de formato, selecciona **Valores separados por comas (.csv)**.
4. Pulsa **Publicar** y copia el enlace generado.

---

### Paso 3: Enlaces configurados en `src/config.js`
En `src/config.js` se encuentran vinculadas tus hojas públicas:

```javascript
export const CONFIG = {
  URL_CATEGORIAS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=0&single=true",
  URL_EQUIPOS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=951446747&single=true",
  URL_PARTIDOS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=49520821&single=true",
  URL_TABLA_POSICIONES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=854461132&single=true",
  URL_GOLES: "", // Pendiente vincular
};
```

---

## 💻 Instalación y Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 📁 Estructura del Proyecto

```
ligas-menores-futbol/
├── index.html                   # HTML semántico mobile-first con meta etiquetas PWA
├── package.json                 # Dependencias mínimas (Vite, Tailwind, PapaParse)
├── vite.config.js               # Configuración optimizada de Vite
├── tailwind.config.js           # Paleta de colores stadium/pitch y utilidades deportivas
├── public/
│   ├── manifest.json            # Configuración PWA para instalar en la pantalla de inicio
│   ├── icons/                   # Iconos SVG de alta resolución (192 y 512px)
│   └── sample-data/             # Archivos CSV de prueba local con equipos de Copán
└── src/
    ├── config.js                # URLs públicas de Google Sheets y TTL de caché
    ├── main.js                  # Lógica reactiva de la aplicación, SPA y eventos
    ├── styles/
    │   └── main.css             # Directivas Tailwind, safe-areas y animaciones
    ├── services/
    │   └── dataService.js       # Consumo con PapaParse y caché Stale-While-Revalidate
    └── components/
        ├── header.js            # Barra superior con estado de red y botón de refresco
        ├── categorySelector.js  # Chips deslizables de categoría (Sub-7, 9, 11, 14)
        ├── searchFilter.js      # Buscador interactivo
        ├── matchesView.js       # Fixture con filtro de jornadas y tarjetas de marcador
        ├── standingsView.js     # Tabla de posiciones con zona de liguilla destacada
        ├── scorersView.js       # Podio visual top 3 (Oro, Plata, Bronce) y lista clasificada
        ├── teamsView.js         # Tarjetas de clubes con DT y botón de llamada directa
        ├── skeletonLoaders.js   # Shimmer loaders para transiciones fluidas
        ├── emptyState.js        # Mensajes de estado informativos
        └── schemaHelpModal.js   # Modal interactivo con guía de columnas de Google Sheets
```
