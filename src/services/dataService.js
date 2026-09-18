import Papa from 'papaparse';
import { CONFIG } from '../config.js';

class DataService {
  constructor() {
    this.memoryCache = new Map();
  }

  /**
   * Obtiene la clave de caché para localStorage
   */
  getCacheKey(endpointKey) {
    return `${CONFIG.CACHE_KEY_PREFIX}${endpointKey}`;
  }

  /**
   * Guarda datos en localStorage con marca de tiempo
   */
  saveToLocalStorage(endpointKey, data) {
    if (typeof localStorage === 'undefined') return;
    try {
      const payload = {
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(this.getCacheKey(endpointKey), JSON.stringify(payload));
    } catch (err) {
      console.warn('No se pudo guardar en localStorage:', err);
    }
  }

  /**
   * Obtiene datos del localStorage si existen
   */
  getFromLocalStorage(endpointKey) {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this.getCacheKey(endpointKey));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const isFresh = Date.now() - parsed.timestamp < CONFIG.CACHE_TTL_MS;
      return {
        data: parsed.data,
        timestamp: parsed.timestamp,
        isFresh,
      };
    } catch (err) {
      console.warn('Error al leer de localStorage:', err);
      return null;
    }
  }

  /**
   * Normaliza URLs de Google Sheets para garantizar que se solicite en formato CSV
   * (convierte automáticamente enlaces /pubhtml a /pub?output=csv)
   */
  normalizeGoogleSheetsCsvUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    let clean = rawUrl.trim();
    if (clean.includes('docs.google.com/spreadsheets')) {
      if (clean.includes('/pubhtml')) {
        clean = clean.replace('/pubhtml', '/pub');
      }
      if (!clean.includes('output=csv')) {
        clean += (clean.includes('?') ? '&' : '?') + 'output=csv';
      }
    }
    return clean;
  }

  /**
   * Descarga y parsea un CSV desde una URL pública con PapaParse
   */
  async fetchAndParseCsv(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
      throw new Error('URL_NOT_CONFIGURED');
    }

    const url = this.normalizeGoogleSheetsCsvUrl(rawUrl);

    // Agregar un timestamp para evitar caché agresivo del CDN de Google al forzar actualización
    const fetchUrl = url.includes('?') 
      ? `${url}&_t=${Date.now()}` 
      : `${url}?_t=${Date.now()}`;

    const response = await fetch(fetchUrl, {
      headers: {
        'Accept': 'text/csv, text/plain, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            console.warn('Advertencias de parseo CSV:', results.errors);
          }
          // Limpiar strings y eliminar filas completamente vacías
          const cleaned = (results.data || []).map(row => {
            const cleanRow = {};
            for (const [key, value] of Object.entries(row)) {
              cleanRow[key] = typeof value === 'string' ? value.trim() : value;
            }
            return cleanRow;
          }).filter(row => Object.values(row).some(v => v !== null && v !== ''));

          resolve(cleaned);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  /**
   * Carga un conjunto de datos con estrategia Stale-While-Revalidate
   */
  async getDataset(key, url, forceRefresh = false, onBackgroundUpdate = null) {
    // Si la URL no está definida
    if (!url || url.trim() === '') {
      return {
        status: 'UNCONFIGURED',
        data: [],
        lastUpdated: null,
      };
    }

    const cached = this.getFromLocalStorage(key);

    // Si está en caché fresca y no se forzó actualización
    if (cached && cached.isFresh && !forceRefresh) {
      return {
        status: 'SUCCESS',
        data: cached.data,
        lastUpdated: cached.timestamp,
        fromCache: true,
      };
    }

    // Si está en caché pero ya no es fresca (Stale-While-Revalidate)
    if (cached && !cached.isFresh && !forceRefresh) {
      // Lanzar actualización en segundo plano
      this.fetchAndParseCsv(url)
        .then((freshData) => {
          this.saveToLocalStorage(key, freshData);
          if (typeof onBackgroundUpdate === 'function') {
            onBackgroundUpdate(key, freshData);
          }
        })
        .catch((err) => {
          console.warn(`Error al revalidar ${key} en segundo plano:`, err);
        });

      return {
        status: 'SUCCESS',
        data: cached.data,
        lastUpdated: cached.timestamp,
        fromCache: true,
        isStale: true,
      };
    }

    // Fetch directo (forzado o sin caché previo)
    try {
      const data = await this.fetchAndParseCsv(url);
      this.saveToLocalStorage(key, data);
      return {
        status: 'SUCCESS',
        data,
        lastUpdated: Date.now(),
        fromCache: false,
      };
    } catch (err) {
      // Si falló el fetch pero tenemos datos en caché (aunque estén expirados)
      if (cached) {
        return {
          status: 'SUCCESS',
          data: cached.data,
          lastUpdated: cached.timestamp,
          fromCache: true,
          offlineFallback: true,
        };
      }

      return {
        status: 'ERROR',
        error: err.message || 'Error de conexión',
        data: [],
        lastUpdated: null,
      };
    }
  }

  /**
   * Carga todos los conjuntos de datos en paralelo
   */
  async loadAllData(forceRefresh = false, onBackgroundUpdate = null) {
    const isAnyUrlConfigured = 
      Boolean(CONFIG.URL_PARTIDOS?.trim()) ||
      Boolean(CONFIG.URL_TABLA_POSICIONES?.trim()) ||
      Boolean(CONFIG.URL_EQUIPOS?.trim()) ||
      Boolean(CONFIG.URL_CATEGORIAS?.trim()) ||
      Boolean(CONFIG.URL_GOLES?.trim());

    if (!isAnyUrlConfigured) {
      return {
        status: 'UNCONFIGURED',
        isConfigured: false,
        categories: CONFIG.DEFAULT_CATEGORIES,
        matches: [],
        standings: [],
        teams: [],
        scorers: [],
        lastUpdated: null,
      };
    }

    const [catRes, teamsRes, matchesRes, standingsRes, goalsRes] = await Promise.all([
      this.getDataset('categorias', CONFIG.URL_CATEGORIAS, forceRefresh, onBackgroundUpdate),
      this.getDataset('equipos', CONFIG.URL_EQUIPOS, forceRefresh, onBackgroundUpdate),
      this.getDataset('partidos', CONFIG.URL_PARTIDOS, forceRefresh, onBackgroundUpdate),
      this.getDataset('posiciones', CONFIG.URL_TABLA_POSICIONES, forceRefresh, onBackgroundUpdate),
      this.getDataset('goles', CONFIG.URL_GOLES, forceRefresh, onBackgroundUpdate),
    ]);

    // Verificar si hubo un error general de conexión
    const hasNetworkError = [catRes, teamsRes, matchesRes, standingsRes, goalsRes]
      .some(r => r.status === 'ERROR');

    // Procesar categorías
    const categories = (catRes.data && catRes.data.length > 0)
      ? catRes.data
      : (CONFIG.DEFAULT_CATEGORIES || []);

    // Enriquecer registros cruzando ID_Categoria con el Nombre (Sub-7, Sub-9, etc.)
    const teams = this.enrichWithCategoryNames(teamsRes.data || [], categories);
    let matches = this.enrichWithCategoryNames(matchesRes.data || [], categories);
    matches = this.enrichMatchesWithTeamNames(matches, teams);

    // Tabla de posiciones: usar la hoja si existe, o calcularla dinámicamente desde los partidos
    let standings = [];
    if (standingsRes.data && standingsRes.data.length > 0) {
      standings = this.enrichWithCategoryNames(standingsRes.data, categories);
      standings = this.enrichStandingsWithTeamNames(standings, teams);
    } else if (matches.length > 0) {
      standings = this.calculateStandingsFromMatches(matches, teams, categories);
    }

    const goalsRaw = this.enrichWithCategoryNames(goalsRes.data || [], categories);

    // Procesar goleadores
    const scorers = this.processScorers(goalsRaw);

    return {
      status: hasNetworkError ? 'PARTIAL_ERROR' : 'SUCCESS',
      isConfigured: true,
      categories,
      teams,
      matches,
      standings,
      scorers,
      lastUpdated: matchesRes.lastUpdated || teamsRes.lastUpdated || Date.now(),
    };
  }

  /**
   * Resuelve ID_Categoria (ej. CAT-01) al nombre legible (ej. Sub-7)
   */
  enrichWithCategoryNames(items, categories) {
    if (!items || items.length === 0) return [];
    const catMap = new Map();
    (categories || []).forEach(cat => {
      const id = (cat.ID_Categoria || '').toString().trim().toUpperCase();
      const name = (cat.Nombre || '').toString().trim();
      if (id) catMap.set(id, name);
      if (name) catMap.set(name.toUpperCase(), name);
    });

    return items.map(item => {
      const catKey = (item.Categoria || item.ID_Categoria || '').toString().trim().toUpperCase();
      const resolvedCategory = catMap.get(catKey) || item.Categoria || item.ID_Categoria || '';
      return {
        ...item,
        Categoria: resolvedCategory,
      };
    });
  }

  /**
   * Resuelve IDs de equipos (ej. EQ-09) al nombre oficial del Club
   */
  enrichMatchesWithTeamNames(matches, teams) {
    if (!matches || matches.length === 0) return [];
    const teamMap = new Map();
    (teams || []).forEach(t => {
      const id = (t.ID_Equipo || '').toString().trim().toUpperCase();
      const name = (t.Nombre_Equipo || t.Nombre || '').toString().trim();
      if (id && name) teamMap.set(id, name);
    });

    return matches.map(m => {
      const localKey = (m.Equipo_Local || '').toString().trim().toUpperCase();
      const visitKey = (m.Equipo_Visitante || '').toString().trim().toUpperCase();
      return {
        ...m,
        Equipo_Local: teamMap.get(localKey) || m.Equipo_Local || 'Equipo Local',
        Equipo_Visitante: teamMap.get(visitKey) || m.Equipo_Visitante || 'Equipo Visitante',
      };
    });
  }

  /**
   * Resuelve IDs de equipos en la tabla de posiciones
   */
  enrichStandingsWithTeamNames(standings, teams) {
    if (!standings || standings.length === 0) return [];
    const teamMap = new Map();
    (teams || []).forEach(t => {
      const id = (t.ID_Equipo || '').toString().trim().toUpperCase();
      const name = (t.Nombre_Equipo || t.Nombre || '').toString().trim();
      if (id && name) teamMap.set(id, name);
    });

    return standings.map(s => {
      const eqKey = (s.Equipo || s.ID_Equipo || '').toString().trim().toUpperCase();
      return {
        ...s,
        Equipo: teamMap.get(eqKey) || s.Equipo || s.ID_Equipo || 'Equipo',
      };
    });
  }

  /**
   * Calcula automáticamente la tabla de posiciones a partir de los partidos finalizados
   */
  calculateStandingsFromMatches(matches, teams, categories) {
    const standings = [];

    (categories || []).forEach(cat => {
      const catName = (cat.Nombre || cat.ID_Categoria || '').toString().trim();
      if (!catName) return;

      const catTeams = (teams || []).filter(t => {
        const tCat = (t.Categoria || '').toString().trim().toLowerCase();
        return tCat === catName.toLowerCase() || tCat.replace('-', '') === catName.toLowerCase().replace('-', '');
      });

      const stats = new Map();
      catTeams.forEach(t => {
        const name = (t.Nombre_Equipo || t.Nombre || t.ID_Equipo || '').toString().trim();
        if (name && !stats.has(name)) {
          stats.set(name, {
            Equipo: name,
            Categoria: catName,
            PJ: 0,
            PG: 0,
            PE: 0,
            PP: 0,
            GF: 0,
            GC: 0,
            DG: 0,
            Puntos: 0,
          });
        }
      });

      const catMatches = (matches || []).filter(m => {
        const mCat = (m.Categoria || '').toString().trim().toLowerCase();
        return mCat === catName.toLowerCase() || mCat.replace('-', '') === catName.toLowerCase().replace('-', '');
      });

      catMatches.forEach(m => {
        const isFinal = (m.Estado || '').toString().toLowerCase().includes('fin');
        const hasScores = m.Goles_Local !== undefined && m.Goles_Local !== null && m.Goles_Local !== '' &&
                          m.Goles_Visitante !== undefined && m.Goles_Visitante !== null && m.Goles_Visitante !== '';

        if (isFinal || hasScores) {
          const gl = Number(m.Goles_Local || 0);
          const gv = Number(m.Goles_Visitante || 0);
          const loc = (m.Equipo_Local || '').toString().trim();
          const vis = (m.Equipo_Visitante || '').toString().trim();

          if (loc && !stats.has(loc)) {
            stats.set(loc, { Equipo: loc, Categoria: catName, PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0, DG: 0, Puntos: 0 });
          }
          if (vis && !stats.has(vis)) {
            stats.set(vis, { Equipo: vis, Categoria: catName, PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0, DG: 0, Puntos: 0 });
          }

          if (loc && vis && stats.has(loc) && stats.has(vis)) {
            const sLoc = stats.get(loc);
            const sVis = stats.get(vis);

            sLoc.PJ += 1;
            sVis.PJ += 1;
            sLoc.GF += gl;
            sLoc.GC += gv;
            sLoc.DG = sLoc.GF - sLoc.GC;
            sVis.GF += gv;
            sVis.GC += gl;
            sVis.DG = sVis.GF - sVis.GC;

            if (gl > gv) {
              sLoc.PG += 1;
              sLoc.Puntos += 3;
              sVis.PP += 1;
            } else if (gv > gl) {
              sVis.PG += 1;
              sVis.Puntos += 3;
              sLoc.PP += 1;
            } else {
              sLoc.PE += 1;
              sLoc.Puntos += 1;
              sVis.PE += 1;
              sVis.Puntos += 1;
            }
          }
        }
      });

      standings.push(...Array.from(stats.values()));
    });

    return standings;
  }

  /**
   * Procesa la tabla de goles para generar ranking de goleadores
   * Admite:
   * 1. Lista de goles individuales (ID_Gol, Jugador_Nombre, Equipo, ...) -> Agrupa y cuenta
   * 2. Lista ya acumulada (Jugador_Nombre, Equipo, Goles, ...) -> Ordena por Goles
   */
  processScorers(goalsRows) {
    if (!goalsRows || goalsRows.length === 0) return [];

    // Comprobar si ya tiene una columna de cantidad de goles (Goles o Total_Goles)
    const hasAggregatedColumn = goalsRows.some(r => r.Goles !== undefined || r.Total_Goles !== undefined || r.Goles_Anotados !== undefined);

    if (hasAggregatedColumn) {
      return goalsRows
        .map(row => ({
          nombre: row.Jugador_Nombre || row.Jugador || row.Nombre || 'Jugador',
          equipo: row.Equipo || row.Nombre_Equipo || 'Equipo',
          categoria: (row.Categoria || '').trim().toUpperCase(),
          goles: Number(row.Goles ?? row.Total_Goles ?? row.Goles_Anotados ?? 0),
        }))
        .filter(s => s.goles > 0)
        .sort((a, b) => b.goles - a.goles);
    }

    // Si son goles individuales por evento: ID_Gol, ID_Partido, ID_Jugador, Jugador_Nombre, Equipo
    const map = new Map();

    for (const row of goalsRows) {
      const name = (row.Jugador_Nombre || row.Nombre || 'Desconocido').trim();
      const team = (row.Equipo || row.Nombre_Equipo || '').trim();
      const cat = (row.Categoria || '').trim().toUpperCase();
      const key = `${name.toLowerCase()}_${team.toLowerCase()}_${cat.toLowerCase()}`;

      if (!map.has(key)) {
        map.set(key, {
          nombre: name,
          equipo: team,
          categoria: cat,
          goles: 0,
        });
      }

      map.get(key).goles += 1;
    }

    return Array.from(map.values()).sort((a, b) => b.goles - a.goles);
  }

  /**
   * Limpia toda la caché almacenada
   */
  clearCache() {
    ['categorias', 'equipos', 'partidos', 'posiciones', 'goles'].forEach(key => {
      localStorage.removeItem(this.getCacheKey(key));
    });
  }
}

export const dataService = new DataService();
