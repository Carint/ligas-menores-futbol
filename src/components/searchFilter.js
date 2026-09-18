/**
 * Componente de Buscador y Filtro Rápido - Paleta Saddle-Brown
 */

export function renderSearchFilter(searchQuery = '', activeTab = 'partidos') {
  const placeholderMap = {
    partidos: 'Buscar partido por equipo o cancha...',
    posiciones: 'Buscar equipo en la tabla...',
    goleadores: 'Buscar jugador o equipo...',
    equipos: 'Buscar club o entrenador...',
  };

  const placeholder = placeholderMap[activeTab] || 'Buscar...';

  return `
    <div class="px-4 mb-3 max-w-4xl mx-auto">
      <div class="relative flex items-center">
        <div class="absolute left-3.5 pointer-events-none text-slate-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="search"
          id="global-search-input"
          value="${escapeHtml(searchQuery)}"
          placeholder="${placeholder}"
          class="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-saddle-brown-500 focus:ring-2 focus:ring-saddle-brown-200 transition-all shadow-sm"
        />
        ${searchQuery ? `
          <button
            type="button"
            id="btn-clear-search"
            class="absolute right-3 text-slate-400 hover:text-saddle-brown-800 p-1"
            title="Limpiar búsqueda"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[m]);
}
