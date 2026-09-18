/**
 * Punto de Entrada Principal y Controlador de Estado de la Aplicación
 */
import './styles/main.css';
import { CONFIG } from './config.js';
import { dataService } from './services/dataService.js';
import { renderHeader } from './components/header.js';
import { renderCategorySelector } from './components/categorySelector.js';
import { renderMatchesView } from './components/matchesView.js';
import { renderStandingsView } from './components/standingsView.js';
import { renderScorersView } from './components/scorersView.js';
import { renderTeamsView } from './components/teamsView.js';
import { renderBottomNav } from './components/bottomNav.js';
import { renderUnconfiguredTabState, renderErrorState } from './components/emptyState.js';
import { renderSchemaHelpModal } from './components/schemaHelpModal.js';
import {
  renderMatchesSkeleton,
  renderStandingsSkeleton,
  renderScorersSkeleton,
  renderTeamsSkeleton,
} from './components/skeletonLoaders.js';

class App {
  constructor() {
    this.state = {
      activeTab: 'partidos', // 'partidos' | 'posiciones' | 'goleadores' | 'equipos'
      activeCategory: 'Sub-7',
      matchStatusFilter: 'TODOS', // 'TODOS' | 'PENDIENTES' | 'FINALIZADOS'
      data: {
        status: 'LOADING',
        categories: [],
        matches: [],
        standings: [],
        scorers: [],
        teams: [],
        lastUpdated: null,
      },
      isLoading: true,
      isHelpModalOpen: false,
      errorMessage: null,
    };

    this.root = document.getElementById('app');
    this.init();
  }

  async init() {
    this.cleanStaleSampleCache();
    this.renderSkeletonLayout();
    this.setupNetworkListeners();
    await this.loadData(false);
  }

