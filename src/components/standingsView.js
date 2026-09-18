/**
 * Vista de Tabla de Posiciones y Clasificación - Paleta Saddle-Brown Oficial
 */
import { renderEmptyCategoryState, renderNoSearchResultsState } from './emptyState.js';

export function renderStandingsView(standings, activeCategory, searchQuery = '') {
  // 1. Filtrar por categoría
  let filtered = standings.filter(item => {
    const sCat = (item.Categoria || '').toString().trim().toLowerCase();
    const aCat = activeCategory.toString().trim().toLowerCase();
    return sCat === aCat || sCat.replace('-', '') === aCat.replace('-', '');
  });

  if (filtered.length === 0 && !searchQuery) {
    return renderEmptyCategoryState(activeCategory, 'tabla de posiciones');
  }

  // 2. Filtrar por búsqueda si aplica
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => (item.Equipo || '').toLowerCase().includes(q));
    if (filtered.length === 0) {
      return renderNoSearchResultsState(searchQuery);
    }
  }

  // 3. Ordenar por Puntos (desc), luego por Diferencia de Gol DG (desc), luego por GF (desc)
  const sorted = [...filtered].sort((a, b) => {
    const ptsA = Number(a.Puntos ?? 0);
    const ptsB = Number(b.Puntos ?? 0);
    if (ptsB !== ptsA) return ptsB - ptsA;

    const dgA = Number(a.DG ?? (Number(a.GF ?? 0) - Number(a.GC ?? 0)));
    const dgB = Number(b.DG ?? (Number(b.GF ?? 0) - Number(b.GC ?? 0)));
    if (dgB !== dgA) return dgB - dgA;

    const gfA = Number(a.GF ?? 0);
    const gfB = Number(b.GF ?? 0);
    return gfB - gfA;
  });

  return `
    <div class="space-y-4 max-w-4xl mx-auto px-4 pb-4">
      <!-- Encabezado de Clasificación -->
      <div class="flex items-center justify-between text-xs px-1">
        <div class="flex items-center gap-1.5 font-bold text-slate-800">
          <span>🏆</span>
          <span>Clasificación • ${activeCategory}</span>
        </div>
        <span class="text-[11px] text-slate-500 font-mono">PJ: Partidos | DG: Dif. Gol</span>
      </div>

      <!-- Tabla Responsive con Scroll Horizontal Suave -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soccer-card">
        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold">
                <th scope="col" class="py-3.5 px-3 w-10 text-center">#</th>
                <th scope="col" class="py-3.5 px-3 min-w-[140px]">Club / Equipo</th>
                <th scope="col" class="py-3.5 px-2 text-center" title="Partidos Jugados">PJ</th>
                <th scope="col" class="py-3.5 px-2 text-center text-saddle-brown-700" title="Partidos Ganados">PG</th>
                <th scope="col" class="py-3.5 px-2 text-center text-slate-500" title="Partidos Empatados">PE</th>
                <th scope="col" class="py-3.5 px-2 text-center text-rose-600" title="Partidos Perdidos">PP</th>
                <th scope="col" class="py-3.5 px-2 text-center text-slate-500" title="Goles a Favor">GF</th>
                <th scope="col" class="py-3.5 px-2 text-center text-slate-500" title="Goles en Contra">GC</th>
                <th scope="col" class="py-3.5 px-1.5 text-center font-bold" title="Diferencia de Goles">DG</th>
                <th scope="col" class="sticky right-0 z-10 py-3.5 px-3 text-center font-black text-saddle-brown-900 bg-saddle-brown-100/95 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]" title="Puntos Totales">PTS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${sorted.map((team, idx) => {
                const pos = idx + 1;
                const isLeader = pos === 1;
                const dg = Number(team.DG ?? (Number(team.GF ?? 0) - Number(team.GC ?? 0)));
                const dgSign = dg > 0 ? `+${dg}` : dg;

                return `
                  <tr class="transition-colors ${isLeader ? 'bg-saddle-brown-50/80 font-medium' : 'hover:bg-slate-50'}">
                    <!-- Posición -->
                    <td class="py-3 px-2 text-center text-xs">
                      ${isLeader ? `
                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-black shadow-2xs">
                          1
                        </span>
                      ` : `
                        <span class="inline-flex items-center justify-center w-6 h-6 text-slate-500 font-bold text-xs">
                          ${pos}
                        </span>
                      `}
                    </td>

                    <!-- Nombre del Club -->
                    <td class="py-3 px-2.5 text-slate-900 truncate max-w-[150px]">
                      <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full flex-shrink-0 ${isLeader ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-slate-300'}"></span>
                        <span class="truncate ${isLeader ? 'font-black text-slate-950' : 'font-semibold text-slate-800'}">${team.Equipo || 'Equipo'}</span>
                        ${isLeader ? `
                          <span class="flex-shrink-0 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 tracking-tight">
                            Líder
                          </span>
                        ` : ''}
                      </div>
                    </td>

                    <!-- Estadísticas -->
                    <td class="py-3 px-1.5 text-center text-slate-700 font-medium">${team.PJ ?? 0}</td>
                    <td class="py-3 px-1.5 text-center text-saddle-brown-700 font-bold">${team.PG ?? 0}</td>
                    <td class="py-3 px-1.5 text-center text-slate-500 font-medium">${team.PE ?? 0}</td>
                    <td class="py-3 px-1.5 text-center text-rose-600 font-medium">${team.PP ?? 0}</td>
                    <td class="py-3 px-1.5 text-center text-slate-500">${team.GF ?? 0}</td>
                    <td class="py-3 px-1.5 text-center text-slate-500">${team.GC ?? 0}</td>
                    <td class="py-3 px-1.5 text-center font-bold ${dg > 0 ? 'text-saddle-brown-700' : dg < 0 ? 'text-rose-600' : 'text-slate-500'}">
                      ${dgSign}
                    </td>

                    <!-- Puntos (Fijo a la derecha para móvil) -->
                    <td class="sticky right-0 z-10 py-3 px-3 text-center font-black text-sm shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)] ${
                      isLeader 
                        ? 'text-saddle-brown-900 bg-saddle-brown-100/95 font-black' 
                        : 'text-slate-800 bg-slate-50/90'
                    }">
                      ${team.Puntos ?? 0}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
