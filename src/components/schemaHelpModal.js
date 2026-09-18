/**
 * Modal de ayuda con la estructura esperada de cada pestaña de Google Sheets - Paleta Saddle-Brown
 */

export function renderSchemaHelpModal(isOpen = false) {
  if (!isOpen) return '';

  const sheets = [
    {
      title: 'Categorias',
      variable: 'URL_CATEGORIAS',
      columns: ['ID_Categoria', 'Nombre', 'Descripcion'],
      example: 'CAT-01 | Sub-7 | Categoría para menores de 7 años',
    },
    {
      title: 'Equipos',
      variable: 'URL_EQUIPOS',
      columns: ['ID_Equipo', 'Nombre_Equipo', 'ID_Categoria', 'Entrenador', 'Contacto'],
      example: 'EQ-01 | ADS | CAT-01 | Prof. Mario López | 9988-7766',
    },
    {
      title: 'Partidos',
      variable: 'URL_PARTIDOS',
      columns: ['ID_Partido', 'Categoria', 'Jornada', 'Fecha', 'Cancha', 'Equipo_Local', 'Goles_Local', 'Goles_Visitante', 'Equipo_Visitante', 'Estado'],
      example: 'P-01 | Sub-9 | Jornada 1 | 2026-09-20 08:30 | El Mirador | Savio Jr | 2 | 1 | Olimpia SRC | Finalizado',
    },
    {
      title: 'Tabla_Posiciones',
      variable: 'URL_TABLA_POSICIONES',
      columns: ['Categoria', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'Puntos'],
      example: 'Sub-9 | ADS | 5 | 4 | 1 | 0 | 12 | 3 | 9 | 13',
    },
    {
      title: 'Goles',
      variable: 'URL_GOLES',
      columns: ['ID_Gol', 'ID_Partido', 'ID_Jugador', 'Jugador_Nombre', 'Equipo', 'Minuto', 'Categoria'],
      example: 'G-01 | P-01 | JUG-10 | Carlos Martínez | ADS | 14 | Sub-9',
    },
  ];

  return `
    <div id="schema-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-xl bg-saddle-brown-100 text-saddle-brown-800">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
            <h3 class="text-sm font-black text-slate-900">Estructura de Google Sheets</h3>
          </div>
          <button id="btn-close-modal" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Body con scroll -->
        <div class="p-4 overflow-y-auto space-y-4 text-xs">
          <p class="text-slate-600 font-medium leading-relaxed">
            Asegúrate de que la primera fila (encabezados) de cada pestaña en tu hoja de cálculo coincida con estos nombres de columnas:
          </p>

          <div class="space-y-3">
            ${sheets.map(s => `
              <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="font-extrabold text-saddle-brown-800">${s.title}</span>
                  <code class="text-[10px] text-slate-500 font-mono">${s.variable}</code>
                </div>
                <div class="flex flex-wrap gap-1 mb-2">
                  ${s.columns.map(col => `
                    <span class="bg-white text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-mono border border-slate-200 font-semibold shadow-2xs">
                      ${col}
                    </span>
                  `).join('')}
                </div>
                <p class="text-[11px] text-slate-500">
                  <span class="text-slate-400 font-medium">Ejemplo:</span> ${s.example}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3.5 border-t border-slate-100 bg-slate-50 text-right">
          <button id="btn-close-modal-footer" class="px-5 py-2 rounded-xl bg-saddle-brown-600 hover:bg-saddle-brown-500 text-white font-bold text-xs shadow-sm transition">
            Entendido
          </button>
        </div>
      </div>
    </div>
  `;
}
