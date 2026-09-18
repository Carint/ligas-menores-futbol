/**
 * Componentes de carga tipo Skeleton (Shimmer) - Tema Claro Deportivo
 */

export function renderMatchesSkeleton() {
  return `
    <div class="space-y-4 animate-pulse">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <div class="h-8 w-20 bg-slate-200 rounded-xl skeleton-shimmer"></div>
        <div class="h-8 w-24 bg-slate-200 rounded-xl skeleton-shimmer"></div>
        <div class="h-8 w-24 bg-slate-200 rounded-xl skeleton-shimmer"></div>
      </div>
      ${Array(3).fill(0).map(() => `
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div class="flex justify-between items-center">
            <div class="h-4 w-24 bg-slate-200 rounded skeleton-shimmer"></div>
            <div class="h-5 w-20 bg-slate-200 rounded-full skeleton-shimmer"></div>
          </div>
          <div class="flex items-center justify-between py-2">
            <div class="flex items-center gap-3 w-5/12">
              <div class="w-10 h-10 rounded-2xl bg-slate-200 skeleton-shimmer"></div>
              <div class="h-4 w-20 bg-slate-200 rounded skeleton-shimmer"></div>
            </div>
            <div class="w-12 h-8 bg-slate-100 rounded-xl skeleton-shimmer"></div>
            <div class="flex items-center gap-3 justify-end w-5/12">
              <div class="h-4 w-20 bg-slate-200 rounded skeleton-shimmer"></div>
              <div class="w-10 h-10 rounded-2xl bg-slate-200 skeleton-shimmer"></div>
            </div>
          </div>
          <div class="h-3 w-32 bg-slate-100 rounded skeleton-shimmer mx-auto"></div>
        </div>
      `).join('')}
    </div>
  `;
}

export function renderStandingsSkeleton() {
  return `
    <div class="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm animate-pulse">
      <div class="h-5 w-36 bg-slate-200 rounded skeleton-shimmer mb-4"></div>
      <div class="space-y-2">
        ${Array(6).fill(0).map(() => `
          <div class="flex items-center justify-between py-2.5 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 rounded bg-slate-200 skeleton-shimmer"></div>
              <div class="h-4 w-28 bg-slate-200 rounded skeleton-shimmer"></div>
            </div>
            <div class="flex gap-4">
              <div class="h-4 w-6 bg-slate-100 rounded skeleton-shimmer"></div>
              <div class="h-4 w-6 bg-slate-100 rounded skeleton-shimmer"></div>
              <div class="h-4 w-8 bg-slate-200 rounded skeleton-shimmer font-bold"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderScorersSkeleton() {
  return `
    <div class="space-y-6 animate-pulse">
      <!-- Podio skeleton -->
      <div class="grid grid-cols-3 gap-2.5 pt-6 items-end">
        <div class="bg-white rounded-2xl border border-slate-200 p-3 h-32 flex flex-col items-center justify-end skeleton-shimmer shadow-sm"></div>
        <div class="bg-white rounded-2xl border border-slate-200 p-3 h-40 flex flex-col items-center justify-end skeleton-shimmer shadow-sm"></div>
        <div class="bg-white rounded-2xl border border-slate-200 p-3 h-28 flex flex-col items-center justify-end skeleton-shimmer shadow-sm"></div>
      </div>
      <!-- Lista skeleton -->
      <div class="bg-white rounded-2xl border border-slate-200 p-3 space-y-3 shadow-sm">
        ${Array(4).fill(0).map(() => `
          <div class="flex items-center justify-between py-2 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-7 h-7 rounded-full bg-slate-200 skeleton-shimmer"></div>
              <div class="space-y-1">
                <div class="h-4 w-28 bg-slate-200 rounded skeleton-shimmer"></div>
                <div class="h-3 w-16 bg-slate-100 rounded skeleton-shimmer"></div>
              </div>
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-200 skeleton-shimmer"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderTeamsSkeleton() {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      ${Array(4).fill(0).map(() => `
        <div class="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-200 skeleton-shimmer"></div>
            <div class="space-y-2 flex-1">
              <div class="h-5 w-32 bg-slate-200 rounded skeleton-shimmer"></div>
              <div class="h-3 w-20 bg-slate-100 rounded skeleton-shimmer"></div>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex justify-between items-center">
            <div class="h-4 w-24 bg-slate-100 rounded skeleton-shimmer"></div>
            <div class="h-8 w-20 bg-slate-200 rounded-xl skeleton-shimmer"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
