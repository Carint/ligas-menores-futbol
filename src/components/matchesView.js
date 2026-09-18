/**
 * Vista de Partidos / Fixture y Resultados - Paleta Saddle-Brown Oficial
 */
import { renderEmptyCategoryState, renderNoSearchResultsState } from './emptyState.js';

export function renderMatchesView(matches, activeCategory, matchStatusFilter = 'TODOS') {
  // 1. Filtrar por categoría
  const categoryMatches = matches.filter(m => {
    const mCat = (m.Categoria || '').toString().trim().toLowerCase();
    const aCat = activeCategory.toString().trim().toLowerCase();
    return mCat === aCat || mCat.replace('-', '') === aCat.replace('-', '');
  });

  if (categoryMatches.length === 0) {
    return renderEmptyCategoryState(activeCategory, 'partidos o calendario');
  }

  // 2. Filtrar por estado: "TODOS", "PENDIENTES", "FINALIZADOS"
  let filtered = categoryMatches;
  if (matchStatusFilter === 'FINALIZADOS') {
    filtered = categoryMatches.filter(m => (m.Estado || '').toLowerCase().includes('fin'));
  } else if (matchStatusFilter === 'PENDIENTES') {
    filtered = categoryMatches.filter(m => !(m.Estado || '').toLowerCase().includes('fin'));
  }

  // 3. Ordenar desde el más nuevo hasta el más viejo (Newest to Oldest)
  const sorted = [...filtered].sort((a, b) => {
    const tA = parseMatchTimestamp(a.Fecha, a.Hora);
    const tB = parseMatchTimestamp(b.Fecha, b.Hora);

    if (tA !== tB && tA > 0 && tB > 0) {
      return tB - tA; // Más reciente primero (newest to oldest)
    }

    // Si las fechas son iguales o no están definidas, comparar por Jornada descendente
    const jA = parseInt((a.Jornada || '').toString().replace(/\D/g, ''), 10) || 0;
    const jB = parseInt((b.Jornada || '').toString().replace(/\D/g, ''), 10) || 0;
    if (jB !== jA) return jB - jA;

    // Fallback por ID_Partido descendente
    const idA = parseInt((a.ID_Partido || '').toString().replace(/\D/g, ''), 10) || 0;
    const idB = parseInt((b.ID_Partido || '').toString().replace(/\D/g, ''), 10) || 0;
    return idB - idA;
  });

  const filterLabels = {
    TODOS: 'Todos los partidos',
    PENDIENTES: 'Partidos pendientes',
    FINALIZADOS: 'Partidos finalizados',
  };

  const currentFilterLabel = filterLabels[matchStatusFilter] || 'Todos los partidos';

  return `
    <div class="space-y-4 max-w-4xl mx-auto px-4 pb-4">
      <!-- Selector de Estado de Partidos: Todos, Pendientes, Finalizados -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          data-status-filter="TODOS"
          class="match-filter-pill flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            matchStatusFilter === 'TODOS'
              ? 'bg-saddle-brown-600 text-white shadow-sm ring-1 ring-saddle-brown-600'
              : 'bg-white text-slate-600 hover:text-saddle-brown-900 hover:bg-saddle-brown-50/50 border border-slate-200 shadow-sm'
          }"
        >
          Todos los partidos
        </button>

        <button
          type="button"
          data-status-filter="PENDIENTES"
          class="match-filter-pill flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            matchStatusFilter === 'PENDIENTES'
              ? 'bg-saddle-brown-600 text-white shadow-sm ring-1 ring-saddle-brown-600'
              : 'bg-white text-slate-600 hover:text-saddle-brown-900 hover:bg-saddle-brown-50/50 border border-slate-200 shadow-sm'
          }"
        >
          Pendientes
        </button>

        <button
          type="button"
          data-status-filter="FINALIZADOS"
          class="match-filter-pill flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            matchStatusFilter === 'FINALIZADOS'
              ? 'bg-saddle-brown-600 text-white shadow-sm ring-1 ring-saddle-brown-600'
              : 'bg-white text-slate-600 hover:text-saddle-brown-900 hover:bg-saddle-brown-50/50 border border-slate-200 shadow-sm'
          }"
        >
          Finalizados
        </button>
      </div>

      <!-- Resumen contador -->
      <div class="flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
        <span>Partidos: <strong class="text-slate-800">${sorted.length}</strong></span>
        <span>${currentFilterLabel}</span>
      </div>

      <!-- Tarjetas de Partidos o Estado Vacío para el filtro -->
      ${sorted.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          ${sorted.map(match => renderMatchCard(match)).join('')}
        </div>
      ` : `
        <div class="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-sm mx-auto my-4 shadow-soccer-card">
          <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h4 class="text-sm font-bold text-slate-900 mb-1">Sin partidos ${matchStatusFilter === 'PENDIENTES' ? 'pendientes' : 'finalizados'}</h4>
          <p class="text-xs text-slate-500">
            ${matchStatusFilter === 'PENDIENTES' 
              ? 'Todos los partidos registrados en esta categoría ya han finalizado.' 
              : 'Aún no se han registrado partidos finalizados en esta categoría.'}
          </p>
        </div>
      `}
    </div>
  `;
}

function renderMatchCard(match) {
  const isFinalizado = (match.Estado || '').toLowerCase().includes('fin');
  const isEnVivo = (match.Estado || '').toLowerCase().includes('vivo') || (match.Estado || '').toLowerCase().includes('juego');
  const isProgramado = !isFinalizado && !isEnVivo;

  const golesLocal = match.Goles_Local !== undefined && match.Goles_Local !== null && match.Goles_Local !== '' ? match.Goles_Local : '-';
  const golesVisitante = match.Goles_Visitante !== undefined && match.Goles_Visitante !== null && match.Goles_Visitante !== '' ? match.Goles_Visitante : '-';

  const localName = match.Equipo_Local || 'Equipo Local';
  const visitaName = match.Equipo_Visitante || 'Equipo Visitante';

  const matchHora = formatMatchTime(match.Hora, match.Fecha);

  return `
    <article class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-soccer-card relative overflow-hidden transition-all hover:border-saddle-brown-300 hover:shadow-md">
      <!-- Indicador de estado superior -->
      <div class="flex items-center justify-between gap-2 mb-3 text-[11px]">
        <div class="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-slate-500 font-medium">
          <span class="font-bold text-slate-700">${formatJornadaName(match.Jornada)}</span>
          <span>•</span>
          <span>${formatDate(match.Fecha)}</span>
          ${matchHora ? `
            <span>•</span>
            <span class="font-bold text-slate-800">${matchHora}</span>
          ` : ''}
        </div>

        <div>
          ${isEnVivo ? `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saddle-brown-50 text-saddle-brown-800 border border-saddle-brown-300">
              <span class="w-1.5 h-1.5 rounded-full bg-saddle-brown-500 live-indicator"></span>
              EN VIVO
            </span>
          ` : isFinalizado ? `
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              Finalizado
            </span>
          ` : `
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-saddle-brown-50 text-saddle-brown-700 border border-saddle-brown-200">
              Programado
            </span>
          `}
        </div>
      </div>

      <!-- Tablero central del partido -->
      <div class="grid grid-cols-5 items-center py-2 gap-1">
        <!-- Equipo Local -->
        <div class="col-span-2 flex flex-col items-center text-center">
          <div class="w-11 h-11 rounded-2xl bg-saddle-brown-50 border border-saddle-brown-200 flex items-center justify-center text-xs font-black text-saddle-brown-800 shadow-sm mb-1.5">
            ${getTeamInitials(localName)}
          </div>
          <span class="text-xs font-bold text-slate-900 leading-tight line-clamp-2">${localName}</span>
        </div>

        <!-- Marcador / VS Central -->
        <div class="col-span-1 flex flex-col items-center justify-center">
          ${isFinalizado || isEnVivo ? `
            <div class="flex items-center justify-center gap-1.5 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-inner">
              <span class="text-base font-black text-slate-900">${golesLocal}</span>
              <span class="text-xs font-bold text-slate-400">:</span>
              <span class="text-base font-black text-slate-900">${golesVisitante}</span>
            </div>
          ` : `
            <div class="flex flex-col items-center">
              <span class="text-xs font-extrabold text-saddle-brown-800 bg-saddle-brown-50 px-2.5 py-0.5 rounded-lg border border-saddle-brown-200 shadow-sm">
                VS
              </span>
            </div>
          `}
        </div>

        <!-- Equipo Visitante -->
        <div class="col-span-2 flex flex-col items-center text-center">
          <div class="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shadow-sm mb-1.5">
            ${getTeamInitials(visitaName)}
          </div>
          <span class="text-xs font-bold text-slate-900 leading-tight line-clamp-2">${visitaName}</span>
        </div>
      </div>

      <!-- Ubicación / Cancha -->
      <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div class="flex items-center gap-1.5 truncate">
          <svg class="w-3.5 h-3.5 text-saddle-brown-700 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="truncate font-semibold text-slate-700">${match.Cancha || 'Cancha por definir'}</span>
        </div>
      </div>
    </article>
  `;
}

function formatJornadaName(val) {
  if (!val) return 'Jornada';
  const str = val.toString().trim();
  if (str.toLowerCase().startsWith('jornada')) return str;
  const match = str.match(/^J(\d+)$/i);
  if (match) return `Jornada ${match[1]}`;
  if (/^\d+$/.test(str)) return `Jornada ${str}`;
  return str;
}

function formatDate(val) {
  if (!val) return 'Por programar';
  const raw = val.toString().trim();
  const datePart = raw.split(' ')[0];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Formato YYYY-MM-DD
  const parts = datePart.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    const mIdx = parseInt(month, 10) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      return `${parseInt(day, 10)} ${months[mIdx]} ${year}`;
    }
  }

  // Formato DD/MM/YYYY o YYYY/MM/DD
  const slashParts = datePart.split('/');
  if (slashParts.length === 3) {
    if (slashParts[0].length === 4) {
      const [year, month, day] = slashParts;
      const mIdx = parseInt(month, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) return `${parseInt(day, 10)} ${months[mIdx]} ${year}`;
    } else if (slashParts[2].length === 4) {
      const [day, month, year] = slashParts;
      const mIdx = parseInt(month, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) return `${parseInt(day, 10)} ${months[mIdx]} ${year}`;
    }
  }

  return datePart;
}

function parseMatchTimestamp(rawFecha, rawHora) {
  if (!rawFecha) return 0;
  let str = rawFecha.toString().trim();
  if (!str) return 0;

  const horaStr = (rawHora || '').toString().trim();
  if (horaStr && !str.includes(':')) {
    str += ' ' + horaStr;
  }

  // Formato DD/MM/YYYY o DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (dmyMatch) {
    const [, d, m, y, h = '0', min = '0'] = dmyMatch;
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), parseInt(h, 10), parseInt(min, 10)).getTime();
  }

  // Formato YYYY-MM-DD o YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
  if (ymdMatch) {
    const [, y, m, d, h = '0', min = '0'] = ymdMatch;
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), parseInt(h, 10), parseInt(min, 10)).getTime();
  }

  const parsed = new Date(str.replace(' ', 'T')).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

function formatMatchTime(horaVal, fechaVal) {
  let raw = (horaVal || '').toString().trim();
  if (!raw && fechaVal && fechaVal.includes(':')) {
    raw = extractTime(fechaVal);
  }
  if (!raw) return '';

  // Quitar segundos si existen (ej. 09:00:00 -> 9:00)
  raw = raw.replace(/^(\d{1,2}:\d{2}):\d{2}$/, '$1');

  // Si ya tiene AM o PM explícito
  const ampmMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(am|pm|a\.m\.|p\.m\.)?$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2];
    const modifier = ampmMatch[3] ? ampmMatch[3].toLowerCase().replace(/\./g, '') : null;

    if (modifier === 'pm') {
      return `${hours > 12 ? hours - 12 : hours}:${minutes} PM`;
    } else if (modifier === 'am') {
      return `${hours}:${minutes} AM`;
    }

    // Si viene en formato 24 hrs o número simple
    if (hours >= 13 && hours <= 23) {
      return `${hours - 12}:${minutes} PM`;
    } else if (hours === 12) {
      return `12:${minutes} PM`;
    } else if (hours >= 7 && hours <= 11) {
      return `${hours}:${minutes} AM`;
    } else if (hours >= 1 && hours < 7) {
      return `${hours}:${minutes} PM`;
    }
  }

  return raw;
}

function extractTime(val) {
  if (!val) return '';
  const parts = val.toString().split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : '';
}

function getTeamInitials(name) {
  if (!name) return 'FC';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

