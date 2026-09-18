/**
 * Componente de Cabecera Móvil - Paleta Saddle-Brown Oficial
 */
import { CONFIG } from '../config.js';

export function renderHeader(state) {
  const isOnline = navigator.onLine;
  const lastUpdatedText = state.lastUpdated
    ? getTimeAgo(state.lastUpdated)
    : 'Pendiente';

  return `
    <header class="sticky top-0 z-40 glass-nav border-b border-slate-200/80 px-4 pt-3 pb-3 transition-colors">
      <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <!-- Logo y Nombre de la Liga -->
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-saddle-brown-700 to-saddle-brown-500 p-0.5 shadow-glow-saddle flex-shrink-0 flex items-center justify-center">
            <img src="/icons/icon-192.svg" alt="Escudo" class="w-full h-full object-contain rounded-xl" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <h1 class="text-sm font-extrabold text-slate-900 tracking-tight truncate">
                ${CONFIG.LEAGUE_INFO.name}
              </h1>
              <span class="inline-flex items-center px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-saddle-brown-50 text-saddle-brown-800 border border-saddle-brown-200">
                SRC
              </span>
            </div>
            <p class="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <span class="font-medium text-slate-600">${CONFIG.LEAGUE_INFO.city}</span>
              <span>•</span>
              <span class="text-saddle-brown-700 font-semibold">${CONFIG.LEAGUE_INFO.season}</span>
            </p>
          </div>
        </div>

        <!-- Acciones: Estado de Sincronización y Botón Refrescar -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Indicador de Estado -->
          <div id="sync-badge" class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-medium">
            <span class="w-2 h-2 rounded-full ${state.isLoading ? 'bg-amber-500 animate-ping' : isOnline ? 'bg-saddle-brown-600' : 'bg-rose-500'}"></span>
            <span id="sync-time-text">${state.isLoading ? 'Actualizando...' : lastUpdatedText}</span>
          </div>

          <!-- Botón Refrescar Datos -->
          <button 
            id="btn-refresh-data" 
            title="Actualizar datos"
            aria-label="Actualizar datos"
            class="p-2 rounded-xl bg-white hover:bg-saddle-brown-50 active:scale-95 text-saddle-brown-700 border border-slate-200 shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
            ${state.isLoading ? 'disabled' : ''}
          >
            <svg class="w-4 h-4 text-saddle-brown-700 ${state.isLoading ? 'animate-spin' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `;
}

function getTimeAgo(timestamp) {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 45) return 'Actualizado justo ahora';
  if (diffSec < 90) return 'Hace 1 min';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  return `Hace ${diffHours} h`;
}
