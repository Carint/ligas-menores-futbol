/**
 * Componentes de estado vacío, errores y bienvenida / configuración - Paleta Saddle-Brown
 */

export function renderUnconfiguredTabState(tabName = 'partidos') {
  const tabInfo = {
    partidos: {
      title: 'Calendario y Resultados no vinculados',
      desc: 'Para consultar el fixture, horarios y marcadores en vivo de la liga, vincula la hoja de Partidos.',
      variable: 'URL_PARTIDOS',
      tabLabel: 'Partidos',
    },
    posiciones: {
      title: 'Tabla de Posiciones no vinculada',
      desc: 'Para ver la clasificación, puntos y diferencia de goles de los clubes, vincula la hoja de Posiciones.',
      variable: 'URL_TABLA_POSICIONES',
      tabLabel: 'Tabla de Posiciones',
    },
    goleadores: {
      title: 'Tabla de Goleadores no vinculada',
      desc: 'Para consultar el ranking de máximos artilleros y podio de la liga, vincula la hoja de Goles.',
      variable: 'URL_GOLES',
      tabLabel: 'Goleadores',
    },
    equipos: {
      title: 'Directorio de Clubes no vinculado',
      desc: 'Para consultar la lista de equipos participantes y contactos de entrenadores, vincula la hoja de Equipos.',
      variable: 'URL_EQUIPOS',
      tabLabel: 'Equipos',
    },
  };

  const info = tabInfo[tabName] || tabInfo.partidos;

  return `
    <div class="bg-white border border-saddle-brown-200 rounded-3xl p-6 text-center max-w-md mx-auto my-6 shadow-soccer-card relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute -right-10 -top-10 w-28 h-28 bg-saddle-brown-100/50 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Icono Central -->
      <div class="w-14 h-14 bg-saddle-brown-50 border border-saddle-brown-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-saddle-brown-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      </div>

      <h3 class="text-base font-extrabold text-slate-900 mb-1.5">${info.title}</h3>
      <p class="text-xs text-slate-600 mb-5 leading-relaxed">
        ${info.desc}
      </p>

      <div class="bg-slate-50 rounded-2xl p-3.5 text-left border border-slate-200 mb-5">
        <div class="text-[11px] font-bold text-slate-500 mb-1 flex items-center justify-between">
          <span>Variable en <code class="text-saddle-brown-800 font-bold">src/config.js</code>:</span>
        </div>
        <div class="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-mono text-saddle-brown-900 font-bold flex items-center justify-between shadow-sm">
          <span>${info.variable}</span>
          <span class="text-[10px] text-slate-400 font-sans font-normal">Google Sheets</span>
        </div>
      </div>

      <button id="btn-demo-instructions" class="w-full py-2.5 rounded-xl bg-saddle-brown-600 hover:bg-saddle-brown-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        Ver formato y cómo publicar en Google Sheets
      </button>
    </div>
  `;
}

export function renderErrorState(message = 'No se pudieron sincronizar los datos', onRetryName = 'btn-retry-sync') {
  return `
    <div class="bg-white border border-rose-200 rounded-3xl p-6 text-center max-w-md mx-auto my-8 shadow-soccer-card">
      <div class="w-14 h-14 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h4 class="text-base font-bold text-slate-900 mb-1.5">Error de Conexión</h4>
      <p class="text-xs text-slate-600 mb-5 leading-relaxed">
        ${message}. Si estás en la cancha, revisa tu conexión a internet o intenta de nuevo.
      </p>
      <button id="${onRetryName}" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 shadow-sm transition flex items-center justify-center gap-2 mx-auto">
        <svg class="w-4 h-4 text-saddle-brown-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        Reintentar ahora
      </button>
    </div>
  `;
}

export function renderEmptyCategoryState(categoryName, tabTitle = 'partidos') {
  return `
    <div class="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-sm mx-auto my-6 shadow-soccer-card">
      <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div>
      <h4 class="text-sm font-bold text-slate-900 mb-1">Sin registros en ${categoryName}</h4>
      <p class="text-xs text-slate-500">
        Aún no hay ${tabTitle} cargados para esta categoría.
      </p>
    </div>
  `;
}

export function renderNoSearchResultsState(query) {
  return `
    <div class="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-sm mx-auto my-6 shadow-soccer-card">
      <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <h4 class="text-sm font-bold text-slate-900 mb-1">Sin resultados</h4>
      <p class="text-xs text-slate-500">
        No se encontraron coincidencias para "<span class="text-saddle-brown-700 font-bold">${query}</span>".
      </p>
    </div>
  `;
}
