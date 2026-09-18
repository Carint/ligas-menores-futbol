/**
 * Barra de Navegación Móvil Inferior (Bottom Navigation Bar) - Paleta Saddle-Brown Oficial
 */

export function renderBottomNav(activeTab = 'partidos') {
  const tabs = [
    {
      id: 'partidos',
      label: 'Partidos',
      icon: `
        <svg class="w-5 h-5 transition-transform duration-200 group-active:scale-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      `,
    },
    {
      id: 'posiciones',
      label: 'Posiciones',
      icon: `
        <svg class="w-5 h-5 transition-transform duration-200 group-active:scale-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7.5"></path>
          <path d="M14 14.66V17c0 .55.45 1 1 1h1.5"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
      `,
    },
    {
      id: 'goleadores',
      label: 'Goleadores',
      disabled: true,
      icon: `
        <svg class="w-5 h-5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m4.93 4.93 4.24 4.24"></path>
          <path d="m14.83 9.17 4.24-4.24"></path>
          <path d="m14.83 14.83 4.24 4.24"></path>
          <path d="m9.17 14.83-4.24 4.24"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `,
    },
    {
      id: 'equipos',
      label: 'Equipos',
      icon: `
        <svg class="w-5 h-5 transition-transform duration-200 group-active:scale-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      `,
    },
  ];

  return `
    <nav 
      class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 pb-[env(safe-area-inset-bottom,8px)] pt-1.5 shadow-lg"
      aria-label="Navegación principal"
    >
      <div class="max-w-md mx-auto grid grid-cols-4 gap-1">
        ${tabs.map(tab => {
          const isDisabled = !!tab.disabled;
          const isActive = !isDisabled && activeTab === tab.id;

          if (isDisabled) {
            return `
              <button
                type="button"
                data-tab="${tab.id}"
                data-disabled="true"
                disabled
                aria-disabled="true"
                title="Goleadores: Funcionalidad disponible próximamente"
                class="nav-tab-btn flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-300 opacity-40 cursor-not-allowed select-none relative"
              >
                <div class="p-1 rounded-lg text-slate-300">
                  ${tab.icon}
                </div>

                <span class="text-[10px] tracking-tight font-medium text-slate-400">
                  ${tab.label}
                </span>
              </button>
            `;
          }

          return `
            <button
              type="button"
              data-tab="${tab.id}"
              class="nav-tab-btn group flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-saddle-brown-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }"
            >
              ${isActive ? `
                <span class="absolute -top-1.5 w-8 h-1 bg-saddle-brown-500 rounded-full shadow-glow-saddle"></span>
              ` : ''}

              <div class="p-1 rounded-lg ${isActive ? 'bg-saddle-brown-50 text-saddle-brown-700' : ''}">
                ${tab.icon}
              </div>

              <span class="text-[10px] tracking-tight ${isActive ? 'text-saddle-brown-900 font-black' : 'font-medium'}">
                ${tab.label}
              </span>
            </button>
          `;
        }).join('')}
      </div>
    </nav>
  `;
}
