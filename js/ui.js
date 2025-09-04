import { PLAN } from './main.js';

export function fillTreinoSerieSelectors() {
  const selTreino = document.getElementById('sel-treino');
  const selSerie = document.getElementById('sel-serie');
  const treinos = [...new Set(PLAN.map(r => r['TREINO']))].filter(Boolean);
  selTreino.innerHTML = treinos.map(t => `<option value="${t}">${t}</option>`).join('');
  const series = [...new Set(PLAN.map(r => r['SERIE']))].filter(Boolean);
  selSerie.innerHTML = series.map(s => `<option value="${s}">${s}</option>`).join('');
}

export function renderEntryRows() {
  const date = document.getElementById('inp-date').value;
  const treino = document.getElementById('sel-treino').value;
  const serie = document.getElementById('sel-serie').value;
  const tbody = document.querySelector('#tbl-entry tbody');
  const rows = PLAN.filter(r => String(r['TREINO']) === treino && String(r['SERIE']) === serie);

  const isMobile = window.innerWidth < 480;

  tbody.innerHTML = rows.map(r => {
    if (isMobile) {
      return `
        <tr class="mobile-card" data-exercicio="${r['EXERCICIO']}">
          <td>
            <div style="padding:8px; border:1px solid #2b3645; border-radius:12px; margin-bottom:8px; background:#121821;">
              <strong>${r['EXERCICIO']}</strong><br>
              Séries: ${r['SERIES']} • Reps: ${r['REPETICOES']}<br>
              <input type="number" step="0.5" min="0" placeholder="Peso (kg)" class="inp-peso" style="width:100%; margin-top:6px;"/>
              <input type="text" placeholder="Observações (opcional)" class="inp-obs" style="width:100%; margin-top:4px;"/>
            </div>
          </td>
        </tr>
      `;
    } else {
      return `
        <tr data-exercicio="${r['EXERCICIO']}">
          <td>${r['EXERCICIO']}</td>
          <td>${r['SERIES']}</td>
          <td>${r['REPETICOES']}</td>
          <td><input type="number" step="0.5" min="0" placeholder="kg" class="inp-peso" /></td>
          <td><input type="text" placeholder="opcional" class="inp-obs" /></td>
        </tr>
      `;
    }
  }).join('');

  document.getElementById('section-entry').style.display = rows.length ? 'block' : 'none';
  document.getElementById('pill-info').textContent = `${date} • ${treino} • ${serie} • ${rows.length} exercícios`;

  if (isMobile && rows.length) {
    document.getElementById('section-entry').scrollIntoView({ behavior: 'smooth' });
  }
}

export function renderHistory(list){
  const tbody = document.querySelector('#tbl-history tbody');
  tbody.innerHTML = list.map(r => `
    <tr>
      <td>${r['TIMESTAMP'] || ''}</td>
      <td>${r['DATA'] || ''}</td>
      <td>${r['TREINO'] || ''}</td>
      <td>${r['SERIE'] || ''}</td>
      <td>${r['EXERCICIO'] || ''}</td>
      <td>${r['SERIES'] || ''}</td>
      <td>${r['REPETICOES'] || ''}</td>
      <td>${r['PESO'] || ''}</td>
      <td>${r['OBS'] || ''}</td>
    </tr>
  `).join('');
}
