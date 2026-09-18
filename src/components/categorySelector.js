/**
 * Selector global de categorías mediante Chips deslizables - Paleta Saddle-Brown
 */

export function renderCategorySelector(categories, activeCategory) {
  const list = categories && categories.length > 0 ? categories : [];

  if (list.length === 0) {
    return `
      <div class="px-4 py-2.5 max-w-4xl mx-auto">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div class="h-8 w-20 bg-slate-200/70 rounded-2xl skeleton-shimmer"></div>
          <div class="h-8 w-20 bg-slate-200/70 rounded-2xl skeleton-shimmer"></div>
          <div class="h-8 w-20 bg-slate-200/70 rounded-2xl skeleton-shimmer"></div>
        </div>
      </div>
    `;
  }

  return `
    <div class="px-4 py-2.5 max-w-4xl mx-auto">
      <div class="flex items-center gap-1.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <span class="w-2 h-2 rounded-full bg-saddle-brown-600"></span>
        <span>Categoría del Torneo:</span>
      </div>

      <!-- Barra de Chips con scroll horizontal táctil -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" role="tablist" aria-label="Selección de categoría">
        ${list.map(cat => {
          const name = cat.Nombre || cat.ID_Categoria || 'Categoría';
          const isSelected = activeCategory.toLowerCase().trim() === name.toLowerCase().trim();

          return `
            <button
              type="button"
              role="tab"
              aria-selected="${isSelected}"
              data-category="${name}"
              class="category-chip flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-saddle-brown-700 to-saddle-brown-500 text-white shadow-glow-saddle scale-[1.03] ring-2 ring-saddle-brown-300'
                  : 'bg-white text-slate-700 hover:text-saddle-brown-900 hover:bg-saddle-brown-50 border border-slate-200 shadow-sm'
              }"
            >
              <span class="w-2 h-2 rounded-full ${isSelected ? 'bg-saddle-brown-200' : 'bg-saddle-brown-500'}"></span>
              <span>${name}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
