/**
 * CONFIGURACIÓN CENTRALIZADA - LIGA MENOR DE FÚTBOL SANTA ROSA DE COPÁN
 * 
 * Para conectar tus hojas de Google Sheets:
 * 1. En Google Sheets ve a: Archivo > Compartir > Publicar en la web
 * 2. Selecciona la pestaña correspondiente (ej. "Partidos")
 * 3. En formato, elige "Valores separados por comas (.csv)"
 * 4. Copia el enlace generado y pégalo en la variable correspondiente abajo.
 */

export const CONFIG = {
  // URLs públicas de Google Sheets (formato CSV o pubhtml)
  URL_CATEGORIAS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=0&single=true",
  URL_EQUIPOS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=951446747&single=true",
  URL_PARTIDOS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=49520821&single=true",
  URL_TABLA_POSICIONES: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4JuRc1MopZ8A9K9stLWB5ak36tJaY4aGIpjN95kq3C1GK-nTyiwlTgWe5DtkjvTWkwfPLaTPa_mTP/pubhtml?gid=854461132&single=true",
  URL_GOLES: "",

  // Configuración de Caché
  CACHE_KEY_PREFIX: "ligas_menores_v5_",
  CACHE_TTL_MS: 2 * 60 * 1000, // 2 minutos (Stale-While-Revalidate)

  // Información de la Liga
  LEAGUE_INFO: {
    name: "Ligas Menores de Fútbol",
    city: "Santa Rosa de Copán",
    country: "Honduras",
    season: "Torneo Oficial 2026",
    tagline: "El semillero de campeones del occidente",
  },

  // Las categorías se obtienen 100% de la hoja de Google Sheets
  DEFAULT_CATEGORIES: []
};
