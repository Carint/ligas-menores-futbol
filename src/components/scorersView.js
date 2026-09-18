/**
 * Vista de Goleadores (Pichichi) con Podio Visual y Lista Clasificada - Paleta Saddle-Brown Oficial
 */
import { renderEmptyCategoryState, renderNoSearchResultsState } from './emptyState.js';

export function renderScorersView(scorers, activeCategory, searchQuery = '') {
  // 1. Filtrar por categoría
  let filtered = scorers.filter(item => {
    if (!item.categoria) return true;
    const sCat = item.categoria.toString().trim().toLowerCase();
    const aCat = activeCategory.toString().trim().toLowerCase();
    return sCat === aCat || sCat.replace('-', '') === aCat.replace('-', '');
  });

  if (filtered.length === 0 && !searchQuery) {
    return renderEmptyCategoryState(activeCategory, 'goleadores registrados');
  }

  // 2. Filtrar por búsqueda
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => 
      (item.nombre || '').toLowerCase().includes(q) || 
      (item.equipo || '').toLowerCase().includes(q)
    );
    if (filtered.length === 0) {
      return renderNoSearchResultsState(searchQuery);
    }
  }

  // 3. Separar en Podio (Top 3) y Resto de la lista
  const top1 = filtered[0] || null;
  const top2 = filtered[1] || null;
  const top3 = filtered[2] || null;
  const rest = filtered.slice(3);

  return `
    <div class="space-y-5 max-w-4xl mx-auto px-4 pb-4">
      <!-- Encabezado de la vista -->
      <div class="flex items-center justify-between text-xs px-1">
        <div class="flex items-center gap-1.5 font-bold text-slate-800">
          <span>⚽</span>
          <span>Tabla de Goleadores • ${activeCategory}</span>
        </div>
        <span class="text-[11px] text-slate-500 font-medium">${filtered.length} anotadores</span>
      </div>

      <!-- Podio Visual Top 3 -->
      ${top1 ? `
        <div class="grid grid-cols-3 gap-2.5 pt-6 items-end">
          <!-- Segundo Lugar (Plata) -->
          ${top2 ? renderPodiumCard(top2, 2, 'h-40 border-slate-300 bg-gradient-to-t from-slate-100/80 to-white shadow-sm', 'text-slate-800', '🥈', 'bg-slate-200 text-slate-700 border-slate-300') : '<div></div>'}

          <!-- Primer Lugar (Oro / Saddle 500) -->
          ${renderPodiumCard(top1, 1, 'h-48 border-saddle-brown-400 bg-gradient-to-t from-saddle-brown-100/70 to-white shadow-md -translate-y-2.5', 'text-saddle-brown-700', '👑', 'bg-saddle-brown-100 text-saddle-brown-800 border-saddle-brown-300')}

          <!-- Tercer Lugar (Bronce / Saddle 700) -->
          ${top3 ? renderPodiumCard(top3, 3, 'h-36 border-saddle-brown-300 bg-gradient-to-t from-saddle-brown-50/70 to-white shadow-sm', 'text-saddle-brown-800', '🥉', 'bg-saddle-brown-100 text-saddle-brown-700 border-saddle-brown-200') : '<div></div>'}
        </div>
      ` : ''}

      <!-- Lista Clasificada (Posición 4 en adelante) -->
      ${rest.length > 0 ? `
        <div class="bg-white rounded-2xl border border-slate-200 p-2 divide-y divide-slate-100 shadow-soccer-card">
          <div class="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Posición y Jugador</span>
            <span>Goles</span>
          </div>
          ${rest.map((scorer, idx) => {
            const pos = idx + 4;
            return `
              <div class="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="w-6 text-center text-xs font-bold text-slate-400 font-mono">${pos}</span>
                  <div class="w-8 h-8 rounded-full bg-saddle-brown-50 border border-saddle-brown-200 flex items-center justify-center text-xs font-black text-saddle-brown-800 flex-shrink-0">
                    ${getInitials(scorer.nombre)}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-slate-900 truncate">${scorer.nombre}</p>
                    <p class="text-[11px] text-slate-500 truncate">${scorer.equipo}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <span class="px-2.5 py-1 rounded-xl bg-saddle-brown-50 border border-saddle-brown-200 font-black text-xs text-saddle-brown-800 font-mono shadow-sm">
                    ${scorer.goles} ${scorer.goles === 1 ? 'gol' : 'goles'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderPodiumCard(item, place, extraClass, badgeColor, trophyIcon, rankBadgeClass) {
  return `
    <div class="rounded-2xl p-3 border flex flex-col items-center justify-between text-center relative ${extraClass}">
      <!-- Badge de puesto -->
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center filter drop-shadow">
        <span class="text-base">${trophyIcon}</span>
      </div>

      <div class="pt-2 w-full">
        <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${rankBadgeClass} mb-1">
          #${place}
        </span>
        <h4 class="text-xs font-black text-slate-900 truncate w-full px-1" title="${item.nombre}">
          ${item.nombre}
        </h4>
        <p class="text-[10px] text-slate-500 font-medium truncate w-full" title="${item.equipo}">
          ${item.equipo}
        </p>
      </div>

      <div class="pt-2 w-full border-t border-slate-200/80 mt-2">
        <span class="text-base font-black ${badgeColor} font-mono">
          ${item.goles}
        </span>
        <span class="text-[9px] text-slate-400 font-bold uppercase tracking-tight block">
          ${item.goles === 1 ? 'Gol' : 'Goles'}
        </span>
      </div>
    </div>
  `;
}

function getInitials(name) {
  if (!name) return 'J';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
