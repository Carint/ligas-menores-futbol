/**
 * Vista del Directorio de Equipos y Clubes Participantes - Paleta Saddle-Brown Oficial
 */
import { renderEmptyCategoryState, renderNoSearchResultsState } from './emptyState.js';

export function renderTeamsView(teams, activeCategory, searchQuery = '') {
  // 1. Filtrar por categoría
  let filtered = teams.filter(item => {
    const tCat = (item.Categoria || '').toString().trim().toLowerCase();
    const aCat = activeCategory.toString().trim().toLowerCase();
    return tCat === aCat || tCat.replace('-', '') === aCat.replace('-', '');
  });

  if (filtered.length === 0 && !searchQuery) {
    return renderEmptyCategoryState(activeCategory, 'equipos o clubes inscritos');
  }

  // 2. Filtrar por búsqueda si aplica
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => 
      (item.Nombre_Equipo || '').toLowerCase().includes(q) ||
      (item.Entrenador || '').toLowerCase().includes(q) ||
      (item.Contacto || '').toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      return renderNoSearchResultsState(searchQuery);
    }
  }

  return `
    <div class="space-y-4 max-w-4xl mx-auto px-4 pb-4">
      <!-- Encabezado de la vista -->
      <div class="flex items-center justify-between text-xs px-1">
        <div class="flex items-center gap-1.5 font-bold text-slate-800">
          <span>🛡️</span>
          <span>Clubes Participantes • ${activeCategory}</span>
        </div>
        <span class="text-[11px] text-slate-500 font-medium">${filtered.length} equipos</span>
      </div>

      <!-- Cuadrícula de Clubes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        ${filtered.map(team => renderTeamCard(team)).join('')}
      </div>
    </div>
  `;
}

function renderTeamCard(team) {
  const teamName = team.Nombre_Equipo || 'Equipo';
  const rawCoach = team.Entrenador ? team.Entrenador.toString().trim() : '';
  const coach = (!rawCoach || rawCoach.toLowerCase() === 'pendiente') 
    ? 'Por definir' 
    : rawCoach;

  const rawContact = team.Contacto ? team.Contacto.toString().trim() : '';
  const cleanPhone = rawContact.replace(/\D/g, '');
  const isPhoneNumber = cleanPhone.length >= 7 && cleanPhone !== '0' && cleanPhone !== '0000000';
  const hasValidContact = isPhoneNumber || (rawContact !== '0' && rawContact !== '' && rawContact.toLowerCase() !== 'pendiente');

  return `
    <article class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-soccer-card relative overflow-hidden transition-all hover:border-saddle-brown-300 hover:shadow-md">
      <div class="flex items-start gap-3">
        <!-- Escudo / Iniciales -->
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-saddle-brown-100 to-saddle-brown-50 border border-saddle-brown-300 flex items-center justify-center text-sm font-black text-saddle-brown-900 shadow-sm flex-shrink-0">
          ${getTeamInitials(teamName)}
        </div>

        <!-- Info del Club -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1 mb-0.5">
            <h4 class="text-sm font-black text-slate-900 truncate" title="${teamName}">
              ${teamName}
            </h4>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-saddle-brown-50 text-saddle-brown-800 border border-saddle-brown-200 flex-shrink-0">
              ${team.Categoria || 'Liga'}
            </span>
          </div>

          <!-- Entrenador -->
          <div class="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
            <svg class="w-3.5 h-3.5 text-saddle-brown-700 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="truncate">DT: <strong class="${coach === 'Por definir' ? 'text-slate-400 font-normal' : 'text-slate-800 font-semibold'}">${coach}</strong></span>
          </div>
        </div>
      </div>

      <!-- Pie de tarjeta: Contacto / Comunicación -->
      <div class="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
          <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span class="truncate">${hasValidContact ? rawContact : 'Sin teléfono registrado'}</span>
        </div>

        ${isPhoneNumber ? `
          <a
            href="tel:${cleanPhone}"
            class="px-3 py-1 rounded-xl bg-saddle-brown-600 hover:bg-saddle-brown-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-1 flex-shrink-0 active:scale-95"
            title="Llamar al contacto"
          >
            <span>Llamar</span>
          </a>
        ` : ''}
      </div>
    </article>
  `;
}

function getTeamInitials(name) {
  if (!name) return 'FC';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