  cleanStaleSampleCache() {
    try {
      // Purgar cualquier caché antiguo de desarrollo
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('ligas_menores_src_') || key.includes('sample') || key.includes('mock')) {
          localStorage.removeItem(key);
        }
      });
      if (!CONFIG.URL_PARTIDOS?.trim()) localStorage.removeItem(`${CONFIG.CACHE_KEY_PREFIX}partidos`);
      if (!CONFIG.URL_TABLA_POSICIONES?.trim()) localStorage.removeItem(`${CONFIG.CACHE_KEY_PREFIX}posiciones`);
      if (!CONFIG.URL_GOLES?.trim()) localStorage.removeItem(`${CONFIG.CACHE_KEY_PREFIX}goles`);
    } catch (e) {
      console.warn('Error limpiando caché:', e);
    }
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.updateHeaderSyncState();
      this.showToast('Conexión reestablecida', 'success');
    });

    window.addEventListener('offline', () => {
      this.updateHeaderSyncState();
      this.showToast('Modo sin conexión', 'warning');
    });
  }

  async loadData(forceRefresh = false) {
    this.state.isLoading = true;
    this.state.errorMessage = null;
    this.render();

    try {
      const result = await dataService.loadAllData(forceRefresh, (updatedKey, freshData) => {
        this.handleBackgroundDataUpdate(updatedKey, freshData);
      });

      this.state.data = result;
      this.state.isLoading = false;

      // Sincronizar categoría activa con las categorías reales cargadas
      if (result.categories && result.categories.length > 0) {
        const catNames = result.categories.map(c => (c.Nombre || c.ID_Categoria || '').toLowerCase().trim());
        if (!catNames.includes(this.state.activeCategory.toLowerCase().trim())) {
          this.state.activeCategory = result.categories[0].Nombre || result.categories[0].ID_Categoria || 'Sub-7';
        }
      }

      this.render();

      if (forceRefresh) {
        this.showToast('Datos sincronizados con Google Sheets', 'success');
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      this.state.isLoading = false;
      this.state.errorMessage = err.message || 'Error al conectar con Google Sheets';
      this.render();
    }
  }

  handleBackgroundDataUpdate(key, freshData) {
    if (this.state.data) {
      if (key === 'partidos') this.state.data.matches = freshData;
      if (key === 'posiciones') this.state.data.standings = freshData;
      if (key === 'equipos') this.state.data.teams = freshData;
      if (key === 'categorias') this.state.data.categories = freshData;
      if (key === 'goles') this.state.data.scorers = dataService.processScorers(freshData);
      this.state.data.lastUpdated = Date.now();
      this.render();
      this.showToast('Datos actualizados en segundo plano', 'info');
    }
  }

  renderSkeletonLayout() {
    this.root.innerHTML = `
      <div class="min-h-screen bg-stadium-bg text-slate-900 flex flex-col pb-safe">
        ${renderHeader({ isLoading: true, lastUpdated: null })}
        <div class="skeleton-shimmer h-12 w-full border-b border-slate-200"></div>
        <main class="flex-1 max-w-4xl w-full mx-auto p-4">
          ${renderMatchesSkeleton()}
        </main>
        ${renderBottomNav(this.state.activeTab)}
      </div>
    `;
  }

  render() {
    const { activeTab, activeCategory, matchStatusFilter, data, isLoading, isHelpModalOpen } = this.state;

    let mainContentHtml = '';

    if (data.status === 'ERROR' || this.state.errorMessage) {
      mainContentHtml = renderErrorState(this.state.errorMessage || 'No se pudieron descargar los datos');
    } 
    else {
      switch (activeTab) {
        case 'partidos':
          if (!CONFIG.URL_PARTIDOS?.trim()) {
            mainContentHtml = renderUnconfiguredTabState('partidos');
          } else if (isLoading && (!data.matches || data.matches.length === 0)) {
            mainContentHtml = renderMatchesSkeleton();
          } else {
            mainContentHtml = renderMatchesView(data.matches, activeCategory, matchStatusFilter);
          }
          break;

        case 'posiciones':
          if (!CONFIG.URL_TABLA_POSICIONES?.trim() && (!data.standings || data.standings.length === 0)) {
            mainContentHtml = renderUnconfiguredTabState('posiciones');
          } else if (isLoading && (!data.standings || data.standings.length === 0)) {
            mainContentHtml = renderStandingsSkeleton();
          } else {
            mainContentHtml = renderStandingsView(data.standings, activeCategory);
          }
          break;

        case 'goleadores':
          if (!CONFIG.URL_GOLES?.trim()) {
            mainContentHtml = renderUnconfiguredTabState('goleadores');
          } else if (isLoading && (!data.scorers || data.scorers.length === 0)) {
            mainContentHtml = renderScorersSkeleton();
          } else {
            mainContentHtml = renderScorersView(data.scorers, activeCategory);
          }
          break;

        case 'equipos':
          if (!CONFIG.URL_EQUIPOS?.trim()) {
            mainContentHtml = renderUnconfiguredTabState('equipos');
          } else if (isLoading && (!data.teams || data.teams.length === 0)) {
            mainContentHtml = renderTeamsSkeleton();
          } else {
            mainContentHtml = renderTeamsView(data.teams, activeCategory);
          }
          break;

        default:
          mainContentHtml = renderMatchesView(data.matches, activeCategory, matchStatusFilter);
      }
    }

    this.root.innerHTML = `
      <div class="min-h-screen bg-stadium-bg text-slate-900 flex flex-col pb-safe">
        <!-- Barra Superior -->
        ${renderHeader({
          isLoading,
          lastUpdated: data.lastUpdated,
        })}

        <!-- Selector Global de Categorías -->
        ${renderCategorySelector(data.categories, activeCategory)}

        <!-- Contenedor Principal de la Vista -->
        <main class="flex-1 w-full" id="view-container">
          ${mainContentHtml}
        </main>

        <!-- Barra Inferior Fija (Bottom Navigation Bar) -->
        ${renderBottomNav(activeTab)}

        <!-- Modal de Instrucciones y Esquema -->
        ${renderSchemaHelpModal(isHelpModalOpen)}

        <!-- Contenedor de Toasts / Notificaciones -->
        <div id="toast-container" class="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col gap-2"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // 1. Pestañas de Navegación Inferior
    const tabButtons = this.root.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled || btn.getAttribute('data-disabled') === 'true') {
          return;
        }
        const targetTab = btn.getAttribute('data-tab');
        if (targetTab && targetTab !== this.state.activeTab) {
          this.state.activeTab = targetTab;
          this.render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 2. Chips de Selección de Categoría
    const catChips = this.root.querySelectorAll('.category-chip');
    catChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-category');
        if (cat && cat !== this.state.activeCategory) {
          this.state.activeCategory = cat;
          this.state.matchStatusFilter = 'TODOS'; // Reset filtro al cambiar de categoría
          this.render();
        }
      });
    });

    // 3. Filtros de Estado en Partidos (Todos los partidos, Pendientes, Finalizados)
    const statusFilterPills = this.root.querySelectorAll('.match-filter-pill');
    statusFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-status-filter');
        if (filter && filter !== this.state.matchStatusFilter) {
          this.state.matchStatusFilter = filter;
          this.render();
        }
      });
    });

    // 4. Botón Refrescar Datos (Cabecera)
    const refreshBtn = this.root.querySelector('#btn-refresh-data');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadData(true);
      });
    }

    // 6. Botón Reintentar (Error)
    const retryBtn = this.root.querySelector('#btn-retry-sync');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadData(true);
      });
    }

    // 7. Botón Abrir Guía de Esquema / Columnas
    const openGuideBtn = this.root.querySelector('#btn-demo-instructions');
    if (openGuideBtn) {
      openGuideBtn.addEventListener('click', () => {
        this.state.isHelpModalOpen = true;
        this.render();
      });
    }

    // 8. Botones Cerrar Guía
    const closeGuideBtn = this.root.querySelector('#btn-close-modal');
    if (closeGuideBtn) {
      closeGuideBtn.addEventListener('click', () => {
        this.state.isHelpModalOpen = false;
        this.render();
      });
    }

    const closeGuideFooterBtn = this.root.querySelector('#btn-close-modal-footer');
    if (closeGuideFooterBtn) {
      closeGuideFooterBtn.addEventListener('click', () => {
        this.state.isHelpModalOpen = false;
        this.render();
      });
    }
  }

  updateHeaderSyncState() {
    const badge = this.root.querySelector('#sync-badge');
    if (badge) {
      const isOnline = navigator.onLine;
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}"></span>
        <span>${isOnline ? 'En línea' : 'Sin conexión'}</span>
      `;
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
      success: 'bg-emerald-600/90 text-white border-emerald-400/40',
      warning: 'bg-amber-600/90 text-white border-amber-400/40',
      info: 'bg-gray-800/95 text-white border-gray-700',
    };

    const toast = document.createElement('div');
    toast.className = `px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl border backdrop-blur-md transition-all duration-300 transform -translate-y-2 opacity-0 flex items-center gap-2 ${colors[type] || colors.info}`;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('-translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('-translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
